import Link from 'next/link';

export const metadata = {
  title: 'Message Sent | Powered by Sendly',
  description: 'Your form submission was successful.',
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#040814] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-lg shadow-green-500/10">
            <svg className="w-8 h-8 animate-in zoom-in duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3">Message Sent Successfully!</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            The website owner has securely received your submission and will get back to you shortly.
          </p>

          <div className="w-full h-px bg-white/10 mb-8"></div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-3 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Powered By Sendly
            </p>
            <h3 className="text-white font-semibold mb-2">Want forms like this on your site?</h3>
            <p className="text-slate-400 text-sm mb-5">
              This site uses Sendly as a complete, drop-in backend for their HTML forms. No servers required!
            </p>
            <Link href="/" className="inline-flex w-full justify-center items-center py-3 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5">
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
