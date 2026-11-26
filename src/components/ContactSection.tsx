import { useState, type FormEvent } from 'react';
import { CheckCircle2, Globe, Mail, Send } from 'lucide-react';

interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Question');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('General Question');
    setMessage('');
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-[#ece7f8] bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#6d28d9]">Contact Us</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#161124] sm:text-3xl [text-wrap:balance]">
              Questions, feedback, or deployment help
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#524969]">
              Reach out if you need help integrating Pic Background Remover AI into your workflow or publishing your own static instance.
            </p>

            <div className="mt-8 space-y-5 border-t border-[#ece7f8] pt-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3eeff] text-[#6d28d9]">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-[#161124]">
                    Ready for Free Static Hosting
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#524969]">
                    No API key or paid backend server is needed. Run{' '}
                    <code className="rounded bg-[#f5f2fc] px-1.5 py-0.5 font-mono text-xs text-[#5b21b6]">
                      npm run build
                    </code>{' '}
                    and deploy the output directly to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3eeff] text-[#6d28d9]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-[#161124]">
                    Support &amp; Partnerships
                  </h3>
                  <p className="mt-1 text-sm text-[#524969]">
                    Send us a note anytime using the form and we will follow up promptly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#e5def6] bg-[#fcfbfe] p-6 sm:p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-[#161124]">
                    Message received
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-[#524969]">
                    Thank you for contacting Pic Background Remover AI. Your note has been recorded and our team will reply to your email soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-[#ddd5f3] bg-white px-5 py-2.5 text-sm font-semibold text-[#161124] transition-colors hover:bg-[#f6f4ff]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-semibold text-[#161124]"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        placeholder="Alex Rivera"
                        className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#ddd5f3] bg-white px-3.5 py-2.5 text-sm text-[#161124] placeholder:text-[#968cad] focus:border-[#7c3aed] focus:outline-none"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-semibold text-[#161124]"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="alex@example.com"
                        className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#ddd5f3] bg-white px-3.5 py-2.5 text-sm text-[#161124] placeholder:text-[#968cad] focus:border-[#7c3aed] focus:outline-none"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-semibold text-[#161124]"
                    >
                      Topic
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#ddd5f3] bg-white px-3.5 py-2.5 text-sm text-[#161124] focus:border-[#7c3aed] focus:outline-none"
                    >
                      <option value="General Question">General Question</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Hosting & Deployment">Hosting &amp; Deployment</option>
                      <option value="Bug Report">Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-semibold text-[#161124]"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                      placeholder="How can we help?"
                      className="mt-1.5 w-full rounded-xl border border-[#ddd5f3] bg-white px-3.5 py-2.5 text-sm text-[#161124] placeholder:text-[#968cad] focus:border-[#7c3aed] focus:outline-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition-all duration-150 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
