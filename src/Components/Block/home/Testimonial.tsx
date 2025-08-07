import React from "react";
import microsoft from "../../../assets/microsoft (1).png";
import mac from "../../../assets/mcdonalds.png";
import tesla from "../../../assets/tesla.png";
import nestle from "../../../assets/nestle.png";
import uber from "../../../assets/uber.png";
import fedex from "../../../assets/fedex.png";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Microsoft",
    role: "HR Director",
    text: "This software helped change our HR management.",
    image: microsoft,
    rating: 5,
  },
  {
    name: "Macdonalds",
    role: "Regional Manager",
    text: "HRCORE has transformed our HR process and saved us a lot of time.",
    image: mac,
    rating: 4,
  },
  {
    name: "Tesla",
    role: "Operations Head",
    text: "HRcore made it easy for us to focus on our goals, not just HR tasks.",
    image: tesla,
    rating: 5,
  },
  {
    name: "Nestle",
    role: "People Lead",
    text: "We saw instant results after switching. Totally worth it.",
    image: nestle,
    rating: 5,
  },
  {
    name: "Uber",
    role: "HR Specialist",
    text: "Very user-friendly and easy to navigate. Saved us a lot of time.",
    image: uber,
    rating: 4,
  },
  {
    name: "Fedex",
    role: "HRBP",
    text: "We saw instant results after switching. Totally worth it.",
    image: fedex,
    rating: 5,
  },
];

const Testimonial = () => {
  return (
    <div className="relative overflow-hidden w-full  py-10 max-w-[1400px] mx-auto group">
      <h1 className="text-5xl text-center font-bold mb-8 ">
        Our Testimonials{" "}
      </h1>
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div
        className="flex whitespace-nowrap hover:[animation-play-state:paused]"
        style={{
          animation: "scroll 40s linear infinite",
        }}
      >
        {[...testimonials, ...testimonials].map((data, i) => (
          <div
            key={i}
            className="w-[600px] max-[800px]:w-[450px] mx-6 p-6 bg-indigo-50 rounded-xl shadow-lg border border-gray-200 shrink-0 flex flex-col items-center text-center animate-[fadeInUp_0.6s_ease-in-out]"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationFillMode: "both",
            }}
          >
            <img
              src={data.image}
              alt={data.name}
              className="w-16 h-16 object-contain mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{data.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{data.role}</p>

            <div className="flex justify-center mb-3 text-yellow-500">
              {Array.from({ length: 5 }, (_, idx) => (
                <FaStar
                  key={idx}
                  className={`transition-transform duration-300 ${
                    idx < data.rating ? "scale-100" : "scale-0 opacity-0"
                  }`}
                />
              ))}
            </div>

            <p className="text-base text-gray-600 italic leading-relaxed px-2 max-[800px]:w-[450px]">
              “{data.text}”
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
