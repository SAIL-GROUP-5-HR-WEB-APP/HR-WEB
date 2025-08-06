import React from "react";
import mockup from "../../../assets/chatMockup.png";
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
