"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 fade-in">
      {/* Hero Section */}
      <div className="py-20 px-8 slide-in-up">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Have questions about our voice AI platform? We're here to help.
          </p>
        </div>
      </div>

      {/* Contact Form and Info */}
      <div className="px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8 slide-in-left hover:shadow-xl transition-all duration-300 hover:scale-105">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className="slide-in-up"
                    style={{ animationDelay: "100ms" }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div
                    className="slide-in-up"
                    style={{ animationDelay: "150ms" }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div
                  className="slide-in-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Your company"
                  />
                </div>

                <div
                  className="slide-in-up"
                  style={{ animationDelay: "250ms" }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="What's this about?"
                  />
                </div>

                <div
                  className="slide-in-up"
                  style={{ animationDelay: "300ms" }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    placeholder="Tell us more about your needs..."
                  />
                </div>

                <div
                  className="slide-in-up"
                  style={{ animationDelay: "350ms" }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 slide-in-right">
              <div
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                style={{ animationDelay: "100ms" }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Email
                      </h3>
                      <p className="text-gray-600">support@voiceaiagents.com</p>
                      <p className="text-gray-600">sales@voiceaiagents.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-100 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-pink-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Phone
                      </h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Office
                      </h3>
                      <p className="text-gray-600">123 AI Street</p>
                      <p className="text-gray-600">San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                style={{ animationDelay: "200ms" }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Office Hours
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-900">Closed</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <strong>Emergency Support:</strong> Available 24/7 for
                    Enterprise customers
                  </p>
                </div>
              </div>

              <div
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                style={{ animationDelay: "300ms" }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Follow Us
                </h2>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-blue-800 text-white p-3 rounded-lg hover:bg-blue-900 transition-all duration-200 hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-900 transition-all duration-200 hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div
        className="py-20 px-8 bg-white slide-in-up"
        style={{ animationDelay: "400ms" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to questions you might have
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              style={{ animationDelay: "500ms" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How quickly do you respond?
              </h3>
              <p className="text-gray-600">
                We typically respond to inquiries within 24 hours during
                business days. Enterprise customers get priority support.
              </p>
            </div>

            <div
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              style={{ animationDelay: "550ms" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer demos?
              </h3>
              <p className="text-gray-600">
                Yes! We'd be happy to show you our platform. Schedule a demo
                through our contact form or call us directly.
              </p>
            </div>

            <div
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              style={{ animationDelay: "600ms" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What about technical support?
              </h3>
              <p className="text-gray-600">
                Our technical support team is available during business hours.
                Enterprise customers get 24/7 support access.
              </p>
            </div>

            <div
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              style={{ animationDelay: "650ms" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I integrate with my existing systems?
              </h3>
              <p className="text-gray-600">
                Absolutely! We offer APIs and custom integrations. Contact us to
                discuss your specific integration needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
