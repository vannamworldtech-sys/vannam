import { NextResponse } from 'next/server';
import { getStore, saveStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { activityId, studentId, status } = body;

    if (!activityId || !studentId) {
      return NextResponse.json({ error: 'activityId and studentId are required' }, { status: 400 });
    }

    const store = getStore();
    const activitiesList = store.activities || [];
    const index = activitiesList.findIndex(a => a.id === activityId);

    if (index === -1) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    const act = activitiesList[index];
    const completedStudents = new Set(Array.isArray(act.completedStudents) ? act.completedStudents : []);

    if (status === 'completed') {
      completedStudents.add(studentId);
    } else {
      completedStudents.delete(studentId);
    }

    store.activities[index] = {
      ...act,
      completedStudents: Array.from(completedStudents),
      updatedAt: new Date().toISOString()
    };

    saveStore(store, {
      action: 'Update Activity Completion',
      resource: 'Activities',
      details: `Student ${studentId} marked activity "${act.title}" as ${status}`
    });

    return NextResponse.json({
      success: true,
      activity: store.activities[index]
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update activity completion' }, { status: 500 });
  }
}
