import React from "react";
import microsoft from "../../../assets/microsoft (1).png";
import mac from "../../../assets/mcdonalds.png";
import tesla from "../../../assets/tesla.png";
import nestle from "../../../assets/nestle.png";
import uber from "../../../assets/uber.png";
import fedex from "../../../assets/fedex.png";

const Companies = () => {
  return (
    <div className="max-w-[1280px] mx-auto mt-20 px-10">
      <div>
        <h1 className="text-center font-semibold text-2xl ">
          Trusted By The World's Best Companies
        </h1>
      </div>
      <div className="flex mt-10 justify-between items-center  max-[600px]:grid max-[600px]:grid-cols-2">
        <div className="flex flex-col items-center transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={microsoft} alt="microsoft" className="w-[100px]" />
          <p className="mt-2">Microsoft</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={mac} alt="mac" className="w-[100px]" />
          <p className="mt-2">Mcdonalds</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={tesla} alt="tesla" className="w-[100px]" />
          <p className="mt-2">Tesla</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={nestle} alt="nestle" className="w-[100px]" />
          <p className="mt-2">nestle</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={uber} alt="uber" className="w-[100px]" />
          <p className="mt-2">Uber</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={fedex} alt="fedex" className="w-[100px]" />
          <p className="mt-2">Fedex</p>
        </div>
      </div>
    </div>
  );
};

export default Companies;
