const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("adminToken");

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

/* ─── AUTH ─────────────────────────────────────────────────────────────── */
export const adminLogin = (userId, password) =>
  request("/auth/admin/login", { method: "POST", body: { userId, password }, auth: false });

/* ─── INTERNS (Students) ──────────────────────────────────────────────── */
export const fetchInterns = () => request("/students");

export const createIntern = (payload) =>
  request("/students", { method: "POST", body: payload });

export const deleteIntern = (id) =>
  request(`/students/${id}`, { method: "DELETE" });

export const updateInternStatus = (id, status) =>
  request(`/students/${id}/status`, { method: "PATCH", body: { status } });

/* ─── JOB POSTINGS ─────────────────────────────────────────────────────── */
export const fetchJobs = () => request("/jobs");

export const createJob = (payload) =>
  request("/jobs", { method: "POST", body: payload });

export const closeJob = (id) =>
  request(`/jobs/${id}/close`, { method: "PATCH" });

export const deleteJob = (id) =>
  request(`/jobs/${id}`, { method: "DELETE" });

/* ─── MAPPERS: backend shape → UI shape ───────────────────────────────── */
const COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f0a500"];

export const mapIntern = (s, i = 0) => ({
  id: s._id,
  name: s.name,
  email: s.email,
  phone: s.phone,
  dept: s.department || "Unassigned",
  college: s.college,
  startDate: s.startDate,
  duration: s.duration,
  score: s.score || 0,
  tasks: s.tasksCompleted || 0,
  status: s.status || "Active",
  joined: s.startDate
    ? new Date(s.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : new Date(s.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
  color: COLORS[i % COLORS.length],
});

export const mapJob = (j) => ({
  id: j._id,
  title: j.title,
  dept: j.department,
  openings: j.openings,
  applied: j.applied || 0,
  deadline: new Date(j.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  status: j.status,
});
