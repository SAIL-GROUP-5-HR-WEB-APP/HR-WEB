import { motion } from "framer-motion";

import heroImg from "../../../assets/dashboard.png";

const headingContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const lineVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const float = {
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
      <div className="bg-gradient-to-b from-indigo-100 via-gray-50 to-white">
        <div className="max-w-[1280px] mx-auto px-10 pt-20 flex flex-col items-center text-center relative">
          {/* Text Content */}
          <motion.div
            variants={headingContainer}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            <motion.h1
              Variants={lineVariant}
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

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center mt-6 gap-2"
          >
            <p className="text-indigo-400 text-xs">
              Try Now – 14 Days Free Trial
            </p>
          </motion.div>
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
