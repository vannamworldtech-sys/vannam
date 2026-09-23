import { NextResponse } from 'next/server';
import { getStore } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const store = getStore();
    const students = store.students || [];
    const activities = store.activities || [];
    const attendance = store.attendance || [];
    const homework = store.homework || [];
    const teachers = store.teachers || [];
    const today = new Date().toISOString().split('T')[0];

    const { searchParams } = new URL(request.url);
    const studentQuery = searchParams.get('studentId') || searchParams.get('email');

    // Filter students to the queried parent or student if provided
    let filteredStudents = students;
    if (studentQuery) {
      const q = studentQuery.trim().toLowerCase();
      filteredStudents = students.filter(
        (s) =>
          s.parentEmail?.toLowerCase() === q ||
          s.studentId?.toLowerCase() === q ||
          s.id?.toLowerCase() === q ||
          (s.parentPhone && s.parentPhone.includes(q))
      );
    }

    // Build childrenData dictionary keyed by student.id
    const childrenMap = {};

    filteredStudents.forEach((student, index) => {
      // Calculate attendance statistics
      const studentAttRecords = attendance.filter((att) => att.studentId === student.id);
      const presentCount = studentAttRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
      const totalAtt = studentAttRecords.length;
      const attPercent = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0;

      // Personal activities directly for this student
      const personalActivities = activities.filter((a) => a.studentId === student.id);
      const isNewStudent = totalAtt === 0 && personalActivities.length === 0;
      const studentEnrollmentDate = student.enrollmentDate || student.createdAt?.split('T')[0] || today;

      // Find activities for this student OR general class activities (strictly no activities from other individual students)
      const studentActivities = activities.filter((a) => {
        // If assigned specifically to this student, include it
        if (a.studentId === student.id) return true;
        // Never include activities assigned to another student
        if (a.studentId && a.studentId !== student.id) return false;
        // Class-wide activity without specific studentId:
        if (a.classId === student.classId) {
          // If new student, don't show class activities logged prior to enrollment
          if (isNewStudent) return false;
          if (a.date && a.date < studentEnrollmentDate) return false;
          return true;
        }
        return false;
      });

      // Find homework for their class
      const studentHomework = homework.filter((h) => {
        if (h.classId && h.classId !== student.classId) return false;
        if (h.studentId && h.studentId !== student.id) return false;
        // If new student, don't show past homework due before enrollment or before today
        if (isNewStudent) {
          const hwDue = h.dueDate || h.createdAt?.split('T')[0];
          if (hwDue && hwDue < today) return false;
          if (h.createdAt && h.createdAt < studentEnrollmentDate) return false;
        }
        return true;
      });

      const todayAttRecord = studentAttRecords.find((r) => r.date === today);

      // Teacher details
      const teacherObj = teachers.find(
        (t) => t.id === student.teacherId || t.name === student.teacherName
      );

      const latestActivity = studentActivities[0];

      // Homework completion calculation (checks if class status is COMPLETED or if student marked it completed)
      const completedHwCount = studentHomework.filter((h) =>
        h.status === 'COMPLETED' || (Array.isArray(h.completedStudents) && h.completedStudents.includes(student.id))
      ).length;
      const hwTotal = studentHomework.length;
      const hwPercent = hwTotal > 0 ? Math.round((completedHwCount / hwTotal) * 100) : 0;

      const childId = student.id;

      childrenMap[childId] = {
        id: childId,
        studentId: student.studentId,
        name: student.name,
        gender: student.gender || 'Boy',
        avatarEmoji: student.gender === 'Girl' ? '👧' : '👦',
        avatarBg:
          student.gender === 'Girl'
            ? 'from-amber-400 to-rose-400'
            : index % 2 === 0
            ? 'from-cyan-400 to-blue-500'
            : 'from-emerald-400 to-teal-500',
        grade: student.className || 'Preschool Group',
        classId: student.classId,
        campusId: student.studentId,
        teacher: student.teacherName || 'Lead Educator',
        attendance: isNewStudent ? 'New' : `${attPercent}%`,
        todayStatus: todayAttRecord ? todayAttRecord.status : (isNewStudent ? 'NOT_MARKED' : 'ABSENT'),
        overallProgress: isNewStudent ? 0 : (totalAtt > 0 ? Math.min(96, attPercent) : 0),
        homeworkCompletion: hwPercent,
        isNewStudent,
        enrollmentDate: studentEnrollmentDate,
        insight: isNewStudent
          ? `Welcome to Vannam World! ${student.name}'s learning journey begins now 🌟`
          : latestActivity
          ? `Remarkable progress in ${latestActivity.category || 'Montessori Play'}: ${latestActivity.title}`
          : `Joyful exploration and social milestones blooming this week!`,
        parentName: student.parentName,
        parentEmail: student.parentEmail,
        parentPhone: student.parentPhone,
        photo: student.photo,
        activities: studentActivities.map((act) => ({
          id: act.id,
          time: act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
          title: act.title,
          subject: act.category || 'Montessori Discovery',
          status: 'completed',
          icon: act.category?.includes('Art') ? '🎨' : act.category?.includes('STEAM') ? '🔬' : act.category?.includes('Math') ? '📐' : '🌿',
          teacherNote: act.description,
          photos: act.photos || []
        })),
        homework: studentHomework.map((hw) => {
          const isDone = hw.status === 'COMPLETED' || (Array.isArray(hw.completedStudents) && hw.completedStudents.includes(student.id));
          return {
            id: hw.id,
            subject: hw.subject || 'General Discovery',
            title: hw.title,
            teacher: hw.teacherName || student.teacherName || 'Class Educator',
            dueDate: hw.dueDate || 'Tomorrow',
            status: isDone ? 'completed' : 'in-progress',
            priority: isDone ? 'Completed' : (hw.priority || 'High Priority'),
            priorityColor: isDone
              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
              : (hw.priorityColor || 'bg-rose-100 text-rose-700 border-rose-200'),
            progress: isDone ? 100 : 20,
            description: hw.description,
            materials: hw.materials ? [hw.materials] : ['Montessori Worksheet']
          };
        }),
        teacherFeedback: {
          teacher: student.teacherName || 'Teacher Sarah Jenkins',
          date: latestActivity?.date ? `Logged on ${latestActivity.date}` : 'Today at 11:30 AM',
          avatar: teacherObj?.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
          message: latestActivity
            ? `${student.name} did exceptionally well: ${latestActivity.description}`
            : `${student.name} was joyful, collaborative, and engaged with peer activities today!`
        }
      };
    });

    return NextResponse.json({
      success: true,
      studentsCount: students.length,
      childrenData: childrenMap,
      studentsList: students.map((s) => ({
        id: s.id,
        studentId: s.studentId,
        name: s.name,
        parentName: s.parentName,
        parentEmail: s.parentEmail,
        parentPhone: s.parentPhone,
        className: s.className,
        teacherName: s.teacherName
      }))
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error in portal data API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
