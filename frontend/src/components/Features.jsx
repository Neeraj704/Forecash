import React from "react";
import { motion as Motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Receipt, Brain, Smartphone, Calendar, Bot } from "lucide-react";

import { TbTargetArrow } from "react-icons/tb";

export default function FeatureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Receipt,
      title: "Expense Tracking",
      description:
        "Automatically log and categorize your expenses for clear insights into your spending habits.",
      gradient: "from-blue-600 to-blue-400",
    },
    {
      icon: Brain,
      title: "Smart Budgeting",
      description:
        "AI-powered forecasts and budgeting tips tailored to your lifestyle and goals.",
      gradient: "from-green-600 to-green-400",
    },
    {
      icon: TbTargetArrow,
      title: "Set Financial Goals",
      description:
        "Plan for a trip, emergency fund, or your next big move — we’ll help you reach it faster.",
      gradient: "from-purple-600 to-purple-400",
    },
    {
      icon: Calendar,
      title: "Monthly Reports",
      description:
        "Get easy-to-read reports showing income, expenses, and savings — no spreadsheets needed.",
      gradient: "from-orange-600 to-orange-400",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description:
        "Use ForeCash anytime, anywhere — it’s optimized for all devices.",
      gradient: "from-red-600 to-red-400",
    },
    {
      icon: Bot,
      title: "Integrated Chatbot Assistant",
      description:
        "Have questions? Just ask. Our intelligent chatbot is available 24/7 to guide you, explain insights, or answer any financial queries you have - instantly.",
      gradient: "from-blue-600 to-purple-600",
    },
  ];
  return (
    <section id="features" className="md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Everything You Need to Master Your Money
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to take control of your finances and build a
            secure financial future.
          </p>
        </Motion.div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title + index}
              className="group relative bg-white backdrop-blur-3xl rounded-2xl p-8 hover:shadow-2xl shadow-white/40 hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              />

              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section
        <Motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Finances?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already taken control of their
            financial future with Forecash.
          </p>
          <Motion.button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Free Trial
          </Motion.button>
        </Motion.div> */}
      </div>
    </section>
  );
}
