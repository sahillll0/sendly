import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center bg-[#020617] text-white overflow-hidden relative font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto px-6 pt-24 pb-24 md:pt-32 md:pb-32 text-center z-10">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-slate-300 text-sm font-medium mb-10 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span>Simple, Powerful Form Backend for Developers</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
          Handle Forms <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-primary to-violet-400 bg-clip-text text-transparent">Without a Server</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed">
          The easiest way to receive form submissions from your static site. 
          Connect your frontend to our API and get emails instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/auth/register"
            className="group relative flex items-center space-x-3 px-8 py-4 md:px-10 md:py-5 rounded-2xl bg-primary text-white font-bold transition-all shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-[1.02]"
          >
            <span>Start Building for Free</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/docs"
            className="flex items-center space-x-3 px-8 py-4 md:px-10 md:py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all"
          >
            <span>API Reference</span>
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="relative w-full py-24 md:py-32 bg-[#040814]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for modern workflows</h2>
            <p className="text-base md:text-lg text-slate-400">Everything you need to manage your form data at scale.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>}
              title="Secure API Keys" 
              desc="Create unique keys for each project. Control where your submissions come from with domain locking." 
            />
            <FeatureCard 
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              title="Auto-Responders" 
              desc="Send beautiful, branded confirmation emails to your users automatically after they submit." 
            />
            <FeatureCard 
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              title="Data Dashboard" 
              desc="A clean interface to view, filter, and export your submissions. No more messy spreadsheets." 
            />
          </div>
        </div>
      </section>

      {/* 3. Code Example Section */}
      <section id="docs" className="relative w-full py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Implement in <br/> seconds, not hours.</h2>
              <p className="text-base md:text-lg text-slate-400 mb-8 leading-relaxed">
                Sendly works with any frontend framework. No complex SDKs or libraries to install. Just a simple POST request.
              </p>
              <ul className="space-y-4 text-left">
                {['Zero configuration required', 'Works with static sites (HTML, Jekyll, Hugo)', 'Spam protection included'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-300">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-[#0b1120] rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5 bg-white/5">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <span className="ml-4 text-xs font-mono text-slate-500">api_test.js</span>
                  </div>
                  <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-wider">Javascript</div>
                </div>
                <div className="p-4 sm:p-8 overflow-x-auto text-sm font-mono leading-relaxed">
                  <pre className="text-slate-300">
                    <code>
{`fetch('https://api.sendly.com/v1/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk_live_xxxxxxx'
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hello, this API is amazing!'
  })
})`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="relative w-full py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">Ready to ship?</h2>
          <p className="text-lg md:text-xl text-slate-400 mb-12">Join developers using Sendly for their forms.</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center space-x-3 px-10 py-5 md:px-12 md:py-6 rounded-2xl bg-white text-slate-900 font-black hover:bg-slate-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-[1.05]"
          >
            <span>Create Free Account</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Sendly API. Built for the modern web.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-[#0b1120]/50 border border-white/5 rounded-3xl p-10 hover:bg-white/[0.03] hover:border-primary/30 transition-all duration-500 group">
      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-white mb-4">{title}</h4>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
