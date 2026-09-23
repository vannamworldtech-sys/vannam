import { NextResponse } from 'next/server';
import { getStore, saveStore } from '@/lib/dataStore';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { homeworkId, studentId, status } = body;

    if (!homeworkId || !studentId) {
      return NextResponse.json({ error: 'homeworkId and studentId are required' }, { status: 400 });
    }

    const store = getStore();
    const homeworkList = store.homework || [];
    const index = homeworkList.findIndex(h => h.id === homeworkId);

    if (index === -1) {
      return NextResponse.json({ error: 'Homework not found' }, { status: 404 });
    }

    const hw = homeworkList[index];
    const completedStudents = new Set(Array.isArray(hw.completedStudents) ? hw.completedStudents : []);

    if (status === 'completed') {
      completedStudents.add(studentId);
    } else {
      completedStudents.delete(studentId);
    }

    store.homework[index] = {
      ...hw,
      completedStudents: Array.from(completedStudents),
      updatedAt: new Date().toISOString()
    };

    saveStore(store, {
      action: 'Update Homework Completion',
      resource: 'Homework',
      details: `Student ${studentId} marked homework "${hw.title}" as ${status}`
    });

    return NextResponse.json({
      success: true,
      homework: store.homework[index]
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update homework completion' }, { status: 500 });
  }
}
