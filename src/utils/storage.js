/* ============================================================
   Storage helpers — localStorage-backed data layer.
   Direct port of the original vanilla-JS storage helpers.
   ============================================================ */

export const STORAGE_KEYS = {
  QUESTIONS: "fpa_questions", // { "Dept__Designation": [question, ...] }
  SUBMISSIONS: "fpa_submissions", // [ submission, ... ]
  ADMIN: "fpa_admin_credentials", // { username, password }
};

// Default admin credentials (created once, on first run)
export function ensureAdminCredentials() {
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN)) {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN,
      JSON.stringify({ username: "admin", password: "admin123" })
    );
  }
}

export function getAdminCredentials() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN));
}

export function getQuestions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || "{}");
}

export function saveQuestions(data) {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(data));
}

export function getSubmissions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || "[]");
}

export function saveSubmissions(data) {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(data));
}

export function formKey(dept, desig) {
  return `${dept}__${desig}`;
}

export function designationLabel(code) {
  const map = {
    AP1: "Assistant Professor I (AP1)",
    AP2: "Assistant Professor II (AP2)",
    AP3: "Assistant Professor III (AP3)",
    APSG: "Assistant Professor Senior Grade (APSG)",
    "Associate Professor": "Associate Professor",
    Professor: "Professor",
  };
  return map[code] || code;
}

export function roundClean(num) {
  return Math.round(num * 100) / 100;
}
