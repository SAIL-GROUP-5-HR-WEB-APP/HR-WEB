import aboutimg from "../assets/aboutImg.png";

const About = () => {
  return (
    // <div className="pt-30">
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className=" pt-[120px] pb-16   ">
        <div className="max-w-[1280px] mx-auto flex justify-between px-16 items-center max-[840px]:flex-col ">
          <div>
            <h1 className="text-6xl font-bold mb-4 leading-16 max-[840px]:text-center">
              Transforming <br />{" "}
              <span className="text-purple-900">Workplace</span> Management
            </h1>
            <p className="max-w-lg mt-10 text-lg leading-8 max-[840px]:text-center  max-[840px]:mx-auto">
              We make office interactions, leave management, payments, and HR
              processes seamless saving time, cutting costs, and boosting
              productivity,with the aim of making the work environment more
              comfortable and enjoyable
            </p>
          </div>
          <div>
            <img src={aboutimg} alt="" />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="h-0.5 w-50  bg-gradient-to-r from-black to-transparent max-[500px]:w-16"></div>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center mt-3 max-">
            Our Story
          </h2>
          <div className="h-0.5 w-50 bg-gradient-to-l from-black to-transparent  max-[500px]:w-16"></div>
        </div>
        <p className="text-lg leading-relaxed text-center mt-4">
          Founded with the motive that HR processes should not be stressful or
          scattered, we set out to build a solution that merges efficiency with
          simplicity. Our platform addresses the real challenges offices face
          from managing leave requests to streamlining pay all in one place with
          a user-friendly interface.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-purple-50 p-20">
        <h1 className="text-center text-5xl font-semibold">
          <span className="text-purple-900">Mission</span> &{" "}
          <span className="text-pink-700"> Vision</span>
        </h1>
        <div className="py-12 px-6 max-w-6xl mx-auto grid grid-cols-3 gap-8 mt-10 max-[550px]:px-0 max-[850px]:grid-cols-1">
          <div className="bg-white rounded-3xl p-10 shadow-2xs  hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h2 className="text-lg text-gray-700 text-center font-semibold mb-4">
              What Drives Us
            </h2>
            <p className="text-lg leading-relaxed text-center">
              To simplify and modernize HR operations for organizations of all
              sizes reducing the use of paper works, empowering teams to focus
              on what truly matters, people and productivity.
            </p>
          </div>
          <div className="bg-purple-200  rounded-3xl p-10  shadow-2xs  hover:shadow-2xl transition-all duration-300 ease-in-out">
            <p className="text-xl leading-relaxed text-center  mt-8">
              It isn’t just another tool. We’re your strategic partner for HR
              transformation; a silent engine powering the next generation of
              businesses.
            </p>
          </div>
          <div className="bg-white  rounded-3xl p-10 shadow-2xs  hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h2 className="text-lg text-gray-700 font-semibold text-center mb-4">
              The Impact We Aim to Have
            </h2>
            <p className="text-lg leading-relaxed text-center">
              To become the go-to HR solution globally, redefining workplace
              management with innovation, scalability, and unmatched user
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 px-6 bg-stone-100 shadow-sm max-w-5xl mx-auto rounded-lg mt-16 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Our Core Values
        </h2>
        <ul className=" pl-6 space-y-2 text-lg">
          <li>
            Innovation — Continuously improving to meet evolving workplace needs
          </li>
          <li>Transparency — Clear and open processes</li>
          <li>Efficiency — Saving time and resources for our clients</li>
          <li>Reliability — Consistent, secure, and dependable service</li>
          <li>
            {" "}
            Inclusivity - Building a platform that caters to diverse workplace
            needs at your finger tips
          </li>
        </ul>
      </section>
      {/* what we offer */}
      <section className="py-12 px-6 max-w-5xl mx-auto mt-9">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-purple-50 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 text-center">
              Leave Management
            </h3>
            <p className="mt-2 text-center">
              Apply, approve, and track employee leave with ease.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 text-center">
              Payroll & Payments
            </h3>
            <p className="mt-2 text-center">
              Streamlined salary processing and secure payment tracking.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 text-center">
              Internal Communication
            </h3>
            <p className="mt-2 text-center">
              Foster better collaboration with integrated communication tools.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 text-center">
              Performance Tracking
            </h3>
            <p className="mt-2 text-center">
              Monitor employee growth and productivity in real time.
            </p>
          </div>
        </div>
      </section>
    </div>

    // </div>
  );
};

export default About;
