import { NextResponse } from 'next/server';
import { getStore, saveStore } from '@/lib/dataStore';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const teacherId = searchParams.get('teacherId');
    const search = searchParams.get('search')?.toLowerCase();

    const store = getStore();
    let students = store.students || [];

    // Filter by class
    if (classId) {
      students = students.filter(s => s.classId === classId);
    }

    // Filter by teacher
    if (teacherId) {
      students = students.filter(s => s.teacherId === teacherId);
    }

    // Filter by search query
    if (search) {
      students = students.filter(
        s =>
          s.name?.toLowerCase().includes(search) ||
          s.studentId?.toLowerCase().includes(search) ||
          s.parentName?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const store = getStore();

    if (!body.name || !body.classId) {
      return NextResponse.json({ error: 'Student name and class assignment are required' }, { status: 400 });
    }

    const assignedClass = (store.classes || []).find(c => c.id === body.classId);

    const newStudent = {
      id: `std-${Date.now()}`,
      studentId: body.studentId || `VW-${new Date().getFullYear()}-${String((store.students || []).length + 1).padStart(3, '0')}`,
      name: body.name.trim(),
      dob: body.dob || '',
      gender: body.gender || 'Boy',
      classId: body.classId,
      className: assignedClass ? assignedClass.name : 'Unassigned',
      teacherId: assignedClass ? assignedClass.teacherId : body.teacherId || '',
      teacherName: assignedClass ? assignedClass.teacherName : '',
      parentName: body.parentName || '',
      parentEmail: body.parentEmail || '',
      parentPhone: body.parentPhone || '',
      parentPin: body.parentPin || '2026',
      emergencyContact: body.emergencyContact || body.parentPhone || '',
      bloodGroup: body.bloodGroup || '',
      allergies: body.allergies || 'None',
      status: body.status || 'Active',
      enrollmentDate: body.enrollmentDate || new Date().toISOString().split('T')[0],
      photo: body.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
      createdAt: new Date().toISOString()
    };

    // Auto-create or ensure Parent user credentials in users store
    if (newStudent.parentEmail) {
      const parentEmailLower = newStudent.parentEmail.trim().toLowerCase();
      const existingUser = (store.users || []).find(u => u.email?.toLowerCase() === parentEmailLower);
      if (!existingUser) {
        store.users = [
          ...(store.users || []),
          {
            id: `usr-parent-${Date.now()}`,
            name: newStudent.parentName || 'Parent',
            email: parentEmailLower,
            password: newStudent.parentPin || '2026',
            role: 'PARENT',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
            lastLogin: null
          }
        ];
      }
    }

    store.students = [newStudent, ...(store.students || [])];

    saveStore(store, {
      action: 'Create Student',
      resource: 'Students',
      details: `Enrolled new student: ${newStudent.name} (${newStudent.studentId}) in ${newStudent.className}`
    });

    // Sync to Neon PostgreSQL
    try {
      await pool.query(`
        INSERT INTO students (
          id, student_id, name, dob, gender, class_id, class_name, teacher_id, teacher_name,
          parent_name, parent_email, parent_phone, parent_pin, emergency_contact,
          blood_group, allergies, status, enrollment_date, photo, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (id) DO NOTHING;
      `, [
        newStudent.id, newStudent.studentId, newStudent.name, newStudent.dob || null, newStudent.gender,
        newStudent.classId, newStudent.className, newStudent.teacherId, newStudent.teacherName,
        newStudent.parentName, newStudent.parentEmail, newStudent.parentPhone, newStudent.parentPin,
        newStudent.emergencyContact, newStudent.bloodGroup, newStudent.allergies, newStudent.status,
        newStudent.enrollmentDate || null, newStudent.photo, new Date()
      ]);

      if (newStudent.parentEmail) {
        await pool.query(`
          INSERT INTO users (id, name, email, password, role, avatar)
          VALUES ($1, $2, $3, $4, 'PARENT', $5)
          ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password;
        `, [
          `usr-parent-${newStudent.id}`,
          newStudent.parentName || 'Parent',
          newStudent.parentEmail.trim().toLowerCase(),
          newStudent.parentPin || '2026',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80'
        ]);
      }
    } catch (neonErr) {
      console.warn("Neon sync note (POST student):", neonErr.message);
    }

    return NextResponse.json({ success: true, student: newStudent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create student' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const store = getStore();
    const index = (store.students || []).findIndex(s => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Update class info if classId changed
    if (updates.classId && updates.classId !== store.students[index].classId) {
      const assignedClass = (store.classes || []).find(c => c.id === updates.classId);
      if (assignedClass) {
        updates.className = assignedClass.name;
        updates.teacherId = assignedClass.teacherId;
        updates.teacherName = assignedClass.teacherName;
      }
    }

    // Sync PIN update to parent user in users store
    if (updates.parentPin || updates.parentEmail) {
      const emailToSync = (updates.parentEmail || store.students[index].parentEmail)?.trim().toLowerCase();
      if (emailToSync) {
        const userIndex = (store.users || []).findIndex(u => u.email?.toLowerCase() === emailToSync);
        if (userIndex !== -1 && updates.parentPin) {
          store.users[userIndex].password = updates.parentPin;
        }
      }
    }

    store.students[index] = {
      ...store.students[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveStore(store, {
      action: 'Update Student',
      resource: 'Students',
      details: `Updated record for student: ${store.students[index].name}`
    });

    // Sync to Neon PostgreSQL
    try {
      const updated = store.students[index];
      await pool.query(`
        UPDATE students SET
          name = $1, dob = $2, gender = $3, class_id = $4, class_name = $5,
          teacher_id = $6, teacher_name = $7, parent_name = $8, parent_email = $9,
          parent_phone = $10, parent_pin = $11, emergency_contact = $12,
          blood_group = $13, allergies = $14, status = $15, photo = $16
        WHERE id = $17;
      `, [
        updated.name, updated.dob || null, updated.gender, updated.classId, updated.className,
        updated.teacherId, updated.teacherName, updated.parentName, updated.parentEmail,
        updated.parentPhone, updated.parentPin, updated.emergencyContact,
        updated.bloodGroup, updated.allergies, updated.status, updated.photo,
        id
      ]);

      if (updated.parentPin && updated.parentEmail) {
        await pool.query(`
          UPDATE users SET password = $1 
          WHERE LOWER(email) = LOWER($2);
        `, [updated.parentPin, updated.parentEmail.trim()]);
      }
    } catch (neonErr) {
      console.warn("Neon sync note (PUT student):", neonErr.message);
    }

    return NextResponse.json({ success: true, student: store.students[index] });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const store = getStore();
    const student = (store.students || []).find(s => s.id === id);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const parentEmail = student.parentEmail?.trim().toLowerCase();

    // Remove student from roster
    store.students = (store.students || []).filter(s => s.id !== id);

    saveStore(store, {
      action: 'Archive Student',
      resource: 'Students',
      details: `Archived student record: ${student.name} (${student.studentId}). Parent login credentials preserved.`
    });

    // Sync to Neon PostgreSQL
    try {
      await pool.query('DELETE FROM students WHERE id = $1;', [id]);
    } catch (neonErr) {
      console.warn("Neon sync note (DELETE student):", neonErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Student archived successfully. Parent account preserved.',
      parentAccessRevoked: false
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete student' }, { status: 500 });
  }
}
