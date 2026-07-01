import { useState } from "react";
import { Globe2, LogIn, UserPlus } from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const AUTH_LANG_KEY = "dtm_auth_lang";

const COPY = {
    en: {
        languageName: "العربية",
        loginTitle: "Log in",
        loginSubtitle: "Welcome back to Daily Task Manager",
        registerTitle: "Create an account",
        registerSubtitle: "Join us and start organizing your tasks",
        username: "Username",
        password: "Password",
        loading: "Loading...",
        loginButton: "Log in",
        registerButton: "Create account",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        createAccountLink: "Create a new account",
        loginLink: "Log in",
    },
    ar: {
        languageName: "English",
        loginTitle: "تسجيل الدخول",
        loginSubtitle: "مرحبا بك في مدير المهام اليومية",
        registerTitle: "إنشاء حساب جديد",
        registerSubtitle: "انضم إلينا وابدأ في تنظيم مهامك",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        loading: "جاري التحميل...",
        loginButton: "تسجيل الدخول",
        registerButton: "إنشاء الحساب",
        noAccount: "ليس لديك حساب؟",
        haveAccount: "لديك حساب بالفعل؟",
        createAccountLink: "إنشاء حساب جديد",
        loginLink: "تسجيل الدخول",
    },
};

async function authRequest(path, body) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const text = await response.text();
    let payload = null;
    if (text) {
        try {
            payload = JSON.parse(text);
        } catch { }
    }

    if (!response.ok) {
        const message = payload?.error || `Request failed (${response.status})`;
        throw new Error(message);
    }

    return payload;
}

function loadAuthLanguage() {
    try {
        const saved = localStorage.getItem(AUTH_LANG_KEY);
        return saved === "ar" ? "ar" : "en";
    } catch {
        return "en";
    }
}

function useAuthLanguage() {
    const [language, setLanguage] = useState(() => loadAuthLanguage());
    const toggleLanguage = () => {
        setLanguage((current) => {
            const next = current === "en" ? "ar" : "en";
            try {
                localStorage.setItem(AUTH_LANG_KEY, next);
            } catch { }
            return next;
        });
    };

    return { language, toggleLanguage, text: COPY[language] };
}

const AUTH_CSS = `
.auth-container{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.auth-card{background:var(--card-bg);backdrop-filter:blur(14px);border:1px solid var(--card-border-soft);border-radius:18px;box-shadow:var(--shadow);padding:32px;max-width:420px;width:100%;animation:rise .28s ease}
.auth-topbar{display:flex;justify-content:flex-end;margin-bottom:14px}
.auth-lang{border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:10px;padding:8px 10px;display:inline-flex;align-items:center;gap:7px;font-size:.84rem;font-weight:600;cursor:pointer;transition:transform .12s ease,border-color .12s ease,background .12s ease}
.auth-lang:hover{transform:translateY(-1px);border-color:var(--border-strong)}
.auth-title{font-family:var(--heading);font-size:1.8rem;margin-bottom:8px;text-align:center;color:var(--text)}
.auth-subtitle{color:var(--muted);text-align:center;margin-bottom:24px;font-size:.9rem}
.auth-form{display:flex;flex-direction:column;gap:14px}
.auth-input{width:100%;border:1px solid var(--border);border-radius:11px;padding:12px 14px;background:var(--surface-soft);color:var(--text);font-family:var(--sans);font-size:.95rem;outline:none;transition:border-color .14s ease,box-shadow .14s ease}
.auth-input:focus{border-color:var(--accent-strong);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 20%,transparent)}
.auth-btn{border:1px solid var(--accent);background:var(--accent);color:#1f2b38;border-radius:10px;padding:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-size:.95rem;font-weight:600;cursor:pointer;transition:transform .12s ease,background .12s ease}
.auth-btn:hover{transform:translateY(-1px);background:var(--accent-strong);border-color:var(--accent-strong)}
.auth-btn:active{transform:translateY(0)}
.auth-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.auth-error{background:color-mix(in srgb,var(--danger) 14%,transparent);border:1px solid color-mix(in srgb,var(--danger) 38%,var(--border));color:var(--danger);padding:10px 12px;border-radius:10px;font-size:.88rem;text-align:center}
.auth-switch{text-align:center;margin-top:16px;color:var(--muted);font-size:.88rem}
.auth-link{color:var(--accent-strong);cursor:pointer;text-decoration:underline}
.auth-link:hover{color:var(--accent)}
.auth-card.is-ar{direction:rtl}
.auth-card.is-ar .auth-topbar{justify-content:flex-start}
.auth-card.is-ar .auth-input{text-align:right}
.auth-card.is-en .auth-input{text-align:left}
`;

export function Login({ onLogin, onSwitchToRegister }) {
    const { language, toggleLanguage, text } = useAuthLanguage();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await authRequest("/api/login", { username, password });
            localStorage.setItem("dtm_user", JSON.stringify(user));
            onLogin(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{AUTH_CSS}</style>
            <div className="auth-container">
                <div className={`auth-card is-${language}`}>
                    <div className="auth-topbar">
                        <button className="auth-lang" type="button" onClick={toggleLanguage}>
                            <Globe2 size={15} />
                            {text.languageName}
                        </button>
                    </div>
                    <h2 className="auth-title">{text.loginTitle}</h2>
                    <p className="auth-subtitle">{text.loginSubtitle}</p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && <div className="auth-error">{error}</div>}

                        <input
                            className="auth-input"
                            type="text"
                            placeholder={text.username}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />

                        <input
                            className="auth-input"
                            type="password"
                            placeholder={text.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button className="auth-btn" type="submit" disabled={loading}>
                            <LogIn size={16} />
                            {loading ? text.loading : text.loginButton}
                        </button>
                    </form>

                    <div className="auth-switch">
                        {text.noAccount}{" "}
                        <span className="auth-link" onClick={onSwitchToRegister}>
                            {text.createAccountLink}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export function Register({ onRegister, onSwitchToLogin }) {
    const { language, toggleLanguage, text } = useAuthLanguage();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await authRequest("/api/register", { username, password });
            localStorage.setItem("dtm_user", JSON.stringify(user));
            onRegister(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{AUTH_CSS}</style>
            <div className="auth-container">
                <div className={`auth-card is-${language}`}>
                    <div className="auth-topbar">
                        <button className="auth-lang" type="button" onClick={toggleLanguage}>
                            <Globe2 size={15} />
                            {text.languageName}
                        </button>
                    </div>
                    <h2 className="auth-title">{text.registerTitle}</h2>
                    <p className="auth-subtitle">{text.registerSubtitle}</p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && <div className="auth-error">{error}</div>}

                        <input
                            className="auth-input"
                            type="text"
                            placeholder={text.username}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />

                        <input
                            className="auth-input"
                            type="password"
                            placeholder={text.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button className="auth-btn" type="submit" disabled={loading}>
                            <UserPlus size={16} />
                            {loading ? text.loading : text.registerButton}
                        </button>
                    </form>

                    <div className="auth-switch">
                        {text.haveAccount}{" "}
                        <span className="auth-link" onClick={onSwitchToLogin}>
                            {text.loginLink}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
