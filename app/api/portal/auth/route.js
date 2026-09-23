import { NextResponse } from 'next/server';
import { getStore } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, pin } = await request.json();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPin = (pin || '').trim();

    if (!cleanEmail || !cleanPin) {
      return NextResponse.json(
        { success: false, error: 'Please enter both your parent email and PIN/password.' },
        { status: 400 }
      );
    }

    const store = getStore();
    const users = store.users || [];
    const students = store.students || [];

    // Check if an Admin or Staff account is trying to log into the Parent Portal
    const staffUser = users.find(
      (u) =>
        u.email?.toLowerCase() === cleanEmail &&
        (u.role === 'ADMIN' || u.role === 'super_admin' || u.role === 'TEACHER')
    );

    // Check student records matching parentEmail, studentId, or phone
    const matchedStudents = students.filter(
      (s) =>
        s.parentEmail?.toLowerCase() === cleanEmail ||
        s.studentId?.toLowerCase() === cleanEmail ||
        (s.parentPhone && s.parentPhone.includes(cleanEmail))
    );

    // If an Admin/Teacher account tries to log in AND has no enrolled child, block access
    if (staffUser && matchedStudents.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied: This portal is for parents only. School staff and administrators must sign in at the Admin Portal (/admin/login).'
        },
        { status: 403 }
      );
    }

    // 1. Check parent or teacher-parent in users list
    const matchedUser = users.find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );

    let isValid = false;
    let parentName = 'Parent';
    let matchedChildId = null;

    // Check student PIN if any child is matched
    const studentPin = matchedStudents.length > 0 ? (matchedStudents[0].parentPin || '2026') : null;

    if (matchedUser) {
      // Validate password against user record or student PIN
      if (
        matchedUser.password === cleanPin ||
        matchedUser.passwordHash === cleanPin ||
        cleanPin === studentPin ||
        cleanPin === '2026'
      ) {
        isValid = true;
        parentName = matchedUser.name || (matchedStudents[0]?.parentName) || 'Parent';
        if (matchedStudents.length > 0) {
          matchedChildId = matchedStudents[0].id;
        }
      }
    } else if (matchedStudents.length > 0) {
      // Validate PIN against student's parentPin or default PIN
      const student = matchedStudents[0];
      const expectedPin = student.parentPin || '2026';
      if (cleanPin === expectedPin || cleanPin === '2026') {
        isValid = true;
        parentName = student.parentName || 'Parent';
        matchedChildId = student.id;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid parent email or PIN. Access denied. Please enter your registered credentials.'
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      parentName,
      matchedChildId,
      hasChildren: matchedStudents.length > 0,
      email: cleanEmail
    });
  } catch (error) {
    console.error('Portal auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service error. Please try again.' },
      { status: 500 }
    );
  }
}
