import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

const Faq = () => {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-gray-50 min-h-screen py-12 mt-18">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FAQ Header */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="h-0.5 flex-grow bg-gradient-to-r from-black to-transparent"></div>
          <span className="text-lg font-semibold text-gray-800 tracking-wider uppercase">
            FAQs
          </span>
          <div className="h-0.5 flex-grow bg-gradient-to-l from-black to-transparent"></div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-lg text-gray-600 text-center max-w-2xl mx-auto leading-relaxed mb-12">
          Have questions about how the platform works? Explore our answers to
          understand our features, data security, and how we support your HR
          operations.
        </p>

        {/* FAQ Items */}
        <section className="space-y-4">
          <div
            onClick={() => setShow1(!show1)}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h4 className="flex items-center justify-between text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer">
              How secure is employee data on this platform?
              <span
                className={`p-2 rounded-full bg-gray-100 transition-transform duration-300 ${
                  show1 ? "rotate-180" : ""
                }`}
              >
                <MdOutlineKeyboardArrowDown size={24} />
              </span>
            </h4>
            <p
              className={`mt-4 text-gray-600 leading-relaxed transition-all duration-300 ${
                show1 ? "block" : "hidden"
              }`}
            >
              We use industry-standard encryption and secure cloud
              infrastructure to protect your employee records. Only authorized
              users have access based on role-based permissions.
            </p>
          </div>

          <div
            onClick={() => setShow2(!show2)}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h4 className="flex items-center justify-between text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer">
              Is this platform suitable for small and growing teams?
              <span
                className={`p-2 rounded-full bg-gray-100 transition-transform duration-300 ${
                  show2 ? "rotate-180" : ""
                }`}
              >
                <MdOutlineKeyboardArrowDown size={24} />
              </span>
            </h4>
            <p
              className={`mt-4 text-gray-600 leading-relaxed transition-all duration-300 ${
                show2 ? "block" : "hidden"
              }`}
            >
              Absolutely. Whether you're a team of 5 or 500, the platform scales
              with your needs and offers flexible features to support growth.
            </p>
          </div>

          <div
            onClick={() => setShow3(!show3)}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h4 className="flex items-center justify-between text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer">
              Does the system support remote team management?
              <span
                className={`p-2 rounded-full bg-gray-100 transition-transform duration-300 ${
                  show3 ? "rotate-180" : ""
                }`}
              >
                <MdOutlineKeyboardArrowDown size={24} />
              </span>
            </h4>
            <p
              className={`mt-4 text-gray-600 leading-relaxed transition-all duration-300 ${
                show3 ? "block" : "hidden"
              }`}
            >
              Yes, our system supports remote check-ins, time tracking, and
              digital approvals, making it perfect for hybrid and remote teams.
            </p>
          </div>

          <div
            onClick={() => setShow4(!show4)}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h4 className="flex items-center justify-between text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer">
              Can employees access their own records or payslips?
              <span
                className={`p-2 rounded-full bg-gray-100 transition-transform duration-300 ${
                  show4 ? "rotate-180" : ""
                }`}
              >
                <MdOutlineKeyboardArrowDown size={24} />
              </span>
            </h4>
            <p
              className={`mt-4 text-gray-600 leading-relaxed transition-all duration-300 ${
                show4 ? "block" : "hidden"
              }`}
            >
              Yes, employees have secure self-service access to view and
              download their payslips, update personal information, and check
              leave balances.
            </p>
          </div>

          <div
            onClick={() => setShow5(!show5)}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h4 className="flex items-center justify-between text-lg sm:text-xl font-semibold text-gray-800 cursor-pointer">
              What integrations are available?
              <span
                className={`p-2 rounded-full bg-gray-100 transition-transform duration-300 ${
                  show5 ? "rotate-180" : ""
                }`}
              >
                <MdOutlineKeyboardArrowDown size={24} />
              </span>
            </h4>
            <p
              className={`mt-4 text-gray-600 leading-relaxed transition-all duration-300 ${
                show5 ? "block" : "hidden"
              }`}
            >
              We currently support integrations with email, Slack, Google
              Calendar, and select biometric devices. More integrations are
              added regularly.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mt-12 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-6 sm:mb-0">
            <p className="text-sm text-blue-600 font-medium">
              Still have questions?
            </p>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900">
              Reach out to our team
            </h4>
          </div>
          <button className="bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition-colors duration-300">
            Talk to HR Expert
          </button>
        </section>
      </section>
    </div>
  );
};

export default Faq;
