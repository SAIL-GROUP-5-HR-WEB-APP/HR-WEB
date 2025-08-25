import Howitworksimg from "../../../assets/HomePageHowItWorks.png";
import { Link } from "react-router-dom";
import {
  LuNetwork,
  LuTrendingUp,
  LuCalendarCheck,
  LuFolderClosed,
} from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";

const HowOne = () => {
  return (
    <div className="bg-gray-50 mt-16">
      <div className="max-w-[1280px] mx-auto flex  gap-14 p-15 max-[822px]:flex-col max-[822px]:text-center max-[822px]:justify-center">
        <main>
          <img
            src={Howitworksimg}
            alt="HR"
            className="w-xl rounded-xl border-2 border-gray-300 shadow-2xl  max-[822px]:mx-auto"
          />
        </main>
        <main>
          <div className="flex items-center max-[822px]:justify-center">
            <p>How it works</p>
            <div className="h-px w-20 bg-gray-300"></div>
          </div>
          <h1 className="text-5xl font-bold mt-5">
            Efficiency Boost: <br />
            Transform Your HR Operations.
          </h1>
          <div className="flex gap-4 mt-5  max-[822px]:justify-center">
            <div className="bg-white p-2 rounded-xl border-2 border-gray-400">
              {" "}
              <LuNetwork size={20} />
            </div>
            <div className="bg-white p-2 rounded-xl border-2 border-gray-400">
              <LuTrendingUp size={20} />
            </div>
            <div className="bg-white p-2 rounded-xl border-2 border-gray-400">
              <LuCalendarCheck size={20} />
            </div>
            <div className="bg-white p-2 rounded-xl border-2 border-gray-400">
              <LuFolderClosed size={20} />
            </div>
          </div>
          <p className="max-w-[450px] mt-6 leading-8 max-[880px]:mx-auto">
            Our HR platform is designed to bring substantial boost to the
            efficiency of your HR processes, freeing up valuable time for other
            strategic activities.
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
      </div>
    </div>
  );
};

export default HowOne;
