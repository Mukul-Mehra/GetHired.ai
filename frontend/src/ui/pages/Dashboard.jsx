import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { chatWithAI } from "../../auth/auth.api.js";
import { useAuth } from "../../hooks/useAuth.js";

const emptyReport = {
  matchScore: 0,
  technicalQuestions: [],
  behavioralQuestions: [],
  skillGaps: [],
  preparationPlan: [],
};

const STORAGE_KEY = "resumeai_dashboard_state_v1";
const HISTORY_KEY = "resumeai_report_history_v1";
const THEME_KEY = "resumeai_theme_v1";

function buildPrompt(resume, selfDescription, jobDescription) {
  return `Generate an interview report for a candidate based on the following information.
Return ONLY valid JSON with exactly these top-level keys:
- matchScore
- technicalQuestions
- behavioralQuestions
- skillGaps
- preparationPlan
Each item in technicalQuestions and behavioralQuestions must be an object with question, intention, answer.
Each item in skillGaps must be an object with skill, severity.
Each item in preparationPlan must be an object with day, focus, task (array of strings).
Candidate's Resume:
${resume}
Candidate's Self-Description:
${selfDescription}
Job Description:
${jobDescription}
Return STRICT JSON only.`;
}

function parseReportFromReply(replyText) {
  try {
    const parsed = JSON.parse(replyText);
    return {
      ...emptyReport,
      ...parsed,
      technicalQuestions: Array.isArray(parsed.technicalQuestions) ? parsed.technicalQuestions : [],
      behavioralQuestions: Array.isArray(parsed.behavioralQuestions) ? parsed.behavioralQuestions : [],
      skillGaps: Array.isArray(parsed.skillGaps) ? parsed.skillGaps : [],
      preparationPlan: Array.isArray(parsed.preparationPlan) ? parsed.preparationPlan : [],
    };
  } catch {
    return null;
  }
}

function extractTextFromPdfBytes(uint8Array) {
  const raw = new TextDecoder("latin1").decode(uint8Array);
  const chunks = [];
  const regex = /\(([^()]{2,})\)/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const candidate = match[1]
      .replace(/\\n/g, " ")
      .replace(/\\r/g, " ")
      .replace(/\\t/g, " ")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\s+/g, " ")
      .trim();
    if (candidate.length > 2 && /[a-zA-Z]/.test(candidate)) chunks.push(candidate);
  }
  return chunks.join(" ").replace(/\s+/g, " ").trim();
}

function getGapRecommendation(skill = "") {
  const normalized = skill.toLowerCase();
  if (normalized.includes("typescript")) return "Build one feature in strict TypeScript and define reusable interfaces.";
  if (normalized.includes("next")) return "Create a small Next.js app and practice routing + server components.";
  if (normalized.includes("postgres") || normalized.includes("sql")) return "Model relational schema and practice joins + indexing.";
  if (normalized.includes("docker") || normalized.includes("ci")) return "Containerize app and add one CI build/test workflow.";
  if (normalized.includes("cloud") || normalized.includes("aws") || normalized.includes("gcp")) return "Deploy one sample app to cloud and document env/deploy steps.";
  return "Create a focused mini project around this skill and track daily progress.";
}

export default function Dashboard() {
  const { user, loading: authLoading, handleLogout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState("dark");
  const [resume, setResume] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeExtracting, setResumeExtracting] = useState(false);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [report, setReport] = useState(emptyReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawReply, setRawReply] = useState("");

  const isDark = theme === "dark";
  const rootClass = isDark ? "min-h-screen bg-slate-950 text-white" : "min-h-screen bg-slate-100 text-slate-900";
  const cardClass = isDark ? "rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl" : "rounded-3xl border border-slate-200 bg-white p-6 shadow";
  const subCardClass = isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4" : "rounded-2xl border border-slate-200 bg-slate-50 p-4";
  const inputClass = isDark
    ? "mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-cyan-400/60"
    : "mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-cyan-500/50";

  const userView = {
    name: user?.username || "Candidate",
    email: user?.email || "Not available",
    role: "Candidate",
    joinedAt: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently",
    status: user ? "Active" : "Not Signed In",
    id: user?.id || "N/A",
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      setResume(parsed.resume || "");
      setResumeFileName(parsed.resumeFileName || "");
      setSelfDescription(parsed.selfDescription || "");
      setJobDescription(parsed.jobDescription || "");
      setRawReply(parsed.rawReply || "");
      setReport(parsed.report ? { ...emptyReport, ...parsed.report } : emptyReport);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ resume, resumeFileName, selfDescription, jobDescription, report, rawReply })
    );
  }, [resume, resumeFileName, selfDescription, jobDescription, report, rawReply]);

  const hasReport =
    report.matchScore > 0 ||
    report.technicalQuestions.length > 0 ||
    report.behavioralQuestions.length > 0 ||
    report.skillGaps.length > 0 ||
    report.preparationPlan.length > 0;

  const severityClass = useMemo(
    () => ({
      low: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
      medium: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
      high: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
    }),
    []
  );

  async function handleGenerate() {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Resume and Job Description are required.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setRawReply("");
      const message = buildPrompt(
        resume.trim(),
        selfDescription.trim() || "No self-description provided.",
        jobDescription.trim()
      );
      const data = await chatWithAI(message);
      const reply = data?.reply || "";
      setRawReply(reply);
      const parsed = parseReportFromReply(reply);
      if (!parsed) {
        setError("AI response was not valid JSON. Check backend reply format.");
        setReport(emptyReport);
        return;
      }
      setReport(parsed);
      const prev = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      const historyItem = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        jobTitleHint: (jobDescription.split("\n").find((line) => line.trim().length > 0) || "Untitled Job").slice(0, 120),
        report: parsed,
      };
      localStorage.setItem(HISTORY_KEY, JSON.stringify([historyItem, ...prev].slice(0, 30)));
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to generate report.");
      setReport(emptyReport);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setResume("");
    setResumeFileName("");
    setResumeExtracting(false);
    setSelfDescription("");
    setJobDescription("");
    setReport(emptyReport);
    setRawReply("");
    setError("");
    localStorage.removeItem(STORAGE_KEY);
  }

  async function handleResumeUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file for resume.");
      return;
    }
    try {
      setError("");
      setResumeExtracting(true);
      setResumeFileName(file.name);
      const extracted = extractTextFromPdfBytes(new Uint8Array(await file.arrayBuffer()));
      if (!extracted) {
        setError("Could not extract readable text from this PDF. Try another PDF.");
        setResume("");
        return;
      }
      setResume(extracted);
    } catch {
      setError("Failed to read PDF file. Please try again.");
    } finally {
      setResumeExtracting(false);
      event.target.value = "";
    }
  }

  async function onLogout() {
    const ok = await handleLogout();
    if (ok) navigate("/login");
  }

  return (
    <div className={rootClass}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Welcome back, {userView.name}</h1>
            <p className={isDark ? "mt-2 text-slate-400" : "mt-2 text-slate-600"}>Build interview prep reports from your resume, self-description, and job description.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/history" className={isDark ? "rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10" : "rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"}>History</Link>
            <button onClick={() => setTheme(isDark ? "light" : "dark")} className={isDark ? "rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10" : "rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"}>
              {isDark ? "Light" : "Dark"}
            </button>
            <button onClick={onLogout} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400">
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className={`${cardClass} lg:col-span-1`}>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/15 text-2xl font-bold text-cyan-400 ring-1 ring-cyan-400/20">JD</div>
              <div>
                <h2 className="text-xl font-semibold">{userView.name}</h2>
                <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>{userView.role}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className={subCardClass}><div className="flex items-center justify-between"><span className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Status</span><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">{authLoading ? "Loading..." : userView.status}</span></div></div>
              <div className={subCardClass}><div className="flex items-center justify-between"><span className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>User ID</span><span className="text-sm font-medium">{userView.id}</span></div></div>
              <div className={subCardClass}><div className="flex items-center justify-between"><span className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Joined</span><span className="text-sm font-medium">{userView.joinedAt}</span></div></div>
              <div className={subCardClass}><div className="flex items-center justify-between"><span className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>Email</span><span className="text-sm font-medium">{userView.email}</span></div></div>
            </div>
          </div>

          <div className={`${cardClass} lg:col-span-2`}>
            <h2 className="text-xl font-semibold">AI Interview Report Workspace</h2>
            <p className={isDark ? "mt-1 text-sm text-slate-400" : "mt-1 text-sm text-slate-600"}>Connected to backend chat route. Fill details and generate.</p>
            <div className="mt-6 space-y-4">
              <div className={subCardClass}>
                <label className={isDark ? "text-sm text-slate-300" : "text-sm text-slate-700"}>Resume</label>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-500 transition hover:bg-cyan-500/20">
                    Upload PDF
                    <input type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" />
                  </label>
                  {resumeExtracting ? <span className="text-xs text-amber-500">Reading PDF...</span> : null}
                  {resumeFileName ? <span className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>{resumeFileName}</span> : null}
                </div>
                <p className={isDark ? "mt-3 text-xs text-slate-400" : "mt-3 text-xs text-slate-600"}>
                  {resume ? `Resume text extracted (${resume.length} chars).` : "Upload a text-based PDF resume to continue."}
                </p>
              </div>
              <div className={subCardClass}>
                <label className={isDark ? "text-sm text-slate-300" : "text-sm text-slate-700"}>Self Description (Optional)</label>
                <textarea rows={3} value={selfDescription} onChange={(e) => setSelfDescription(e.target.value)} placeholder="Describe your strengths, goals, and working style..." className={inputClass} />
              </div>
              <div className={subCardClass}>
                <label className={isDark ? "text-sm text-slate-300" : "text-sm text-slate-700"}>Job Description</label>
                <textarea rows={5} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste target job description..." className={inputClass} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleGenerate} disabled={loading} className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60">{loading ? "Generating..." : "Generate Report"}</button>
                <button onClick={handleClear} disabled={loading} className={isDark ? "rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-60" : "rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"}>Clear</button>
              </div>
              {error ? <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</div> : null}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className={cardClass}>
            <p className={isDark ? "text-sm uppercase tracking-[0.2em] text-slate-400" : "text-sm uppercase tracking-[0.2em] text-slate-600"}>Match Score</p>
            <div className="mt-4 flex items-end gap-2"><span className="text-5xl font-black text-cyan-400">{report.matchScore || 0}</span><span className={isDark ? "pb-2 text-slate-400" : "pb-2 text-slate-600"}>/100</span></div>
            <div className={isDark ? "mt-4 h-2 rounded-full bg-white/10" : "mt-4 h-2 rounded-full bg-slate-200"}><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${Math.max(0, Math.min(100, report.matchScore || 0))}%` }} /></div>
          </div>
          <div className={`${cardClass} lg:col-span-2`}>
            <h3 className="text-lg font-semibold">Skill Gaps</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {report.skillGaps.length === 0 ? <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>No data yet.</p> : report.skillGaps.map((gap, idx) => (
                <div key={`${gap.skill || "skill"}-${idx}`} className={isDark ? "rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2" : "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"}>
                  <p className="text-sm font-medium">{gap.skill}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${severityClass[gap.severity] || severityClass.medium}`}>{gap.severity || "medium"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${cardClass} mt-6`}>
          <h3 className="text-lg font-semibold">Key Gaps And Solutions</h3>
          <div className="mt-4 space-y-3">
            {report.skillGaps.length === 0 ? <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>No data yet.</p> : report.skillGaps.map((gap, idx) => (
              <div key={`gap-solution-${idx}`} className={subCardClass}>
                <p className="text-sm font-semibold text-cyan-300">{idx + 1}. {gap.skill}</p>
                <p className={isDark ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-600"}>Severity: {gap.severity || "medium"}</p>
                <p className={isDark ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-slate-700"}>{getGapRecommendation(gap.skill)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className={cardClass}>
            <h3 className="text-lg font-semibold">Technical Questions</h3>
            <div className="mt-4 space-y-4">
              {report.technicalQuestions.length === 0 ? <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>No data yet.</p> : report.technicalQuestions.map((item, idx) => (
                <article key={idx} className={subCardClass}>
                  <p className="text-sm font-semibold text-cyan-300">Q{idx + 1}. {item.question}</p>
                  <p className={isDark ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-slate-700"}><span className={isDark ? "text-slate-400" : "text-slate-600"}>Intention: </span>{item.intention}</p>
                  <p className={isDark ? "mt-1 text-sm text-slate-300" : "mt-1 text-sm text-slate-700"}><span className={isDark ? "text-slate-400" : "text-slate-600"}>Answer: </span>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className="text-lg font-semibold">Behavioral Questions</h3>
              <div className="mt-4 space-y-4">
                {report.behavioralQuestions.length === 0 ? <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>No data yet.</p> : report.behavioralQuestions.map((item, idx) => (
                  <article key={idx} className={subCardClass}>
                    <p className="text-sm font-semibold text-cyan-300">Q{idx + 1}. {item.question}</p>
                    <p className={isDark ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-slate-700"}><span className={isDark ? "text-slate-400" : "text-slate-600"}>Intention: </span>{item.intention}</p>
                    <p className={isDark ? "mt-1 text-sm text-slate-300" : "mt-1 text-sm text-slate-700"}><span className={isDark ? "text-slate-400" : "text-slate-600"}>Answer: </span>{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className={cardClass}>
              <h3 className="text-lg font-semibold">Preparation Plan</h3>
              <div className="mt-4 space-y-4">
                {report.preparationPlan.length === 0 ? <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-600"}>No data yet.</p> : report.preparationPlan.map((day, idx) => (
                  <div key={`${day.day || idx}`} className={subCardClass}>
                    <p className="text-sm font-semibold text-cyan-300">Day {day.day}: {day.focus}</p>
                    <ul className={isDark ? "mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300" : "mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700"}>
                      {(Array.isArray(day.task) ? day.task : []).map((task, tIdx) => <li key={tIdx}>{task}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={isDark ? "mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4" : "mt-6 rounded-2xl border border-cyan-300 bg-cyan-50 p-4"}>
          <p className={isDark ? "text-sm text-cyan-300" : "text-sm text-cyan-700"}>
            {hasReport ? "Report generated from backend response." : "Fill inputs and click Generate Report."}
          </p>
          {rawReply && !hasReport ? <pre className={isDark ? "mt-3 max-h-56 overflow-auto rounded-xl bg-slate-950/70 p-3 text-xs text-slate-300" : "mt-3 max-h-56 overflow-auto rounded-xl bg-slate-100 p-3 text-xs text-slate-700"}>{rawReply}</pre> : null}
        </div>
      </div>
    </div>
  );
}
