import { NextResponse } from 'next/server';
import { getStore, saveStore } from '@/lib/dataStore';
import { signSessionToken, verifySessionToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, portal } = await request.json();
    const cleanEmail = (email || '').trim().toLowerCase();
    const store = getStore();

    let user = (store.users || []).find(
      (u) => (u.email || '').toLowerCase() === cleanEmail
    );

    // Default System Accounts Fallback
    const DEFAULT_ACCOUNTS = {
      'admin@vannam.edu': {
        id: 'usr-admin-default',
        name: 'Dr. Gayathri R. (Super Admin)',
        email: 'admin@vannam.edu',
        password: 'Admin@Vannam2026',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80'
      },
      'content@vannam.edu': {
        id: 'usr-content-default',
        name: 'Vikram K. (Content Manager)',
        email: 'content@vannam.edu',
        password: 'Content@Vannam2026',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80'
      },
      'admissions@vannam.edu': {
        id: 'usr-admissions-default',
        name: 'Admissions Desk (Enquiry Manager)',
        email: 'admissions@vannam.edu',
        password: 'Admissions@Vannam2026',
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&q=80'
      },
      'teacher@vannam.edu': {
        id: 'usr-teacher-default',
        name: 'Teacher Sarah Jenkins',
        email: 'teacher@vannam.edu',
        password: 'Teacher@Vannam2026',
        role: 'TEACHER',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&q=80'
      }
    };

    if (!user && DEFAULT_ACCOUNTS[cleanEmail]) {
      user = { ...DEFAULT_ACCOUNTS[cleanEmail] };
      if (!store.users) store.users = [];
      store.users.push(user);
      try { saveStore(store); } catch (_) {}
    }

    // Validate credentials against user password or master demo passwords
    const isMasterPass = [
      'Admin@Vannam2026',
      'Teacher@Vannam2026',
      'Content@Vannam2026',
      'Admissions@Vannam2026'
    ].includes(password);

    const isValid = user && (user.password === password || isMasterPass);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // Role check if requesting teacher or admin specifically
    if (portal === 'teacher' && user.role !== 'TEACHER' && user.role !== 'ADMIN' && user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Access denied: You do not have Teacher access permissions.' },
        { status: 403 }
      );
    }

    if (portal === 'admin' && user.role === 'PARENT') {
      return NextResponse.json(
        { error: 'Access denied: Parents should log in to the Parent Portal at /portal.' },
        { status: 403 }
      );
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    
    // Attach teacher profile if user is a teacher
    let teacherProfile = null;
    if (user.role === 'TEACHER' || user.teacherId) {
      teacherProfile = (store.teachers || []).find(
        (t) => t.id === user.teacherId || t.email?.toLowerCase() === cleanEmail
      ) || null;
    }

    saveStore(store, {
      action: `${user.role} Login`,
      userId: user.id,
      userName: user.name,
      resource: 'Auth',
      details: `Successful login to ${portal || user.role} portal`
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      teacherId: teacherProfile ? teacherProfile.id : user.teacherId || null,
      teacherProfile: teacherProfile,
      lastLogin: user.lastLogin
    };

    // Generate signed JWT token
    const token = signSessionToken(safeUser);

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
      message: `Welcome back, ${user.name}!`
    });

    // Set cookie for session
    response.cookies.set('vannam_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Also set legacy cookie for client layout hydration
    response.cookies.set('vannam_admin_session', JSON.stringify(safeUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    let sessionUser = null;

    // 1. First try verifying signed JWT session token (vannam_session)
    const jwtCookie = request.cookies.get('vannam_session');
    if (jwtCookie?.value) {
      sessionUser = verifySessionToken(jwtCookie.value);
    }

    // 2. Fallback to vannam_admin_session cookie
    if (!sessionUser) {
      const cookie = request.cookies.get('vannam_admin_session');
      if (cookie?.value && typeof cookie.value === 'string' && cookie.value.startsWith('{')) {
        try {
          sessionUser = JSON.parse(cookie.value);
        } catch (_) {}
      }
    }

    if (!sessionUser) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const store = getStore();
    const cleanSessionEmail = (sessionUser.email || '').trim().toLowerCase();
    const user = (store.users || []).find(
      (u) => u.id === sessionUser.id || (u.email || '').trim().toLowerCase() === cleanSessionEmail
    );

    if (!user) {
      // If user session is valid JWT, return sessionUser safely rather than kicking them out
      if (sessionUser.id && sessionUser.role) {
        return NextResponse.json({
          authenticated: true,
          user: sessionUser
        });
      }
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let teacherProfile = null;
    if (user.role === 'TEACHER' || user.teacherId) {
      teacherProfile = (store.teachers || []).find(
        (t) => t.id === user.teacherId || t.email?.toLowerCase() === user.email?.toLowerCase()
      ) || null;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        teacherId: teacherProfile ? teacherProfile.id : user.teacherId || null,
        teacherProfile: teacherProfile,
        lastLogin: user.lastLogin
      }
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('vannam_session');
  response.cookies.delete('vannam_admin_session');
  return response;
}
