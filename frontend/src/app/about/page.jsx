"use client";
import Link from "next/link";

export default function AboutPage() {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/team/sarah.jpg",
      bio: "Former AI researcher with 10+ years experience in voice technology and machine learning.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/team/michael.jpg",
      bio: "Lead engineer with expertise in scalable AI systems and natural language processing.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      image: "/team/emily.jpg",
      bio: "Product strategist focused on creating intuitive AI experiences for businesses.",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We push the boundaries of what's possible with voice AI technology.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Accessibility",
      description:
        "Making advanced AI technology accessible to businesses of all sizes.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      title: "Reliability",
      description:
        "Building robust, scalable solutions that businesses can depend on.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Privacy",
      description:
        "Protecting user data and maintaining the highest security standards.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About Voice AI Agents
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're on a mission to democratize voice AI technology and help
            businesses create meaningful connections with their customers
            through intelligent voice assistants.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2024, Voice AI Agents was born from the vision of
                  making sophisticated voice AI technology accessible to
                  businesses of all sizes. Our founders, with decades of
                  combined experience in AI and voice technology, recognized the
                  gap between complex enterprise solutions and the needs of
                  growing businesses.
                </p>
                <p>
                  We started with a simple belief: every business should have
                  access to intelligent voice assistants that can enhance
                  customer experiences and streamline operations. Today, we're
                  proud to serve thousands of businesses worldwide, from
                  startups to Fortune 500 companies.
                </p>
                <p>
                  Our platform combines cutting-edge AI technology with an
                  intuitive interface, making it easy for anyone to create,
                  deploy, and manage voice assistants without requiring deep
                  technical expertise.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    10,000+
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    50+
                  </div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    99.9%
                  </div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mb-6">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To empower businesses with intelligent voice AI solutions that
                enhance customer experiences, increase efficiency, and drive
                growth. We believe that voice technology should be accessible,
                powerful, and easy to use for everyone.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-pink-100 rounded-full p-4 w-16 h-16 mb-6">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600">
                To create a world where every business can leverage the power of
                voice AI to build deeper connections with their customers. We
                envision a future where intelligent voice assistants are as
                common and essential as websites and mobile apps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 text-purple-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate individuals behind Voice AI Agents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 text-center"
              >
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-purple-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Technology
            </h2>
            <p className="text-xl text-gray-600">
              Built on cutting-edge AI and voice recognition technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mb-4">
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
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Advanced NLP
              </h3>
              <p className="text-gray-600">
                State-of-the-art natural language processing powered by the
                latest AI models.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="bg-pink-100 rounded-full p-3 w-12 h-12 mb-4">
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
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Voice Recognition
              </h3>
              <p className="text-gray-600">
                High-accuracy speech recognition that works across different
                accents and languages.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-time Processing
              </h3>
              <p className="text-gray-600">
                Ultra-low latency processing for natural, real-time
                conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of businesses already using our voice AI platform to
            enhance customer experiences and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
