const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("studentToken");

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
export const studentLogin = (userId, password) =>
  request("/auth/login", { method: "POST", body: { userId, password }, auth: false });

export const fetchMe = () => request("/auth/student/me");

export const updateProfile = (payload) =>
  request("/auth/student/me", { method: "PATCH", body: payload });

/* ─── PERSONAL TASKS ───────────────────────────────────────────────────── */
export const fetchTasks = () => request("/tasks");
export const createTask = (payload) => request("/tasks", { method: "POST", body: payload });
export const updateTaskStatus = (id, status) => request(`/tasks/${id}`, { method: "PATCH", body: { status } });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });

/* ─── MOCK TESTS ───────────────────────────────────────────────────────── */
export const fetchTests = () => request("/mocktests");
export const submitTest = (id, answers) =>
  request(`/mocktests/${id}/submit`, { method: "POST", body: { answers } });

/* ─── JOB BOARD (read-only, populated by Admin's Job Postings) ────────── */
export const fetchActiveJobs = () => request("/jobs/active");
export const applyToJob = (id) => request(`/jobs/${id}/apply`, { method: "POST" });

/* ─── PASSWORD ─────────────────────────────────────────────────────────── */
export const changePassword = (currentPassword, newPassword) =>
  request("/students/me/password", { method: "PATCH", body: { currentPassword, newPassword } });

/* ─── MAPPERS: backend shape → UI shape ───────────────────────────────── */
export const mapTask = (t) => ({
  id: t._id,
  title: t.title,
  dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : "",
  priority: t.priority,
  note: t.note,
  status: t.status,
});

export const mapTest = (t) => ({
  id: t._id,
  title: t.title,
  duration: t.duration,
  status: t.status,
  score: t.score,
  questions: t.questions,
});

export const mapJob = (j) => ({
  id: j._id,
  title: j.title,
  dept: j.department,
  openings: j.openings,
  deadline: new Date(j.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
});
