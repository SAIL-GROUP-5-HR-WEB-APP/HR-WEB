import { motion, type Variants } from "framer-motion";
import heroImg from "../../../assets/dashboard.png";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

// Typed variants
const headingContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const lineVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const float: Variants = {
  animate: {
    y: [0, -8, 0], // subtle bob
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const Hero = () => {
  return (
    <div className="">
      <div className="bg-gradient-to-b from-indigo-300 via-gray-50 to-white ">
        <div className="max-w-[1280px] mx-auto px-10 pt-30 flex flex-col items-center text-center relative ">
          {/* Text Content */}
          <motion.div
            variants={headingContainer}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            <motion.h1
              variants={lineVariant}
              className="text-7xl font-bold leading-tight max-[550px]:text-6xl max-[450px]:text-5xl px-4"
            >
              Revolutionizing
            </motion.h1>
            <motion.h1
              variants={lineVariant}
              className="text-7xl font-bold leading-tight max-[550px]:text-6xl max-[450px]:text-5xl px-4"
            >
              <span className="text-primary">Workforce</span>
            </motion.h1>
            <motion.h1
              variants={lineVariant}
              className="text-7xl font-bold leading-tight max-[550px]:text-6xl max-[450px]:text-5xl px-4"
            >
              Management
            </motion.h1>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-xl max-w-[600px] font-medium leading-relaxed"
          >
            Empower Your HR Operations with Seamless Efficiency and Insightful
            Analytics.
          </motion.p>
          <div className="flex mt-7 gap-4 justify-center">
            <Link to="/login">
              <button className="group inline-flex items-center gap-2 px-6 py-3 bg-indigo-700 text-white rounded-lg font-medium transition-all duration-500 hover:bg-indigo-800 overflow-hidden hover:rounded-full hover:tracking-widest ease-in-out">
                <span>Sign In</span>
                <FaArrowRight className="w-5 h-5 transform group-hover:translate-x-5 group-hover:opacity-0 transition-all duration-300 ease-in-out" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Image */}
      <div className="mt-16 w-full max-w-[1000px] mx-auto px-7">
        <motion.div className="relative" variants={float} animate="animate">
          <motion.img
            src={heroImg}
            alt="HR Management Dashboard"
            className="w-full h-auto object-contain rounded-xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
