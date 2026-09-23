'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  X,
  Sparkles,
  Users
} from 'lucide-react';
import { useAdminToast } from '../layout';

export default function StudentsManager() {
  const { showToast } = useAdminToast();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showPinMap, setShowPinMap] = useState({});

  const [form, setForm] = useState({
    name: '',
    studentId: '',
    dob: '',
    gender: 'Boy',
    classId: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    parentPin: '2026',
    emergencyContact: '',
    bloodGroup: 'B+',
    allergies: 'None',
    status: 'Active',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studRes, classRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/classes')
      ]);

      const [studData, classData] = await Promise.all([
        studRes.json(),
        classRes.json()
      ]);

      setStudents(studData.students || []);
      setClasses(classData.classes || []);
    } catch {
      showToast('Failed to load students roster', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingStudent(null);
    setForm({
      name: '',
      studentId: `VW-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`,
      dob: '2023-01-01',
      gender: 'Boy',
      classId: classes[0]?.id || '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      parentPin: '2026',
      emergencyContact: '',
      bloodGroup: 'B+',
      allergies: 'None',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name || '',
      studentId: student.studentId || '',
      dob: student.dob || '',
      gender: student.gender || 'Boy',
      classId: student.classId || '',
      parentName: student.parentName || '',
      parentEmail: student.parentEmail || '',
      parentPhone: student.parentPhone || '',
      parentPin: student.parentPin || '2026',
      emergencyContact: student.emergencyContact || '',
      bloodGroup: student.bloodGroup || 'B+',
      allergies: student.allergies || 'None',
      status: student.status || 'Active',
      photo: student.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80'
    });
    setIsModalOpen(true);
  };

  const handleQuickResetPin = async (student) => {
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: student.id,
          parentPin: '2026'
        })
      });
      if (!res.ok) throw new Error('Failed to reset PIN');
      showToast(`Parent PIN for ${student.name} reset to 2026`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      const url = '/api/admin/students';
      const method = editingStudent ? 'PUT' : 'POST';
      const payload = editingStudent ? { ...form, id: editingStudent.id } : form;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save student');

      showToast(editingStudent ? 'Student details updated' : 'New student enrolled successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const res = await fetch(`/api/admin/students?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to archive student');

      showToast(data.parentAccessRevoked ? 'Student archived & parent login access revoked' : 'Student record archived');
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00A8E8] uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Student Administration</span>
          </div>
          <h1 className="text-2xl font-black text-[#0F2963] tracking-tight">
            Enrolled Students Roster
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage student registrations, classroom assignments, emergency contacts & health logs.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2963] hover:bg-[#00A8E8] text-white font-bold text-sm shadow-md shadow-[#0F2963]/10 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, ID (e.g. VW-2026-001) or parent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
          />
        </div>

        <div>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
          >
            <option value="all">All Classrooms ({students.length})</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table / Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <div className="w-8 h-8 border-4 border-[#00A8E8] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading student roster...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No students found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || selectedClassFilter !== 'all'
              ? 'Try adjusting your filters or search keywords.'
              : 'Enroll your first student using the button above.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Classroom</th>
                  <th className="px-6 py-4">Parent / Guardian</th>
                  <th className="px-6 py-4">Parent Portal Login (Email & PIN)</th>
                  <th className="px-6 py-4">Health & Blood</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0">
                          <Image
                            src={student.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80'}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[#0F2963]">{student.name}</div>
                          <div className="text-[11px] font-mono font-semibold text-[#00A8E8]">
                            {student.studentId} • {student.gender}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        <Users className="w-3 h-3 text-indigo-500" />
                        {student.className || 'General'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{student.parentName || 'N/A'}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {student.parentPhone || 'N/A'}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#00A8E8] shrink-0" />
                          <span className="truncate max-w-[170px]" title={student.parentEmail}>{student.parentEmail || 'No email assigned'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            PIN: {showPinMap[student.id] ? (student.parentPin || '2026') : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPinMap(prev => ({ ...prev, [student.id]: !prev[student.id] }))}
                            className="p-1 text-slate-400 hover:text-slate-700 text-xs rounded hover:bg-slate-100 transition cursor-pointer"
                            title={showPinMap[student.id] ? "Hide PIN" : "Reveal PIN"}
                          >
                            {showPinMap[student.id] ? '🙈' : '👁️'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickResetPin(student)}
                            className="text-[10px] font-bold text-[#00A8E8] hover:text-[#0F2963] px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200 hover:bg-sky-100 transition cursor-pointer"
                            title="Reset PIN to 2026 if parent forgot"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 mr-1.5">
                          {student.bloodGroup || 'N/A'}
                        </span>
                        <span className="text-slate-500 text-[11px]">{student.allergies || 'No allergies'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          student.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#0F2963] hover:bg-slate-100 transition"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(student.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Archive Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete / Archive Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Archive Student?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This student will be removed from active classroom rosters and attendance sheets. Parent account credentials will remain securely saved in Accounts & Credentials.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStudent(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition cursor-pointer"
              >
                Archive Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0F2963] text-white flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F2963]">
                    {editingStudent ? 'Edit Student Details' : 'Enroll New Student'}
                  </h3>
                  <p className="text-xs text-slate-500">Enter demographic, guardian, and health information</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID *</label>
                  <input
                    type="text"
                    required
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Classroom Assignment *</label>
                  <select
                    required
                    value={form.classId}
                    onChange={(e) => setForm({ ...form, classId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  >
                    <option value="">Select a Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Deepak Sharma"
                    value={form.parentName}
                    onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98401 23456"
                    value={form.parentPhone}
                    onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Email</label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={form.parentEmail}
                    onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Portal PIN / Password</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026"
                    value={form.parentPin || ''}
                    onChange={(e) => setForm({ ...form, parentPin: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800 font-mono font-bold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Default is 2026. Parent uses this to log into /portal.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Hotline Contact</label>
                  <input
                    type="text"
                    placeholder="+91 98401 23456"
                    value={form.emergencyContact}
                    onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Allergies / Special Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Peanut allergy, Asthma, None"
                    value={form.allergies}
                    onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00A8E8] text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0F2963] hover:bg-[#00A8E8] text-white shadow-md transition cursor-pointer"
                >
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
