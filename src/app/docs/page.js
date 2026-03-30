import React from 'react';

export const metadata = {
  title: 'Documentation | Sendly',
  description: 'Learn how to integrate the Sendly API for form submissions.',
};

const CodeBlock = ({ code }) => (
  <div className="my-4 rounded-xl bg-neutral-950 p-4 border border-neutral-800 overflow-x-auto shadow-sm">
    <pre className="text-sm text-neutral-50 font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  </div>
);

export default function DocsPage() {

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-20 lg:px-8 font-sans">

        {/* Header */}
        <div className="mb-14 border-b border-border pb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground">
            Documentation
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Sendly is a simple API that allows you to handle form submissions and receive them as emails <span className="text-foreground font-medium">without setting up a backend</span>.
          </p>
        </div>

        <div className="space-y-20">

          {/* 1. Introduction */}
          <section id="introduction">
            <h2 className="text-2xl font-semibold mb-5 text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Welcome to Sendly. Our platform is designed to make form handling as seamless as possible. You construct your frontend, point your forms to our API, and we'll deliver the submissions directly to your inbox.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 shadow-sm">
              <p className="font-medium text-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                Key Benefit: No backend required. Just plug and play.
              </p>
            </div>
          </section>

          {/* 2. Getting Started */}
          <section id="getting-started">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              2. Getting Started
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold mb-4">1</div>
                <h3 className="font-semibold text-lg mb-2">Create an Account</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sign up on Sendly and log into your dashboard to magically generate your first API key.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold mb-4">2</div>
                <h3 className="font-semibold text-lg mb-2">Copy API Key</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Navigate to the specific <strong>Settings</strong> tab in your dashboard and safely copy your secret API key.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Basic Usage */}
          <section id="basic-usage">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              3. Basic Usage
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Sendly is completely framework-agnostic. You can easily use native HTML forms or any library you choose. Make sure you place your API key securely into the <code className="text-sm bg-muted px-1.5 py-0.5 rounded border border-border">apiKey</code> field.
            </p>

            <CodeBlock code={`<form action="https://sendly-bay.vercel.app/api/send" method="POST">
  <!-- Place your Project API key here -->
  <input type="hidden" name="apiKey" value="sk_live_xxxxxxxxxxxxxxxx" />

  <label for="name">Name</label>
  <input type="text" id="name" name="name" required />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <button type="submit">Send Message</button>
</form>`} />
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              After submission, Sendly securely processes your fields and directly drops a clean, formatted email into the account owner's inbox. Make sure to replace <code className="text-sm bg-muted px-1.5 py-0.5 rounded border border-border">http://your-domain.com</code> with your actual site URL.
            </p>

            <div className="bg-primary/5 p-5 rounded-xl border border-primary/20 mt-6 shadow-sm">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Automatic Success Redirect
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                When your users submit a standard HTML form natively (without using JavaScript or <code className="text-xs bg-muted px-1.5 py-0.5 rounded">fetch</code>), our API automatically redirects them to a beautiful Sendly-hosted Success Page confirming their message was received. This page includes a small tag showing they are powered by Sendly.
              </p>
            </div>
          </section>

          {/* 4. API Endpoint */}
          <section id="api-endpoint">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              4. API Endpoint
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you prefer using JavaScript (AJAX/Fetch), you can call our endpoint directly with JSON data.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded">POST</span>
                <code className="text-sm font-mono text-foreground">/api/send</code>
              </div>
              <CodeBlock code={`fetch('https://sendly-bay.vercel.app/api/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk_live_xxxxxxxxxxxxxxxx'
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hello, this API is amazing!'
  })
})`} />
            </div>
          </section>

          {/* 5. CORS & Security */}
          <section id="cors">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              5. CORS & Security
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Sendly has built-in CORS support, allowing you to call the API from any domain. You don't need to configure any extra headers on your server.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Supports <code className="text-xs bg-muted p-1 rounded">application/json</code> and <code className="text-xs bg-muted p-1 rounded">application/x-www-form-urlencoded</code>.</li>
              <li>Always use your <strong>Secret API Key</strong> starting with <code className="text-xs bg-muted p-1 rounded">sk_</code>.</li>
              <li>Keep your API keys private. Never share them in public repositories.</li>
            </ul>
          </section>

          {/* 6. API Endpoint Details */}
          <section id="api-endpoint-details">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              6. API Endpoint Details
            </h2>
            <div className="flex items-center gap-4 mb-8 bg-muted p-4 rounded-xl border border-border">
              <span className="px-3 py-1 bg-green-500/15 text-green-700 dark:text-green-400 font-mono text-sm font-semibold rounded-md border border-green-500/30">POST</span>
              <code className="text-base text-foreground font-mono">https://sendly-bay.vercel.app/api/send</code>
            </div>

            <h3 className="font-semibold text-lg mb-4 text-foreground">Required Fields</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                <code className="text-sm text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md mt-0.5">apiKey</code>
                <div>
                  <div className="font-medium text-foreground mb-1"><span className="text-red-500 text-sm font-semibold mr-2">Required</span> Your Secret Token</div>
                  <div className="text-sm text-muted-foreground">The unique key to authenticate your project.</div>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                <code className="text-sm text-foreground bg-muted border border-border px-2.5 py-1 rounded-md mt-0.5">email</code>
                <div>
                  <div className="font-medium text-foreground mb-1"><span className="text-red-500 text-sm font-semibold mr-2">Required</span> Sender Email</div>
                  <div className="text-sm text-muted-foreground">The email address of the person filling out the form.</div>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                <code className="text-sm text-foreground bg-muted border border-border px-2.5 py-1 rounded-md mt-0.5">message</code>
                <div>
                  <div className="font-medium text-foreground mb-1"><span className="text-red-500 text-sm font-semibold mr-2">Required</span> Request Body</div>
                  <div className="text-sm text-muted-foreground">The body of the form submission.</div>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                <code className="text-sm text-foreground bg-muted border border-border px-2.5 py-1 rounded-md mt-0.5">name</code>
                <div>
                  <div className="font-medium text-foreground mb-1"><span className="text-muted-foreground text-sm font-semibold mr-2">Optional</span> Sender Name</div>
                  <div className="text-sm text-muted-foreground">The sender's full name.</div>
                </div>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-6 leading-relaxed bg-primary/5 p-4 rounded-lg border border-primary/10">
              <strong className="text-foreground">Formats:</strong> Send your request beautifully in <code className="text-xs bg-muted px-1.5 py-0.5 rounded">application/json</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded">application/x-www-form-urlencoded</code>. We always return a predictable JSON response indicating success or an error string.
            </p>
          </section>

          {/* 7. Integration Examples */}
          <section id="integration-examples">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              7. Integration Examples
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Here is the best way to integrate Sendly into your existing projects. You can pass the API key either securely in the body payload or via the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">apikey</code> header.
            </p>

            <h3 className="font-semibold text-lg mb-4 text-foreground mt-8">Vanilla JavaScript Fetch</h3>
            <CodeBlock code={`fetch("https://sendly-bay.vercel.app/api/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": "sk_live_YOUR_API_KEY" // Pass API key in header. For security, always store your key in a .env file.
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "I am really interested in your services!"
  })
})
.then(response => response.json())
.then(data => {
  if (data.status === "success") {
    console.log("Email properly securely sent!");
  }
});`} />

            <h3 className="font-semibold text-lg mb-4 text-foreground mt-10">React / Next.js Component (Drop-in ready)</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you are using React or Next.js, you can seamlessly copy and paste this Contact Form component into your frontend project.
            </p>
            <CodeBlock code={`import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const res = await fetch("https://sendly-bay.vercel.app/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "sk_live_YOUR_API_KEY" // Add your Secret API key here
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.status === "success") {
        setStatus("Message Sent!");
        e.target.reset();
      } else {
        setStatus("Error: " + data.message);
      }
    } catch (err) {
      setStatus("Failed to send the message.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <input type="text" name="name" placeholder="Your Name" required style={{ padding: '0.5rem' }} />
      <input type="email" name="email" placeholder="Your Email" required style={{ padding: '0.5rem' }} />
      <textarea name="message" placeholder="Your Message" required style={{ padding: '0.5rem', minHeight: '100px' }} />
      <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer' }}>Submit</button>
      {status && <p>{status}</p>}
    </form>
  );
}`} />
          </section>

          {/* 8. How It Works */}
          <section id="how-it-works">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              8. How It Works
            </h2>
            <div className="space-y-6 pl-2 border-l-2 border-primary/20 ml-4 py-2">
              {[
                "User beautifully submits the form on your website.",
                "The payload request is safely sent directly to the Sendly API endpoint.",
                "Sendly strictly validates your API key and the provided data.",
                "A clean, formatted email is beautifully sent to the main account owner.",
                "The safe submission is saved in your own dashboard for audit and future view."
              ].map((step, index) => (
                <div key={index} className="flex relative items-center gap-5">
                  <div className="absolute -left-[1.35rem] w-6 h-6 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center font-bold text-xs shadow-sm">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground ml-4 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 9. Notes & Best Practices */}
          <section id="best-practices">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              9. Notes & Best Practices
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 border border-red-500/30 rounded-xl bg-red-500/5 shadow-sm">
                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Keep Your API Key Private!
                </h4>
                <p className="text-sm text-foreground font-medium leading-relaxed">For your absolute safety, <strong>NEVER</strong> paste your Secret API Key openly in public repositories or unprotected client-side code where anyone can scrape it. If you must embed it directly in HTML forms on your site, heavily restrict your key to only your approved domains via the Sendly dashboard.</p>
              </div>
              <div className="p-5 border border-border rounded-xl bg-card shadow-sm">
                <h4 className="font-semibold mb-2">✅ Frontend Validations</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Validate form inputs heavily on the frontend (like email format validation) so your users get active immediate feedback before submit.</p>
              </div>
              <div className="p-5 border border-border rounded-xl bg-card shadow-sm">
                <h4 className="font-semibold mb-2">📩 Proper Formats</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Use proper universally accepted email formats. Sendly actively rejects emails that don't match standard structural validation.</p>
              </div>
              <div className="p-5 border border-border rounded-xl bg-card shadow-sm">
                <h4 className="font-semibold mb-2">🌐 Domain Locking</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">While client-side API calls are possible, highly restrict and lock your API key to only your approved domains in the Sendly dashboard.</p>
              </div>
            </div>
          </section>

          {/* 10. Error Handling */}
          <section id="error-handling">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              10. Error Handling
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Sendly uses conventional HTTP response codes universally correctly to indicate the success or standard failure of an API request.
            </p>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-sm font-semibold px-2.5 py-1 rounded-md border border-red-500/20">401 Unauthorized</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Invalid API Key</h4>
                  <p className="text-sm text-muted-foreground tracking-tight">Ensure your exact API key is correctly formatted and actively not revoked.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                  <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-sm font-semibold px-2.5 py-1 rounded-md border border-orange-500/20">400 Bad Request</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Missing Fields</h4>
                  <p className="text-sm text-muted-foreground tracking-tight">The required email or full message variable payload is visibly entirely missing.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-sm font-semibold px-2.5 py-1 rounded-md border border-amber-500/20">422 Unprocessable Element</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Invalid Email Address</h4>
                  <p className="text-sm text-muted-foreground tracking-tight">The string provided heavily lacks a correct proper generic domain logic configuration.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 11. FAQ Section */}
          <section id="faq">
            <h2 className="text-2xl font-semibold mb-6 text-foreground border-b border-border pb-3">
              11. FAQ Section
            </h2>
            <div className="space-y-6">
              <div className="pl-4 border-l-[3px] border-primary/30">
                <h4 className="font-semibold text-lg mb-2 text-foreground">Can I securely use this purely without any backend?</h4>
                <p className="text-muted-foreground leading-relaxed">Absolutely! Sendly is exclusively designed logically exactly for frontend developers who want simple setup skipping tedious server-side API setups altogether. You can easily embed our key logically into your client-side form safely using domain-protection limits.</p>
              </div>
              <div className="pl-4 border-l-[3px] border-primary/30">
                <h4 className="font-semibold text-lg mb-2 text-foreground">Is it forever free?</h4>
                <p className="text-muted-foreground leading-relaxed">We inherently offer a genuinely generous free tier highly perfect automatically for personal tiny portfolios and independent small developer websites. You can actively upgrade gracefully as your requests successfully scale upward!</p>
              </div>
              <div className="pl-4 border-l-[3px] border-primary/30">
                <h4 className="font-semibold text-lg mb-2 text-foreground">How many solid standard requests can I safely effectively send?</h4>
                <p className="text-muted-foreground leading-relaxed">The active universal completely free tier automatically allows natively naturally strictly up to beautifully 100 safe successful form logical submissions inherently universally correctly per month.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
