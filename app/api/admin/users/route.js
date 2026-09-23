import { NextResponse } from 'next/server';
import { getStore, saveStore } from '@/lib/dataStore';
import { verifySessionToken } from '@/lib/auth';
import pool from '@/lib/db';

function getSessionUser(request) {
  // 1. Try signed JWT session token (vannam_session)
  try {
    const jwtCookie = request.cookies.get('vannam_session');
    if (jwtCookie?.value) {
      const decoded = verifySessionToken(jwtCookie.value);
      if (decoded && decoded.id) {
        return decoded;
      }
    }
  } catch (_) {}

  // 2. Fallback to client layout cookie (vannam_admin_session)
  try {
    const adminSessionCookie = request.cookies.get('vannam_admin_session');
    if (adminSessionCookie?.value) {
      const val = adminSessionCookie.value;
      if (typeof val === 'string' && val.startsWith('{')) {
        return JSON.parse(val);
      }
    }
  } catch (_) {}
  return null;
}

function checkIsAdmin(sessionUser) {
  if (!sessionUser) return false;
  const role = (sessionUser.role || '').toUpperCase();
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export async function GET(request) {
  const sessionUser = getSessionUser(request);
  const isAdmin = checkIsAdmin(sessionUser);
  const store = getStore();

  const safeUsers = (store.users || []).map((u) => {
    // Only Admin can see other users' passwords in plaintext.
    // A non-admin user can only see their own password if matched; all other accounts have password masked.
    const isSelf = sessionUser && (
      u.id === sessionUser.id || 
      (u.email || '').toLowerCase() === (sessionUser.email || '').toLowerCase()
    );
    const canViewPassword = isAdmin || isSelf;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      password: canViewPassword ? u.password : '••••••••',
      role: u.role,
      avatar: u.avatar,
      lastLogin: u.lastLogin,
      canEdit: isAdmin || isSelf,
      canViewPassword
    };
  });

  return NextResponse.json({
    success: true,
    users: safeUsers,
    isAdmin,
    currentUserId: sessionUser?.id || null
  });
}

export async function POST(request) {
  try {
    const sessionUser = getSessionUser(request);
    const isAdmin = checkIsAdmin(sessionUser);

    if (!isAdmin) {
      return NextResponse.json({
        error: 'Permission Denied: Only Super Admin is authorized to create new staff or administrator accounts.'
      }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, avatar, user } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const store = getStore();
    const existing = (store.users || []).find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: role || 'content_manager',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
      lastLogin: null
    };

    // Ensure teacher record exists in store.teachers if role is TEACHER
    if ((newUser.role || '').toUpperCase() === 'TEACHER') {
      const existingTeacher = (store.teachers || []).find(
        (t) => t.email?.toLowerCase() === newUser.email.toLowerCase()
      );
      if (!existingTeacher) {
        const newTeacherRecord = {
          id: `teacher-${Date.now()}`,
          name: newUser.name,
          email: newUser.email,
          role: 'Lead Educator',
          experience: '5+ Years',
          qualifications: 'AMI Montessori Certified',
          bio: 'Early childhood educator committed to developmental exploration and child care.',
          image: newUser.avatar,
          active: true
        };
        store.teachers = [...(store.teachers || []), newTeacherRecord];
        newUser.teacherId = newTeacherRecord.id;
      } else {
        newUser.teacherId = existingTeacher.id;
      }
    }

    store.users = [...(store.users || []), newUser];
    saveStore(store, {
      action: 'Created Admin User',
      userId: sessionUser?.id || user?.id || 'usr-1',
      userName: sessionUser?.name || user?.name || 'Administrator',
      resource: 'Users',
      details: `Created new admin user: ${name} (${role})`
    });

    // Sync to Neon PostgreSQL
    try {
      await pool.query(`
        INSERT INTO users (id, name, email, password, role, avatar, last_login)
        VALUES ($1, $2, $3, $4, $5, $6, NULL)
        ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role;
      `, [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.avatar]);
    } catch (neonErr) {
      console.warn("Neon sync note (POST user):", neonErr.message);
    }

    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sessionUser = getSessionUser(request);
    const isAdmin = checkIsAdmin(sessionUser);

    const body = await request.json();
    const { id, name, email, password, role, avatar, user } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const store = getStore();
    const index = (store.users || []).findIndex(u => u.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const targetUser = store.users[index];
    const isEditingSelf = sessionUser && (
      targetUser.id === sessionUser.id || 
      (targetUser.email || '').toLowerCase() === (sessionUser.email || '').toLowerCase()
    );

    // Strict RBAC: Only Super Admin can edit other users' email, password, or role
    if (!isAdmin && !isEditingSelf) {
      return NextResponse.json({
        error: 'Permission Denied: Only Super Admin can edit other members’ password or email.'
      }, { status: 403 });
    }

    // Non-admin editing themselves cannot elevate their own role
    if (!isAdmin && role && role !== targetUser.role) {
      return NextResponse.json({
        error: 'Permission Denied: Only Super Admin can modify account role permissions.'
      }, { status: 403 });
    }

    if (name) store.users[index].name = name.trim();
    if (email) store.users[index].email = email.trim().toLowerCase();
    if (password) store.users[index].password = password.trim();
    if (role && isAdmin) store.users[index].role = role;
    if (avatar) store.users[index].avatar = avatar;

    saveStore(store, {
      action: 'Updated User Credentials',
      userId: sessionUser?.id || user?.id || 'usr-1',
      userName: sessionUser?.name || user?.name || 'Administrator',
      resource: 'Users',
      details: `Updated credentials for user ${store.users[index].name} (${store.users[index].email})`
    });

    // Sync to Neon PostgreSQL
    try {
      const u = store.users[index];
      await pool.query(`
        UPDATE users SET
          name = $1, email = $2, password = $3, role = $4, avatar = $5
        WHERE id = $6;
      `, [u.name, u.email, u.password, u.role, u.avatar, id]);
    } catch (neonErr) {
      console.warn("Neon sync note (PUT user):", neonErr.message);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: store.users[index].id,
        name: store.users[index].name,
        email: store.users[index].email,
        role: store.users[index].role,
        avatar: store.users[index].avatar
      },
      message: 'Credentials updated successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const sessionUser = getSessionUser(request);
    const isAdmin = checkIsAdmin(sessionUser);

    if (!isAdmin) {
      return NextResponse.json({
        error: 'Permission Denied: Only Super Admin can delete account credentials.'
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const store = getStore();
    const targetUser = (store.users || []).find(u => u.id === id);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Safety 1: Prevent user from deleting their own active session account
    if (sessionUser && (targetUser.id === sessionUser.id || (targetUser.email || '').toLowerCase() === (sessionUser.email || '').toLowerCase())) {
      return NextResponse.json({
        error: 'Safety restriction: You cannot delete your own active administrator account.'
      }, { status: 400 });
    }

    // Safety 2: Protect primary system administrator account
    if (targetUser.email?.toLowerCase() === 'admin@vannam.edu') {
      return NextResponse.json({
        error: 'System restriction: The primary system administrator account (admin@vannam.edu) cannot be deleted.'
      }, { status: 400 });
    }

    store.users = (store.users || []).filter(u => u.id !== id);

    saveStore(store, {
      action: 'Deleted User Account',
      userId: sessionUser?.id || 'usr-1',
      userName: sessionUser?.name || 'Administrator',
      resource: 'Users',
      details: `Deleted user account: ${targetUser.name} (${targetUser.email})`
    });

    // Sync to Neon PostgreSQL
    try {
      await pool.query('DELETE FROM users WHERE id = $1;', [id]);
    } catch (neonErr) {
      console.warn("Neon sync note (DELETE user):", neonErr.message);
    }

    return NextResponse.json({ success: true, message: 'User account removed' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
