import React from "react";
// This is a placeholder for a contact image. In a real app, you would
// import this from your assets folder, similar to aboutImg.
const contactImg = "https://placehold.co/500x300/e9d5ff/6b46c1?text=Contact+Us";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="pt-[120px] pb-16">
        <div className="max-w-[1280px] mx-auto flex justify-between px-16 items-center max-[840px]:flex-col">
          <div>
            {/* Title follows the same structure as the About page */}
            <h1 className="text-6xl font-bold mb-4 leading-16 max-[840px]:text-center">
              Let's <br />{" "}
              <span className="text-purple-900">Connect</span>
            </h1>
            {/* Subtitle with matching styling */}
            <p className="max-w-lg mt-10 text-lg leading-8 max-[840px]:text-center max-[840px]:mx-auto">
              We're here to help! Whether you have questions about our platform,
              need support, or just want to say hello, feel free to reach out to us.
            </p>
          </div>
          {/* Contact image placeholder */}
          <div>
            <img src={contactImg} alt="Contact Us" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </section>

      {/* Contact Form Section with decorative dividers */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="h-0.5 w-50 bg-gradient-to-r from-black to-transparent max-[500px]:w-16"></div>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center mt-3">
            Send a Message
          </h2>
          <div className="h-0.5 w-50 bg-gradient-to-l from-black to-transparent max-[500px]:w-16"></div>
        </div>
        {/* Contact form container */}
        <form className="max-w-2xl mx-auto mt-8 bg-purple-50 p-8 rounded-3xl shadow-lg">
          {/* Name input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="e.g., Jane Doe"
            />
          </div>
          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="e.g., janedoe@example.com"
            />
          </div>
          {/* Message textarea */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-3 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          {/* Submit button with button styling similar to the About page's Call to Action */}
          <button
            type="submit"
            className="w-full bg-purple-900 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-purple-800 transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </section>

      {/* Contact Details Section using the card grid pattern */}
      <section className="py-12 px-6 bg-stone-100 shadow-sm max-w-5xl mx-auto rounded-lg mt-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-8 text-center">
          Our Contact Details
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {/* Card 1: Email */}
          <div className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center text-center">
            {/* SVG for email icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b46c1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <path d="M22 6L12 13 2 6"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-700">Email Us</h3>
            <p className="mt-2 text-purple-900 font-medium">support@hrcore.com</p>
          </div>
          {/* Card 2: Phone */}
          <div className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center text-center">
            {/* SVG for phone icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b46c1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2h-11.62a2.91 2.91 0 0 1-2.91-2.92v-11.62a2 2 0 0 1 2-2.18h3"></path>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <path d="M12 2v6h6v-6z"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-700">Call Us</h3>
            <p className="mt-2 text-purple-900 font-medium">+1 (123) 456-7890</p>
          </div>
          {/* Card 3: Address */}
          <div className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col items-center text-center">
            {/* SVG for map pin icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b46c1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <h3 className="text-xl font-bold text-gray-700">Visit Us</h3>
            <p className="mt-2 text-purple-900 font-medium">123, Some Students from SAIL Innovation Lab, Lagos</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;