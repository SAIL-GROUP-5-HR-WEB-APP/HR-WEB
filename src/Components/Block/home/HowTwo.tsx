import mockup from "../../../assets/chatMockup.png";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const HowTwo = () => {
  return (
    <div className="max-w-[1280px] mx-auto flex gap-7 p-15 max-[822px]:flex-col max-[822px]:text-center max-[822px]:justify-center">
      <main>
        <div className="flex items-center  max-[822px]:justify-center">
          <div className="h-px w-20 bg-gray-300"></div>
          <p>How it works</p>
        </div>
        <h1 className="text-5xl font-bold mt-5">Mobile Accesibility</h1>
        <p className="max-w-[450px] mt-6 leading-8  max-[822px]:mx-auto">
          Enable your HR team stay productive on the go. our HR mobile
          accesibility ensures that key HR functions are accesible anytime,
          anywhere{" "}
        </p>
        <div className="flex mt-7 max-[880px]:justify-center  ">
          <Link to="/signup">
            <button className="group inline-flex items-center gap-2 px-6 py-3 bg-indigo-700 text-white  font-medium transition-all duration-500 hover:bg-indigo-800 overflow-hidden rounded-full hover:tracking-widest ease-in-out">
              <span>Get Started</span>
              <FaArrowRight className="w-5 h-5 transform group-hover:translate-x-5 group-hover:opacity-0 transition-all duration-300 ease-in-out" />
            </button>
          </Link>
        </div>
      </main>
      <main>
        <img
          src={mockup}
          alt="phone mockup"
          className="w-xl rounded-xl border-2 border-gray-300 shadow-2xl  max-[822px]:mx-auto"
        />
      </main>
    </div>
  );
};

export default HowTwo;
