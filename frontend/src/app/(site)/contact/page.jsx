"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Thank you for contacting JobCareer! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <main className="jh-contact-page">
      <div className="jh-contact-card">
        <h1>Contact Us</h1>
        <p className="jh-contact-sub">
          Have any questions or suggestions? We&rsquo;d love to hear from you!
          You can reach us anytime using the form below or via our contact
          details.
        </p>

        <form className="jh-contact-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Write your message here..."
            />
          </div>
          <button type="submit">Send Message</button>
        </form>

        <div className="jh-contact-info">
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@jobcareer.in">support@jobcareer.in</a>
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            <a href="tel:+919876543210">98765 43210</a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href="https://jobcareer.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              jobcareer.in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}