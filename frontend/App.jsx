
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  GripVertical,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Circle,
  Clock,
  BarChart2,
  Search,
  SlidersHorizontal,
  Sun,
  Moon,
  RotateCcw,
  Download,
  Globe2,
  Upload,
  ListChecks,
  LogOut,
  User,
} from "lucide-react";
import { Login, Register } from "./Auth.jsx";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const THEME_KEY = "dtm_theme_v2";
const USER_KEY = "dtm_user";
const AUTH_LANG_KEY = "dtm_auth_lang";

const MAIN_COPY = {
  en: {
    languageName: "العربية",
    logout: "Log out",
    logoutToast: "Logged out successfully",
  },
  ar: {
    languageName: "English",
    logout: "تسجيل الخروج",
    logoutToast: "تم تسجيل الخروج بنجاح",
  },
};

const FILTERS = ["all", "completed", "pending"];
const UI_COPY = {
  en: {
    languageName: "العربية",
    appTitleStart: "Task",
    appTitleAccent: "Manager",
    tagline: "Plan better. Execute faster.",
    sublineSuffix: "better focus, faster execution",
    light: "Light",
    dark: "Dark",
    export: "Export",
    import: "Import",
    logout: "Log out",
    logoutToast: "Logged out successfully",
    total: "Total",
    completed: "Completed",
    pending: "Pending",
    overdue: "Overdue",
    urgentNextStep: "Urgent next step",
    suggestedNextTask: "Suggested next task",
    priorityLabel: "Priority",
    dueLabel: "Due",
    addNewTask: "Add New Task",
    taskPlaceholder: "Write a clear action item",
    taskName: "Task name",
    dueDate: "Due date",
    priority: "Priority",
    addTask: "Add Task",
    suggestPriority: "Suggest priority",
    splitTask: "Split task",
    aiSuggestions: "AI Suggestions",
    applyPriority: "Apply",
    addSubtasks: "Add subtasks",
    noSplitSuggestions: "Write a more specific task to split it into steps.",
    complete: "complete",
    searchPlaceholder: "Search tasks by name",
    allPriorities: "All priorities",
    priorityFilter: { high: "High priority", medium: "Medium priority", low: "Low priority" },
    filtersLive: "Filters and sorting are now live",
    shortcuts: "Shortcuts:",
    newTaskShortcut: "new task",
    searchShortcut: "search",
    batchActions: "Batch Actions",
    completeAllPending: "Complete All Pending",
    clearCompleted: "Clear Completed",
    undoDelete: "Undo Delete",
    done: "Done",
    toggleStatus: "Toggle status",
    toggleComplete: "Toggle complete",
    edit: "Edit",
    delete: "Delete",
    doubleClickRename: "Double-click to rename",
    tableTask: "Task",
    tableStatus: "Status",
    tablePriority: "Priority",
    tableDue: "Due",
    tableActions: "Actions",
    undo: "Undo",
    closeToast: "Close toast",
    tip: "Tip: drag and drop works only in Manual sort with no active search/filter.",
    emptyLoadingTitle: "Loading tasks...",
    emptyLoadingSub: "Connecting to backend API.",
    emptySearchTitle: "No matches found",
    emptySearchSub: "Try a shorter keyword or clear search and filters.",
    emptyCompletedTitle: "No completed tasks",
    emptyCompletedSub: "Complete a task and it will appear here.",
    emptyPendingTitle: "No pending tasks",
    emptyPendingSub: "Everything is done. Nice work.",
    emptyDefaultTitle: "No tasks yet",
    emptyDefaultSub: "Add your first task to start tracking progress.",
    noDeadline: "No deadline",
    overdueDate: (days) => `${days}d overdue`,
    today: "Today",
    tomorrow: "Tomorrow",
    filters: { all: "All", completed: "Completed", pending: "Pending" },
    sortOptions: { custom: "Manual", urgency: "Urgency", due: "Due Date", created: "Newest", alpha: "A-Z" },
    priorities: { high: "High", medium: "Medium", low: "Low" },
  },
  ar: {
    languageName: "English",
    appTitleStart: "مدير",
    appTitleAccent: "المهام",
    tagline: "خطط أفضل. أنجز أسرع.",
    sublineSuffix: "تركيز أفضل وإنجاز أسرع",
    light: "فاتح",
    dark: "داكن",
    export: "تصدير",
    import: "استيراد",
    logout: "تسجيل الخروج",
    logoutToast: "تم تسجيل الخروج بنجاح",
    total: "الإجمالي",
    completed: "المكتملة",
    pending: "المعلقة",
    overdue: "المتأخرة",
    urgentNextStep: "الخطوة العاجلة التالية",
    suggestedNextTask: "المهمة المقترحة التالية",
    priorityLabel: "الأولوية",
    dueLabel: "الموعد",
    addNewTask: "إضافة مهمة جديدة",
    taskPlaceholder: "اكتب مهمة واضحة",
    taskName: "اسم المهمة",
    dueDate: "تاريخ الاستحقاق",
    priority: "الأولوية",
    addTask: "إضافة مهمة",
    suggestPriority: "اقتراح الأولوية",
    splitTask: "تقسيم المهمة",
    aiSuggestions: "اقتراحات الذكاء الاصطناعي",
    applyPriority: "تطبيق",
    addSubtasks: "إضافة الخطوات",
    noSplitSuggestions: "اكتب مهمة أوضح حتى يتم تقسيمها إلى خطوات.",
    complete: "مكتمل",
    searchPlaceholder: "ابحث عن المهام بالاسم",
    allPriorities: "كل الأولويات",
    priorityFilter: { high: "أولوية عالية", medium: "أولوية متوسطة", low: "أولوية منخفضة" },
    filtersLive: "الفلاتر والترتيب مفعلة الآن",
    shortcuts: "الاختصارات:",
    newTaskShortcut: "مهمة جديدة",
    searchShortcut: "بحث",
    batchActions: "إجراءات جماعية",
    completeAllPending: "إكمال كل المهام المعلقة",
    clearCompleted: "حذف المكتملة",
    undoDelete: "تراجع عن الحذف",
    done: "مكتملة",
    toggleStatus: "تغيير الحالة",
    toggleComplete: "تبديل الإكمال",
    edit: "تعديل",
    delete: "حذف",
    doubleClickRename: "انقر مرتين لإعادة التسمية",
    tableTask: "المهمة",
    tableStatus: "الحالة",
    tablePriority: "الأولوية",
    tableDue: "الموعد",
    tableActions: "الإجراءات",
    undo: "تراجع",
    closeToast: "إغلاق التنبيه",
    tip: "ملاحظة: السحب والإفلات يعمل فقط في الترتيب اليدوي بدون بحث أو فلتر نشط.",
    emptyLoadingTitle: "جاري تحميل المهام...",
    emptyLoadingSub: "جاري الاتصال بواجهة الخادم.",
    emptySearchTitle: "لا توجد نتائج",
    emptySearchSub: "جرب كلمة أقصر أو امسح البحث والفلاتر.",
    emptyCompletedTitle: "لا توجد مهام مكتملة",
    emptyCompletedSub: "أكمل مهمة وستظهر هنا.",
    emptyPendingTitle: "لا توجد مهام معلقة",
    emptyPendingSub: "كل شيء منجز. عمل رائع.",
    emptyDefaultTitle: "لا توجد مهام بعد",
    emptyDefaultSub: "أضف أول مهمة لبدء تتبع التقدم.",
    noDeadline: "لا يوجد موعد",
    overdueDate: (days) => `متأخرة ${days} يوم`,
    today: "اليوم",
    tomorrow: "غدا",
    filters: { all: "الكل", completed: "مكتملة", pending: "معلقة" },
    sortOptions: { custom: "يدوي", urgency: "الأهمية", due: "تاريخ الاستحقاق", created: "الأحدث", alpha: "أ-ي" },
    priorities: { high: "عالية", medium: "متوسطة", low: "منخفضة" },
  },
};
const SORT_OPTIONS = [
  { value: "custom", label: "Manual" },
  { value: "urgency", label: "Urgency" },
  { value: "due", label: "Due Date" },
  { value: "created", label: "Newest" },
  { value: "alpha", label: "A-Z" },
];

const PRIORITIES = {
  high: { label: "High", color: "#b65a52", bg: "rgba(182,90,82,0.14)" },
  medium: { label: "Medium", color: "#c79a58", bg: "rgba(199,154,88,0.16)" },
  low: { label: "Low", color: "#2f3b48", bg: "rgba(47,59,72,0.10)" },
};

function genId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now();
}

function daysUntilDue(dateStr) {
  if (!dateStr) return null;
  const endOfDay = new Date(`${dateStr}T23:59:59`);
  const diff = endOfDay.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDueDate(dateStr, language, text) {
  if (!dateStr) return text.noDeadline;
  const days = daysUntilDue(dateStr);
  if (days === null) return text.noDeadline;
  if (days < 0) return text.overdueDate(Math.abs(days));
  if (days === 0) return text.today;
  if (days === 1) return text.tomorrow;
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getUrgencyScore(task) {
  if (task.status === "completed") return -1;
  const base = { high: 100, medium: 55, low: 20 }[task.priority] ?? 20;
  const due = daysUntilDue(task.dueDate);

  if (due === null) return base;
  if (due < 0) return base + 200;
  if (due === 0) return base + 110;
  if (due <= 2) return base + 70;
  if (due <= 7) return base + 30;
  return base;
}

function inferPriority(name, dueDate) {
  const value = name.toLowerCase();
  const highWords = ["urgent", "deadline", "submit", "exam", "final", "interview", "payment", "pay", "مستعجل", "عاجل", "امتحان", "نهائي", "تسليم"];
  const mediumWords = ["project", "report", "presentation", "meeting", "review", "study", "homework", "مشروع", "تقرير", "عرض", "اجتماع", "دراسة", "واجب"];
  const lowWords = ["idea", "optional", "someday", "watch", "read", "clean", "فكرة", "اختياري", "لاحقا", "قراءة", "تنظيف"];
  const due = daysUntilDue(dueDate);

  if (due !== null && due <= 2) return "high";
  if (highWords.some((word) => value.includes(word))) return "high";
  if (due !== null && due <= 7) return "medium";
  if (mediumWords.some((word) => value.includes(word))) return "medium";
  if (lowWords.some((word) => value.includes(word))) return "low";
  return value.length > 50 ? "medium" : "low";
}

function splitLargeTask(name) {
  const task = name.trim();
  if (task.length < 4) return [];
  const lower = task.toLowerCase();
  const clean = task.replace(/\s+/g, " ");

  if (lower.includes("exam") || lower.includes("study") || lower.includes("امتحان") || lower.includes("دراسة")) {
    return [
      `Review the main topics for ${clean}`,
      `Create a short summary for ${clean}`,
      `Solve practice questions for ${clean}`,
      `Review mistakes and weak areas for ${clean}`,
    ];
  }

  if (lower.includes("report") || lower.includes("presentation") || lower.includes("تقرير") || lower.includes("عرض")) {
    return [
      `Collect the required information for ${clean}`,
      `Create an outline for ${clean}`,
      `Write the first draft for ${clean}`,
      `Review and polish ${clean}`,
      `Prepare the final version of ${clean}`,
    ];
  }

  if (lower.includes("website") || lower.includes("app") || lower.includes("project") || lower.includes("موقع") || lower.includes("تطبيق") || lower.includes("مشروع")) {
    return [
      `Define the requirements for ${clean}`,
      `Break ${clean} into main screens or modules`,
      `Build the first working version of ${clean}`,
      `Test the main workflow for ${clean}`,
      `Fix issues and prepare ${clean} for submission`,
    ];
  }

  return [
    `Clarify the goal for ${clean}`,
    `List the resources needed for ${clean}`,
    `Complete the first small step for ${clean}`,
    `Review progress on ${clean}`,
  ];
}

function normalizeTask(task, index) {
  const safePriority = PRIORITIES[task?.priority] ? task.priority : "medium";
  const safeStatus = task?.status === "completed" ? "completed" : "pending";

  return {
    id: typeof task?.id === "string" ? task.id : genId(),
    name: String(task?.name ?? "Untitled task").trim() || "Untitled task",
    priority: safePriority,
    status: safeStatus,
    dueDate: task?.dueDate || null,
    createdAt: task?.createdAt || new Date().toISOString(),
    order: Number.isFinite(task?.order) ? task.order : index,
  };
}

async function apiRequest(path, options = {}) {
  const init = { ...options, headers: { ...(options.headers ?? {}) } };
  if (init.body !== undefined && !init.headers["Content-Type"]) {
    init.headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new Error("Cannot reach backend server");
  }

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? payload.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return "light";
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch { }
}

function loadLanguage() {
  try {
    const saved = localStorage.getItem(AUTH_LANG_KEY);
    return saved === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
:root {
  --bg: #eff3f7;
  --bg-grad-1: #eef2f8;
  --bg-grad-2: #dfe7f1;
  --bg-grad-3: #ced9e8;
  --bg-grad-4: #e8dcc8;
  --bg-glow-a: rgba(199,154,88,0.56);
  --bg-glow-b: rgba(47,59,72,0.36);
  --bg-glow-c: rgba(172,128,69,0.42);
  --bg-glow-d: rgba(255,255,255,0.34);
  --card-bg: rgba(255,255,255,0.72);
  --card-border-soft: rgba(209,219,230,0.86);
  --surface: #ffffff;
  --surface-soft: #f7f9fc;
  --surface-muted: #e8edf4;
  --border: #d1dbe6;
  --border-strong: #b9c7d7;
  --text: #2f3b48;
  --muted: #607184;
  --accent: #c79a58;
  --accent-strong: #ac8045;
  --accent-soft: rgba(199,154,88,0.16);
  --warning: #b9843d;
  --danger: #b65a52;
  --success: #3c8f6b;
  --mono: 'JetBrains Mono', monospace;
  --heading: 'Sora', sans-serif;
  --sans: 'IBM Plex Sans', sans-serif;
  --shadow: 0 14px 35px rgba(47,59,72,0.10);
}
.dtm.theme-dark {
  --bg: #101720;
  --bg-grad-1: #0f1620;
  --bg-grad-2: #1a2533;
  --bg-grad-3: #223245;
  --bg-grad-4: #3b3125;
  --bg-glow-a: rgba(210,171,107,0.52);
  --bg-glow-b: rgba(94,123,154,0.46);
  --bg-glow-c: rgba(188,147,87,0.40);
  --bg-glow-d: rgba(235,242,250,0.16);
  --card-bg: rgba(24,33,45,0.70);
  --card-border-soft: rgba(58,80,104,0.72);
  --surface: #18212d;
  --surface-soft: #131c27;
  --surface-muted: #223143;
  --border: #2b3b4f;
  --border-strong: #3a5068;
  --text: #e8eef6;
  --muted: #9caec1;
  --accent: #d2ab6b;
  --accent-strong: #bc9357;
  --accent-soft: rgba(210,171,107,0.20);
  --warning: #edb166;
  --danger: #ef8c7d;
  --success: #63c399;
  --shadow: 0 20px 45px rgba(0,0,0,0.35);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.dtm{
  min-height:100vh;
  position:relative;
  isolation:isolate;
  overflow:hidden;
  background:
    linear-gradient(120deg,var(--bg-grad-1) 0%,var(--bg-grad-2) 34%,var(--bg-grad-3) 68%,var(--bg-grad-4) 100%),
    radial-gradient(circle at 10% 8%, var(--bg-glow-a), transparent 42%),
    radial-gradient(circle at 92% 10%, var(--bg-glow-b), transparent 40%),
    radial-gradient(circle at 88% 90%, var(--bg-glow-c), transparent 44%),
    radial-gradient(circle at 52% -8%, var(--bg-glow-d), transparent 38%),
    var(--bg);
  background-size: 240% 240%, auto, auto, auto, auto, auto;
  animation:bgShift 10s ease-in-out infinite;
  color:var(--text);
  font-family:var(--sans);
  line-height:1.5;
  padding:32px 18px 70px;
}
.dtm::before,.dtm::after{content:"";position:absolute;z-index:0;pointer-events:none;filter:blur(44px);opacity:.84}
.dtm::before{width:56vw;height:56vw;max-width:820px;max-height:820px;left:-18vw;top:-20vw;background:radial-gradient(circle,var(--bg-glow-a),transparent 62%);animation:bgDriftOne 14s ease-in-out infinite}
.dtm::after{width:50vw;height:50vw;max-width:740px;max-height:740px;right:-16vw;bottom:-18vw;background:radial-gradient(circle,var(--bg-glow-c),transparent 64%);animation:bgDriftTwo 16s ease-in-out infinite}
.dtm-wrap{max-width:1120px;margin:0 auto;position:relative;z-index:1}
.dtm-header{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:18px}
.title-block{display:flex;align-items:center;gap:12px}
.brand-emblem{position:relative;width:88px;height:88px;border-radius:18px;overflow:hidden;border:1px solid color-mix(in srgb,var(--accent) 30%,var(--border));background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 10%,var(--surface)),var(--surface-soft));box-shadow:0 8px 18px rgba(0,0,0,.09);padding:0;flex-shrink:0}
.brand-emblem::after{content:"";position:absolute;inset:0;border-radius:18px;pointer-events:none;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 26%,transparent)}
.brand-logo{width:100%;height:100%;display:block;object-fit:cover;object-position:center 14%;transform:scale(1.26)}
.brand-copy{display:flex;flex-direction:column;gap:2px}
.brand-title{font-family:var(--heading);font-size:clamp(1.5rem,2.5vw,2rem);line-height:1.05;letter-spacing:-.02em;color:var(--text)}
.brand-title span{color:var(--accent)}
.brand-tagline{font-size:.88rem;color:var(--muted);font-weight:500}
.subline{font-family:var(--mono);font-size:.72rem;text-transform:uppercase;letter-spacing:.09em;color:var(--muted)}
.header-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.card{background:var(--card-bg);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--card-border-soft);border-radius:18px;box-shadow:var(--shadow);margin-bottom:14px;padding:16px}
.insight-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.insight-item{border:1px solid var(--border);border-radius:14px;background:var(--surface-soft);padding:14px 12px}
.insight-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;color:var(--muted)}
.insight-val{font-family:var(--heading);font-size:1.7rem;line-height:1;margin-bottom:4px}
.insight-label{color:var(--muted);font-size:.76rem;text-transform:uppercase;letter-spacing:.08em;font-family:var(--mono)}
.next-card{display:flex;align-items:center;gap:14px;border:1px solid color-mix(in srgb,var(--accent) 50%,var(--border));border-radius:14px;padding:14px;background:linear-gradient(120deg,var(--accent-soft),transparent 64%);animation:rise .28s ease}
.next-icon{width:42px;height:42px;border-radius:11px;background:color-mix(in srgb,var(--accent) 20%,transparent);display:flex;align-items:center;justify-content:center;color:var(--accent-strong);flex-shrink:0}
.next-eyebrow{font-family:var(--mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:3px}
.next-title{font-size:1.02rem;font-weight:600;margin-bottom:3px}
.next-meta{color:var(--muted);font-size:.84rem}
.s-label{font-family:var(--mono);font-size:.66rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:10px}
.form-grid{display:grid;grid-template-columns:1.4fr .9fr .85fr auto;gap:10px}
.input,.select{width:100%;border:1px solid var(--border);border-radius:11px;padding:10px 12px;background:var(--surface-soft);color:var(--text);font-family:var(--sans);font-size:.93rem;outline:none;transition:border-color .14s ease,box-shadow .14s ease}
.input::placeholder{color:color-mix(in srgb,var(--muted) 85%,transparent)}
.input:focus,.select:focus,.btn:focus-visible{border-color:var(--accent-strong);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 20%,transparent)}
.btn{border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:10px;padding:9px 12px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:.88rem;font-weight:600;cursor:pointer;transition:transform .12s ease,border-color .12s ease,background .12s ease,color .12s ease}
.btn:hover{transform:translateY(-1px);border-color:var(--border-strong)}
.btn:active{transform:translateY(0)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:#1f2b38}
.btn.primary:hover{background:var(--accent-strong);border-color:var(--accent-strong)}
.btn.ghost{background:transparent}
.btn.warn{color:var(--warning);border-color:color-mix(in srgb,var(--warning) 36%,var(--border))}
.btn.danger{color:var(--danger);border-color:color-mix(in srgb,var(--danger) 38%,var(--border))}
.btn.icon{width:38px;height:38px;padding:0}
.ai-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.ai-panel{margin-top:12px;border:1px solid color-mix(in srgb,var(--accent) 38%,var(--border));border-radius:12px;background:linear-gradient(120deg,var(--accent-soft),transparent 72%);padding:12px;animation:rise .22s ease}
.ai-panel-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}
.ai-panel-title{display:inline-flex;align-items:center;gap:7px;font-family:var(--mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--accent-strong)}
.ai-list{display:grid;gap:7px;margin:0;padding:0;list-style:none}
.ai-list li{display:flex;align-items:flex-start;gap:8px;color:var(--text);font-size:.88rem}
.ai-empty{color:var(--muted);font-size:.86rem}
.controls{display:grid;gap:10px}
.filter-row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.filter-buttons{display:flex;gap:6px;flex-wrap:wrap}
.filter-btn{border:1px solid var(--border);border-radius:999px;padding:6px 11px;cursor:pointer;background:var(--surface-soft);color:var(--muted);font-family:var(--mono);font-size:.66rem;text-transform:uppercase;letter-spacing:.08em;transition:border-color .12s ease,color .12s ease,background .12s ease}
.filter-btn.active{background:var(--accent-soft);border-color:color-mix(in srgb,var(--accent) 55%,var(--border));color:var(--accent-strong)}
.pct{font-family:var(--mono);font-size:.8rem;color:var(--muted)}
.progress{height:7px;border-radius:999px;background:var(--surface-muted);overflow:hidden}
.progress>div{height:100%;background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 62%,#2f3b48));transition:width .28s ease}
.search-row{display:grid;grid-template-columns:1fr 150px 150px;gap:8px}
.search-wrap{position:relative}
.search-wrap .input{padding-left:35px}
.search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted)}
.meta-row{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.kbd-hints{color:var(--muted);font-size:.76rem}
.kbd-hints code{font-family:var(--mono);background:var(--surface-muted);border:1px solid var(--border);border-radius:6px;padding:1px 5px;font-size:.68rem}
.bulk-actions{display:flex;gap:8px;flex-wrap:wrap}
.tbl-wrap{overflow-x:auto}
.tbl{width:100%;border-collapse:collapse;min-width:760px}
.tbl th{text-align:left;padding:10px 12px;color:var(--muted);font-family:var(--mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border)}
.tbl td{padding:10px 12px;border-bottom:1px solid var(--border);color:var(--muted);vertical-align:middle}
.tbl tbody tr{transition:background .12s ease}
.tbl tbody tr:hover{background:color-mix(in srgb,var(--accent) 7%,transparent)}
.tbl tbody tr.is-dragging{opacity:.42}
.tbl tbody tr.is-drag-over{background:color-mix(in srgb,var(--accent) 14%,transparent)}
.task-name{color:var(--text);font-weight:500}
.task-name.done{text-decoration:line-through;color:var(--muted)}
.badge{display:inline-block;padding:4px 9px;border-radius:999px;font-family:var(--mono);font-size:.63rem;text-transform:uppercase;letter-spacing:.05em;border:1px solid transparent}
.status-btn{border:1px solid var(--border);border-radius:999px;padding:5px 10px;background:transparent;display:inline-flex;gap:6px;align-items:center;font-size:.78rem;cursor:pointer;color:var(--muted)}
.status-btn.completed{color:var(--success);border-color:color-mix(in srgb,var(--success) 45%,var(--border));background:color-mix(in srgb,var(--success) 14%,transparent)}
.status-btn.pending{color:var(--warning);border-color:color-mix(in srgb,var(--warning) 42%,var(--border));background:color-mix(in srgb,var(--warning) 14%,transparent)}
.row-actions{display:flex;gap:6px}
.grip{cursor:grab;color:var(--muted)}
.grip.disabled{opacity:.35;cursor:not-allowed}
.id-cell{font-family:var(--mono);font-size:.68rem;color:var(--muted)}
.inline-input{width:100%;border:1px solid var(--accent-strong);border-radius:8px;padding:5px 8px;background:var(--surface-soft);color:var(--text);font-size:.9rem;outline:none}
.date{font-size:.78rem;font-family:var(--mono)}
.date.overdue{color:var(--danger)}
.date.soon{color:var(--warning)}
.date.normal{color:var(--muted)}
.empty{text-align:center;padding:40px 16px}
.empty h3{font-family:var(--heading);margin-bottom:6px;font-size:1.2rem}
.empty p{color:var(--muted);font-size:.9rem}
.toast{position:fixed;right:16px;bottom:16px;z-index:120;display:flex;gap:8px;align-items:center;background:var(--surface);border:1px solid var(--border-strong);border-radius:12px;padding:10px 12px;box-shadow:var(--shadow);max-width:340px;animation:rise .24s ease}
.toast p{font-size:.86rem}
.tip{margin-top:12px;text-align:center;color:var(--muted);font-size:.74rem;font-family:var(--mono);letter-spacing:.04em}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes bgShift{0%{background-position:0% 50%,0 0,0 0,0 0,0 0,0 0}50%{background-position:100% 50%,0 0,0 0,0 0,0 0,0 0}100%{background-position:0% 50%,0 0,0 0,0 0,0 0,0 0}}
@keyframes bgDriftOne{0%{transform:translate(0,0) scale(1)}50%{transform:translate(7vw,4vw) scale(1.18)}100%{transform:translate(0,0) scale(1)}}
@keyframes bgDriftTwo{0%{transform:translate(0,0) scale(1)}50%{transform:translate(-6vw,-3vw) scale(1.16)}100%{transform:translate(0,0) scale(1)}}
@media (prefers-reduced-motion: reduce){.dtm{animation:none}.dtm::before,.dtm::after{animation:none}}
@media (max-width:900px){.insight-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.search-row{grid-template-columns:1fr}.form-grid{grid-template-columns:1fr}.header-actions{justify-content:flex-start}.dtm-header{flex-direction:column;align-items:flex-start}}
@media (max-width:560px){.dtm{padding:22px 10px 70px}.card{padding:12px;border-radius:14px}.bulk-actions{width:100%}.bulk-actions .btn{flex:1}.brand-emblem{width:72px;height:72px;border-radius:14px}.brand-title{font-size:1.36rem}.brand-tagline{font-size:.8rem}.subline{font-size:.64rem}}
`;

function InsightPanel({ tasks, text }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const overdue = tasks.filter((t) => t.status === "pending" && daysUntilDue(t.dueDate) < 0).length;

  const stats = [
    { key: "total", value: total, label: text.total, icon: <BarChart2 size={15} />, color: "var(--accent)" },
    { key: "done", value: completed, label: text.completed, icon: <CheckCircle size={15} />, color: "var(--success)" },
    { key: "pending", value: pending, label: text.pending, icon: <Clock size={15} />, color: "var(--warning)" },
    {
      key: "overdue",
      value: overdue,
      label: text.overdue,
      icon: <AlertTriangle size={15} />,
      color: overdue > 0 ? "var(--danger)" : "var(--muted)",
    },
  ];

  return (
    <div className="card">
      <div className="insight-grid">
        {stats.map((s) => (
          <div key={s.key} className="insight-item">
            <div className="insight-head" style={{ color: s.color }}>
              <span>{s.icon}</span>
            </div>
            <div className="insight-val" style={{ color: s.color }}>{s.value}</div>
            <div className="insight-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NextTaskCard({ tasks, language, text }) {
  const next = useMemo(() => {
    const pending = tasks.filter((task) => task.status === "pending");
    if (!pending.length) return null;
    return [...pending].sort((a, b) => getUrgencyScore(b) - getUrgencyScore(a))[0];
  }, [tasks]);

  if (!next) return null;

  const priority = PRIORITIES[next.priority];
  const priorityLabel = text.priorities[next.priority];
  const urgent = getUrgencyScore(next) >= 150;

  return (
    <div className="card">
      <div className="next-card">
        <div className="next-icon">{urgent ? <AlertTriangle size={18} /> : <Lightbulb size={18} />}</div>
        <div style={{ flex: 1 }}>
          <div className="next-eyebrow">{urgent ? text.urgentNextStep : text.suggestedNextTask}</div>
          <div className="next-title">{next.name}</div>
          <div className="next-meta">{text.priorityLabel}: {priorityLabel} | {text.dueLabel}: {formatDueDate(next.dueDate, language, text)}</div>
        </div>
        <span className="badge" style={{ color: priority.color, background: priority.bg, borderColor: `${priority.color}4d` }}>
          {priorityLabel}
        </span>
      </div>
    </div>
  );
}

function TaskForm({ onAdd, inputRef, text }) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [suggestedPriority, setSuggestedPriority] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [splitAttempted, setSplitAttempted] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    await onAdd({ name: name.trim(), priority, dueDate: dueDate || null });
    setName("");
    setPriority("medium");
    setDueDate("");
    setSuggestedPriority(null);
    setSubtasks([]);
    setSplitAttempted(false);
    inputRef.current?.focus();
  };

  const suggestPriority = () => {
    if (!name.trim()) return;
    const next = inferPriority(name, dueDate);
    setSuggestedPriority(next);
    setPriority(next);
  };

  const splitTask = () => {
    setSubtasks(splitLargeTask(name));
    setSplitAttempted(true);
  };

  const addSubtasks = async () => {
    if (!subtasks.length) return;
    const nextPriority = suggestedPriority || inferPriority(name, dueDate);
    for (const subtask of subtasks) {
      await onAdd({ name: subtask, priority: nextPriority, dueDate: dueDate || null });
    }
    setName("");
    setPriority("medium");
    setDueDate("");
    setSuggestedPriority(null);
    setSubtasks([]);
    setSplitAttempted(false);
    inputRef.current?.focus();
  };

  return (
    <div className="card">
      <div className="s-label">{text.addNewTask}</div>
      <div className="form-grid">
        <input
          ref={inputRef}
          className="input"
          placeholder={text.taskPlaceholder}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSuggestedPriority(null);
            setSubtasks([]);
            setSplitAttempted(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          aria-label={text.taskName}
        />
        <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label={text.dueDate} />
        <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)} aria-label={text.priority}>
          <option value="high">{text.priorities.high}</option>
          <option value="medium">{text.priorities.medium}</option>
          <option value="low">{text.priorities.low}</option>
        </select>
        <button className="btn primary" onClick={submit}>
          <Plus size={15} /> {text.addTask}
        </button>
      </div>
      <div className="ai-actions">
        <button className="btn" type="button" onClick={suggestPriority} disabled={!name.trim()}>
          <Lightbulb size={14} /> {text.suggestPriority}
        </button>
        <button className="btn" type="button" onClick={splitTask} disabled={!name.trim()}>
          <Sparkles size={14} /> {text.splitTask}
        </button>
      </div>
      {(suggestedPriority || splitAttempted) && (
        <div className="ai-panel">
          <div className="ai-panel-head">
            <div className="ai-panel-title"><Sparkles size={14} /> {text.aiSuggestions}</div>
            {suggestedPriority && (
              <button className="btn ghost" type="button" onClick={() => setPriority(suggestedPriority)}>
                {text.applyPriority}: {text.priorities[suggestedPriority]}
              </button>
            )}
          </div>
          {subtasks.length > 0 ? (
            <>
              <ul className="ai-list">
                {subtasks.map((subtask) => (
                  <li key={subtask}><CheckCircle size={14} /> <span>{subtask}</span></li>
                ))}
              </ul>
              <div className="ai-actions">
                <button className="btn primary" type="button" onClick={addSubtasks}>
                  <Plus size={14} /> {text.addSubtasks}
                </button>
              </div>
            </>
          ) : splitAttempted ? (
            <p className="ai-empty">{text.noSplitSuggestions}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Controls({ filter, setFilter, tasks, search, setSearch, sortBy, setSortBy, priorityFilter, setPriorityFilter, searchInputRef, text }) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const counts = { all: total, completed, pending: total - completed };

  return (
    <div className="card controls">
      <div className="filter-row">
        <div className="filter-buttons">
          {FILTERS.map((f) => (
            <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {text.filters[f]} ({counts[f]})
            </button>
          ))}
        </div>
        <span className="pct">{pct}% {text.complete}</span>
      </div>
      <div className="progress"><div style={{ width: `${pct}%` }} /></div>
      <div className="search-row">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input ref={searchInputRef} className="input" placeholder={text.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{text.sortOptions[option.value]}</option>
          ))}
        </select>
        <select className="select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">{text.allPriorities}</option>
          <option value="high">{text.priorityFilter.high}</option>
          <option value="medium">{text.priorityFilter.medium}</option>
          <option value="low">{text.priorityFilter.low}</option>
        </select>
      </div>
      <div className="meta-row">
        <div className="kbd-hints">{text.shortcuts} <code>N</code> {text.newTaskShortcut}, <code>/</code> {text.searchShortcut}</div>
        <div className="kbd-hints" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal size={14} /> {text.filtersLive}
        </div>
      </div>
    </div>
  );
}
function BulkActions({ pendingCount, completedCount, onCompleteAll, onClearCompleted, onUndo, canUndo, text }) {
  return (
    <div className="card">
      <div className="s-label">{text.batchActions}</div>
      <div className="bulk-actions">
        <button className="btn" disabled={pendingCount === 0} onClick={onCompleteAll}>
          <ListChecks size={14} /> {text.completeAllPending} ({pendingCount})
        </button>
        <button className="btn warn" disabled={completedCount === 0} onClick={onClearCompleted}>
          <Trash2 size={14} /> {text.clearCompleted} ({completedCount})
        </button>
        <button className="btn ghost" disabled={!canUndo} onClick={onUndo}>
          <RotateCcw size={14} /> {text.undoDelete}
        </button>
      </div>
    </div>
  );
}

function TaskRow({ task, index, onDelete, onToggle, onEdit, onDragStart, onDragOver, onDrop, onDragEnd, draggingId, dragOverId, canReorder, language, text }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed) onEdit(task.id, trimmed);
    setEditing(false);
  };

  const priority = PRIORITIES[task.priority];
  const priorityLabel = text.priorities[task.priority];
  const due = daysUntilDue(task.dueDate);
  const dateClass = due === null ? "normal" : due < 0 ? "overdue" : due <= 2 ? "soon" : "normal";

  return (
    <tr
      draggable={canReorder}
      className={`${draggingId === task.id ? "is-dragging" : ""} ${dragOverId === task.id ? "is-drag-over" : ""}`.trim()}
      onDragStart={() => {
        if (canReorder) onDragStart(task.id);
      }}
      onDragOver={(e) => {
        if (!canReorder) return;
        e.preventDefault();
        onDragOver(task.id);
      }}
      onDrop={() => {
        if (canReorder) onDrop(task.id);
      }}
      onDragEnd={onDragEnd}
    >
      <td style={{ width: 70 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GripVertical size={14} className={`grip ${canReorder ? "" : "disabled"}`} />
          <span className="id-cell">#{String(index + 1).padStart(2, "0")}</span>
        </div>
      </td>

      <td>
        {editing ? (
          <input
            ref={inputRef}
            className="inline-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") {
                setEditValue(task.name);
                setEditing(false);
              }
            }}
          />
        ) : (
          <span
            className={`task-name ${task.status === "completed" ? "done" : ""}`}
            onDoubleClick={() => {
              setEditValue(task.name);
              setEditing(true);
            }}
            title={text.doubleClickRename}
          >
            {task.name}
          </span>
        )}
      </td>

      <td>
        <button className={`status-btn ${task.status}`} onClick={() => onToggle(task.id)} title={text.toggleStatus}>
          {task.status === "completed" ? <><CheckCircle size={13} /> {text.done}</> : <><Circle size={13} /> {text.pending}</>}
        </button>
      </td>

      <td>
        <span className="badge" style={{ color: priority.color, background: priority.bg, borderColor: `${priority.color}52` }}>
          {priorityLabel}
        </span>
      </td>

      <td><span className={`date ${dateClass}`}>{formatDueDate(task.dueDate, language, text)}</span></td>

      <td>
        <div className="row-actions">
          <button className="btn icon" onClick={() => onToggle(task.id)} title={text.toggleComplete}><Check size={14} /></button>
          <button className="btn icon" onClick={() => { setEditValue(task.name); setEditing(true); }} title={text.edit}><Edit3 size={14} /></button>
          <button className="btn icon danger" onClick={() => onDelete(task.id)} title={text.delete}><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

function TaskTable({ tasks, onDelete, onToggle, onEdit, onReorder, canReorder, emptyTitle, emptySub, language, text }) {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const handleDrop = (targetId) => {
    if (draggingId && draggingId !== targetId) onReorder(draggingId, targetId);
    setDraggingId(null);
    setDragOverId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="card empty">
        <h3>{emptyTitle}</h3>
        <p>{emptySub}</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "8px 0" }}>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 14 }}>#</th>
              <th>{text.tableTask}</th>
              <th>{text.tableStatus}</th>
              <th>{text.tablePriority}</th>
              <th>{text.tableDue}</th>
              <th>{text.tableActions}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                index={index}
                onDelete={onDelete}
                onToggle={onToggle}
                onEdit={onEdit}
                onDragStart={setDraggingId}
                onDragOver={setDragOverId}
                onDrop={handleDrop}
                onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
                draggingId={draggingId}
                dragOverId={dragOverId}
                canReorder={canReorder}
                language={language}
                text={text}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Toast({ message, onClose, onUndo, showUndo, text }) {
  if (!message) return null;
  return (
    <div className="toast">
      <p style={{ flex: 1 }}>{message}</p>
      {showUndo && <button className="btn ghost" onClick={onUndo}>{text.undo}</button>}
      <button className="btn icon" onClick={onClose} aria-label={text.closeToast}><X size={14} /></button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authView, setAuthView] = useState("login");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(() => loadTheme());
  const [language, setLanguage] = useState(() => loadLanguage());
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("custom");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [toast, setToast] = useState("");
  const [lastDeleted, setLastDeleted] = useState(null);

  const addInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const importRef = useRef(null);

  const fetchTasks = useCallback(async (silent = false) => {
    if (!user) return null;
    setIsLoading(true);
    try {
      const list = await apiRequest("/api/tasks");
      const normalized = Array.isArray(list)
        ? list.map((task, index) => normalizeTask(task, index))
        : [];
      setTasks(normalized);
      return normalized;
    } catch (error) {
      if (!silent) {
        setToast(`Sync failed: ${error.message}`);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      void fetchTasks();
    }
  }, [fetchTasks, user]);

  useEffect(() => { saveTheme(theme); }, [theme]);

  const text = UI_COPY[language];
  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === "en" ? "ar" : "en";
      try {
        localStorage.setItem(AUTH_LANG_KEY, next);
      } catch { }
      return next;
    });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const tag = target?.tagName;
      const isTypingTarget = tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;
      if (event.key === "/" && !isTypingTarget) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key.toLowerCase() === "n" && !isTypingTarget) {
        event.preventDefault();
        addInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const orderedTasks = useMemo(() => [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [tasks]);
  const query = search.trim().toLowerCase();

  const visibleTasks = useMemo(() => {
    let list = [...orderedTasks];
    if (filter !== "all") list = list.filter((task) => task.status === filter);
    if (priorityFilter !== "all") list = list.filter((task) => task.priority === priorityFilter);
    if (query) list = list.filter((task) => task.name.toLowerCase().includes(query));

    if (sortBy === "urgency") {
      list.sort((a, b) => getUrgencyScore(b) - getUrgencyScore(a));
    } else if (sortBy === "due") {
      list.sort((a, b) => {
        const ad = daysUntilDue(a.dueDate);
        const bd = daysUntilDue(b.dueDate);
        if (ad === null && bd === null) return 0;
        if (ad === null) return 1;
        if (bd === null) return -1;
        return ad - bd;
      });
    } else if (sortBy === "created") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "alpha") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [orderedTasks, filter, priorityFilter, query, sortBy]);

  const canReorder = sortBy === "custom" && filter === "all" && priorityFilter === "all" && query.length === 0;
  const persistOrder = useCallback(async (orderedList) => {
    await Promise.all(
      orderedList.map((task, index) =>
        apiRequest(`/api/tasks/${task.id}`, {
          method: "PUT",
          body: JSON.stringify({ order: index }),
        })
      )
    );
  }, []);

  const addTask = useCallback(async ({ name, priority, dueDate }) => {
    try {
      await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ name, priority, dueDate, status: "pending" }),
      });
      await fetchTasks(true);
      setToast("Task created");
    } catch (error) {
      setToast(`Create failed: ${error.message}`);
    }
  }, [fetchTasks]);

  const editTask = useCallback(async (id, name) => {
    try {
      await apiRequest(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      await fetchTasks(true);
      setToast("Task updated");
    } catch (error) {
      setToast(`Update failed: ${error.message}`);
    }
  }, [fetchTasks]);

  const toggleTask = useCallback(async (id) => {
    const current = tasks.find((task) => task.id === id);
    if (!current) return;

    try {
      await apiRequest(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: current.status === "completed" ? "pending" : "completed",
        }),
      });
      await fetchTasks(true);
    } catch (error) {
      setToast(`Status update failed: ${error.message}`);
    }
  }, [tasks, fetchTasks]);

  const deleteTask = useCallback(async (id) => {
    const ordered = [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const index = ordered.findIndex((task) => task.id === id);
    const removed = index >= 0 ? ordered[index] : null;

    try {
      await apiRequest(`/api/tasks/${id}`, { method: "DELETE" });
      await fetchTasks(true);
      if (removed) {
        setLastDeleted({ task: removed, index });
      }
      setToast(`Deleted: ${removed?.name ?? "Task"}`);
    } catch (error) {
      setToast(`Delete failed: ${error.message}`);
    }
  }, [tasks, fetchTasks]);

  const undoDelete = useCallback(async () => {
    if (!lastDeleted) return;

    try {
      const restored = await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          name: lastDeleted.task.name,
          priority: lastDeleted.task.priority,
          dueDate: lastDeleted.task.dueDate,
          status: lastDeleted.task.status,
        }),
      });

      const list = await apiRequest("/api/tasks");
      const normalized = Array.isArray(list)
        ? list.map((task, index) => normalizeTask(task, index)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : [];

      const from = normalized.findIndex((task) => task.id === restored?.id);
      const to = Math.max(0, Math.min(lastDeleted.index, normalized.length - 1));
      if (from >= 0 && from !== to) {
        const [moved] = normalized.splice(from, 1);
        normalized.splice(to, 0, moved);
        await persistOrder(normalized);
      }

      await fetchTasks(true);
      setLastDeleted(null);
      setToast("Task restored");
    } catch (error) {
      setToast(`Restore failed: ${error.message}`);
    }
  }, [lastDeleted, persistOrder, fetchTasks]);

  const reorderTasks = useCallback(async (dragId, targetId) => {
    const arr = [...orderedTasks];
    const from = arr.findIndex((task) => task.id === dragId);
    const to = arr.findIndex((task) => task.id === targetId);
    if (from < 0 || to < 0 || from === to) return;

    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);

    try {
      await persistOrder(arr);
      await fetchTasks(true);
    } catch (error) {
      setToast(`Reorder failed: ${error.message}`);
    }
  }, [orderedTasks, persistOrder, fetchTasks]);

  const completeAllPending = useCallback(async () => {
    const pending = tasks.filter((task) => task.status === "pending");
    if (!pending.length) return;

    try {
      await Promise.all(
        pending.map((task) =>
          apiRequest(`/api/tasks/${task.id}`, {
            method: "PUT",
            body: JSON.stringify({ status: "completed" }),
          })
        )
      );
      await fetchTasks(true);
      setToast("All pending tasks marked complete");
    } catch (error) {
      setToast(`Bulk complete failed: ${error.message}`);
    }
  }, [tasks, fetchTasks]);

  const clearCompleted = useCallback(async () => {
    const completed = tasks.filter((task) => task.status === "completed");
    if (!completed.length) return;

    try {
      await Promise.all(completed.map((task) => apiRequest(`/api/tasks/${task.id}`, { method: "DELETE" })));
      await fetchTasks(true);
      setToast("Completed tasks removed");
    } catch (error) {
      setToast(`Clear failed: ${error.message}`);
    }
  }, [tasks, fetchTasks]);

  const exportTasks = useCallback(() => {
    const payload = { version: 2, exportedAt: new Date().toISOString(), tasks };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `daily-task-manager-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setToast("Backup exported");
  }, [tasks]);

  const importTasks = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const list = Array.isArray(parsed) ? parsed : parsed?.tasks;
        if (!Array.isArray(list)) {
          setToast("Import failed: invalid file format");
          return;
        }

        const normalized = list.map((task, index) => normalizeTask(task, index)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const existing = await apiRequest("/api/tasks");

        if (Array.isArray(existing) && existing.length) {
          await Promise.all(existing.map((task) => apiRequest(`/api/tasks/${task.id}`, { method: "DELETE" })));
        }

        for (const task of normalized) {
          await apiRequest("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
              name: task.name,
              priority: task.priority,
              dueDate: task.dueDate,
              status: task.status,
            }),
          });
        }

        await fetchTasks(true);
        setLastDeleted(null);
        setToast(`Imported ${normalized.length} tasks`);
      } catch (error) {
        setToast(`Import failed: ${error.message || "invalid JSON"}`);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }, [fetchTasks]);

  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const completedCount = tasks.filter((task) => task.status === "completed").length;

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthView("login");
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setAuthView("login");
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setTasks([]);
    setToast(text.logoutToast);
  };

  const todayLabel = useMemo(() => new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }), []);

  const emptyState = useMemo(() => {
    if (isLoading) return { title: text.emptyLoadingTitle, sub: text.emptyLoadingSub };
    if (query) return { title: text.emptySearchTitle, sub: text.emptySearchSub };
    if (filter === "completed") return { title: text.emptyCompletedTitle, sub: text.emptyCompletedSub };
    if (filter === "pending") return { title: text.emptyPendingTitle, sub: text.emptyPendingSub };
    return { title: text.emptyDefaultTitle, sub: text.emptyDefaultSub };
  }, [filter, query, isLoading, text]);

  if (!user) {
    return (
      <>
        <style>{CSS}</style>
        <div className={`dtm ${theme === "dark" ? "theme-dark" : ""}`}>
          {authView === "login" ? (
            <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView("register")} />
          ) : (
            <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthView("login")} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className={`dtm ${theme === "dark" ? "theme-dark" : ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="dtm-wrap">
          <header className="dtm-header">
            <div className="title-block">
              <div className="brand-emblem">
                <img
                  className="brand-logo"
                  src="/logo.png"
                  alt="TimeWise logo"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/timewise-logo.svg";
                  }}
                />
              </div>
              <div className="brand-copy">
                <h1 className="brand-title">
                  {text.appTitleStart} <span>{text.appTitleAccent}</span>
                </h1>
                <p className="brand-tagline">{text.tagline}</p>
                <p className="subline">{todayLabel} | {text.sublineSuffix}</p>
              </div>
            </div>
            <div className="header-actions">
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "var(--surface-soft)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <User size={14} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--text)" }}>{user.username}</span>
              </div>
              <button className="btn" onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} title="Toggle theme">
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                {theme === "dark" ? text.light : text.dark}
              </button>
              <button className="btn" onClick={toggleLanguage} title="Toggle language">
                <Globe2 size={14} />
                {text.languageName}
              </button>
              <button className="btn" onClick={exportTasks}><Download size={14} /> {text.export}</button>
              <button className="btn" onClick={() => importRef.current?.click()}><Upload size={14} /> {text.import}</button>
              <button className="btn danger" onClick={handleLogout}><LogOut size={14} /> {text.logout}</button>
              <input ref={importRef} type="file" accept="application/json" style={{ display: "none" }} onChange={importTasks} />
            </div>
          </header>

          <InsightPanel tasks={tasks} text={text} />
          <NextTaskCard tasks={tasks} language={language} text={text} />
          <TaskForm onAdd={addTask} inputRef={addInputRef} text={text} />

          <Controls
            filter={filter}
            setFilter={setFilter}
            tasks={tasks}
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            searchInputRef={searchInputRef}
            text={text}
          />

          <BulkActions
            pendingCount={pendingCount}
            completedCount={completedCount}
            onCompleteAll={completeAllPending}
            onClearCompleted={clearCompleted}
            onUndo={undoDelete}
            canUndo={Boolean(lastDeleted)}
            text={text}
          />

          <TaskTable
            tasks={visibleTasks}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onEdit={editTask}
            onReorder={reorderTasks}
            canReorder={canReorder}
            emptyTitle={emptyState.title}
            emptySub={emptyState.sub}
            language={language}
            text={text}
          />

          <p className="tip">{text.tip}</p>
        </div>

        <Toast message={toast} onClose={() => setToast("")} onUndo={undoDelete} showUndo={Boolean(lastDeleted)} text={text} />
      </div>
    </>
  );
}
