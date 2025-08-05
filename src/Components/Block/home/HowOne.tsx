import React from "react";
import Howitworksimg from "../../../assets/HomePageHowItWorks.png";
import {
  LuNetwork,
  LuTrendingUp,
  LuCalendarCheck,
  LuFolderClosed,
} from "react-icons/lu";

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
        </main>
      </div>
    </div>
  );
};

export default HowOne;
