import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <span className="text-xl font-bold tracking-tight text-cyan-400">ResumeAI</span>
        <div className="flex gap-4">
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">Log in</Link>
          <Link to="/register" className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium hover:bg-cyan-400 transition">Sign up</Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <section className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">AI-Powered Resume Builder</p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Build a resume that <span className="text-cyan-400">gets you hired</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Let AI craft a professional, ATS-friendly resume tailored to your dream job. No templates. No guesswork. Just results.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register" className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold hover:bg-cyan-400 transition">Get started free</Link>
            <Link to="/login" className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/5 transition">Sign in</Link>
          </div>
        </section>

        <section className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "AI-Powered Writing", desc: "Generate bullet points, summaries, and achievements tailored to your target role." },
            { title: "ATS Optimization", desc: "Ensure your resume passes applicant tracking systems with keyword suggestions." },
            { title: "Instant Formatting", desc: "Clean, professional layouts that adapt to your content automatically." },
          ].map((f, i) => (
            <div key={i} className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-24 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to upgrade your resume?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">Join thousands of professionals landing interviews with AI-crafted resumes.</p>
          <Link to="/register" className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold hover:bg-cyan-400 transition">Create your resume</Link>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
