import React from "react";
import { motion as Motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Users, Lightbulb } from "lucide-react";

export default function AboutUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Accurate tracking and forecasting with AI-powered insights",
    },
    {
      icon: Users,
      title: "Simplicity",
      description: "User-friendly interface designed for everyone",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Cutting-edge technology for smarter financial decisions",
    },
  ];

  return (
    <section id="about" className="py-10 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Why We Built This
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            We're on a mission to democratize financial planning and make
            intelligent money management accessible to everyone.
          </p>
        </Motion.div>

        <div className=" w-full grid lg:grid-cols-2  gap-12 items-center mb-16">
          <Motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="/img/aboutillus.jpg"
              alt="About Us Hero"
              className="w-full h-auto rounded-lg "
            />
          </Motion.div>

          <Motion.div
            className="space-y-8  h-full flex flex-col justify-center "
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {values.map((value, index) => (
              <Motion.div
                key={value.title}
                className="flex items-start space-x-4 "
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg shadow-md">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              </Motion.div>
            ))}
            <div className="bg-white backdrop-blur-2xl p-6 rounded-lg shadow-lg shadow-blue-100/20 border-l-4 border-blue-600">
              <p className="text-blue-900 font-medium">
                "Our vision is to make financial planning as simple as checking
                your email yet as powerful as having a personal financial
                advisor."
              </p>
              <p className="text-blue-500 font-bold mt-2">
                -The People Behind Forecash
              </p>
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
}
