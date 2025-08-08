import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

const ContactUs = () => {
  const [form, setForm] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      await axios.post('/api/contact/send', form);
      setStatus('Message sent successfully!');
      setForm({ email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('Failed to send message. Try again.');
    }
  };

  return (
    <section className="bg-red-900 text-white px-4 sm:px-7 md:px-17 py-10 rounded-xl max-w-5xl mx-auto mt-16" id='contact'>
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Contact us</h2>
      <p className="text-sm text-gray-200 mb-8 leading-relaxed">
        Let us know how we can help! Fill in your details below and our team will get back to you.
      </p>

      {status && (
        <p className={`mb-4 text-sm font-medium ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-transparent border border-gray-400 text-white placeholder-gray-300 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-transparent border border-gray-400 text-white placeholder-gray-300 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
          required
        />
        <textarea
          placeholder="Your Message"
          rows="4"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-transparent border border-gray-400 text-white placeholder-gray-300 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 text-sm resize-none"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-red-400 hover:bg-red-500 text-black font-semibold px-6 py-2 rounded-full transition text-sm sm:text-base"
        >
          Send
        </button>
      </form>
    </section>
  );
};

export default ContactUs;
