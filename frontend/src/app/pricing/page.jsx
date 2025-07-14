"use client";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$19",
      period: "per month",
      description: "Perfect for individuals and small teams getting started",
      features: [
        "Up to 5 voice assistants",
        "1,000 minutes of voice calls",
        "Basic analytics",
        "Email support",
        "Standard voice models",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "$49",
      period: "per month",
      description: "Ideal for growing businesses with higher volume needs",
      features: [
        "Up to 25 voice assistants",
        "5,000 minutes of voice calls",
        "Advanced analytics & reporting",
        "Priority support",
        "Premium voice models",
        "Custom integrations",
        "Phone number management",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$149",
      period: "per month",
      description: "For large organizations with complex requirements",
      features: [
        "Unlimited voice assistants",
        "20,000 minutes of voice calls",
        "Custom analytics dashboard",
        "Dedicated account manager",
        "Custom voice models",
        "API access",
        "Advanced security features",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "How do voice minutes work?",
      answer:
        "Voice minutes are calculated based on the total duration of calls handled by your assistants. Each plan includes a specific number of minutes per month, and you can purchase additional minutes if needed.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the start of your next billing cycle.",
    },
    {
      question: "What happens if I exceed my voice minutes?",
      answer:
        "If you exceed your monthly voice minutes, you'll be charged at our standard overage rate of $0.05 per minute. We'll notify you before you reach your limit.",
    },
    {
      question: "Do you offer custom pricing for large enterprises?",
      answer:
        "Yes, we offer custom pricing and features for large enterprises. Contact our sales team to discuss your specific requirements.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your voice AI needs. All plans include
            our core features.
          </p>
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className="text-gray-600">Monthly</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
            </div>
            <span className="text-gray-600">
              Annual
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-lg shadow-lg p-8 relative ${
                  plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h2>
            <p className="text-xl text-gray-600">
              Core features available across all pricing tiers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Voice Assistants
              </h3>
              <p className="text-gray-600">
                Create and manage AI-powered voice assistants
              </p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Call Handling
              </h3>
              <p className="text-gray-600">
                Automatic call routing and handling
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics
              </h3>
              <p className="text-gray-600">
                Detailed insights and performance metrics
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Customization
              </h3>
              <p className="text-gray-600">
                Custom prompts and voice configurations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of businesses already using our voice AI platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
