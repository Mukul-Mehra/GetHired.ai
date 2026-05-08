import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const HISTORY_KEY = "resumeai_report_history_v1";
const THEME_KEY = "resumeai_theme_v1";

export default function History() {
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("dark");
  const isDark = theme === "dark";

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    const savedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    setHistory(savedHistory);
  }, []);

  const rootClass = useMemo(
    () => (isDark ? "min-h-screen bg-slate-950 text-white" : "min-h-screen bg-slate-100 text-slate-900"),
    [isDark]
  );
  const cardClass = useMemo(
    () => (isDark ? "rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl" : "rounded-3xl border border-slate-200 bg-white p-6 shadow"),
    [isDark]
  );

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }

  return (
    <div className={rootClass}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">History</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Report History</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard" className={isDark ? "rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10" : "rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"}>
              Back
            </Link>
            <button onClick={clearHistory} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400">
              Clear History
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className={cardClass}>
              <p className={isDark ? "text-slate-400" : "text-slate-600"}>No reports saved yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className={cardClass}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-semibold">{item.jobTitleHint || "Untitled Job"}</p>
                  <span className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-600"}>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className={isDark ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-slate-700"}>
                  Match Score: <span className="font-semibold text-cyan-400">{item.report?.matchScore ?? 0}</span>/100
                </p>
                <p className={isDark ? "mt-1 text-sm text-slate-400" : "mt-1 text-sm text-slate-600"}>
                  Technical: {item.report?.technicalQuestions?.length || 0} | Behavioral: {item.report?.behavioralQuestions?.length || 0} | Skill Gaps: {item.report?.skillGaps?.length || 0}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
