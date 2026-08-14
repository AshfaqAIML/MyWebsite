"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, Check, Loader2, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/lib/data";

export function Contact() {
  const profile = getProfile();
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Failed to send. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    { icon: <Mail className="h-4 w-4" />, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: <MapPin className="h-4 w-4" />, label: "Location", value: profile.location || "Remote / Available" },
  ];

  return (
    <Section
      id="contact"
      title={
        <span>
          Get In <span className="gradient-text">Touch</span>
        </span>
      }
      subtitle="Have a question, collaboration idea, or just want to connect? I'd love to hear from you."
      className="bg-zinc-50/50 dark:bg-zinc-900/50"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="name" type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Email
                    </label>
                    <input
                      id="email" type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    id="message" required rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell me what's on your mind..."
                  />
                </div>
                <Button type="submit" variant="default" size="lg" className="w-full" disabled={sending}>
                  {sending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                  ) : submitted ? (
                    <><Check className="mr-2 h-4 w-4" /> Message Sent!</>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" /> Send Message</>
                  )}
                </Button>
                {error && (
                  <p role="alert" className="text-sm text-red-600 dark:text-red-400 mt-3">
                    {error}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          {contactItems.map((item) => (
            <Card key={item.label}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <span className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{item.icon}</span>
                  <div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-medium">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.value}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <span className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><MessageCircle className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-medium">Let&apos;s Connect</p>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Find me on socials above</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}