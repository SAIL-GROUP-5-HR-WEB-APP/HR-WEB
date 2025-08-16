import React from "react";
import opay from "../../../assets/opay.png";
import flutter from "../../../assets/flutterwave.png";
import moniepoint from "../../../assets/moniepoint.jpg";
import interswitch from "../../../assets/interswitch.png";
import uber from "../../../assets/uber.png";
import jumia from "../../../assets/jumia.png";

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
          <img src={opay} alt="opay" className="w-[100px]" />
          <p className="mt-2">Opay</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={flutter} alt="flutterwave" className="w-[100px]" />
          <p className="mt-2">Flutterwave</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3 ">
          <img
            src={moniepoint}
            alt="moniepoint"
            className="w-[100px] rounded-3xl"
          />
          <p className="mt-2">Moniepoint</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={interswitch} alt="interswitch" className="w-[100px]" />
          <p className="mt-2">Interswitch</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={uber} alt="uber" className="w-[100px]" />
          <p className="mt-2">Uber</p>
        </div>
        <div className="flex flex-col items-center  transition-transform duration-300 hover:rotate-6 hover:scale-110 max-[600px]:mt-3">
          <img src={jumia} alt="jumia" className="w-[100px]" />
          <p className="mt-2">Jumia</p>
        </div>
      </div>
    </div>
  );
};

export default Companies;
