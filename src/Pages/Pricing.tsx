import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
const Pricing = () => {
  return (
    <div>
      <main className="bg-indigo-50 pt-20">
        <section className="max-w-[1280px] mx-auto flex justify-between p-20 max-[880px]:flex-col max-[880px]:items-center max-[880px]:gap-8 ">
          <div className="w-[450px]">
            <h1 className="text-5xl font-semibold leading-14  max-[880px]:text-center">
              Ready to optimize your HR operations?
            </h1>
            <p className="text-sm mt-4 leading-6  max-[880px]:text-center">
              Choose the plan that suit your buisness needs and start your
              journey towards a more efficient and effective HR management. Have
              questions? Contact our team for personalized assistance.{" "}
            </p>
          </div>
          <div className="w-[450px]">
            <h1 className="text-5xl font-semibold leading-14 max-[880px]:text-center">
              For just $19.99/Month{" "}
            </h1>
            <p className="text-sm mt-4 leading-6 max-[880px]:text-center">
              start your free trial now
            </p>
            <div className="flex mt-4 max-[880px]:justify-center  ">
              <Link to="/signup">
                <button className="group inline-flex items-center gap-2 px-6 py-3 bg-indigo-700 text-white  font-medium transition-all duration-500 hover:bg-indigo-800 overflow-hidden rounded-full hover:tracking-widest ease-in-out">
                  <span>Get Started</span>
                  <FaArrowRight className="w-5 h-5 transform group-hover:translate-x-5 group-hover:opacity-0 transition-all duration-300 ease-in-out" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* card section */}

      <div className="max-w-4/5 m-auto xl:max-w-7xl xl:m-auto py-14">
        <main className="flex flex-col xl:grid xl:gap-15">
          <div className="flex flex-col text-center leading-normal xl:flex xl:flex-col xl:items-center">
            <div className="flex items-center justify-center my-8">
              <div className="h-px w-20 bg-gray-300"></div>
              <h2 className="mx-6 text-lg  text-black">Our pricing </h2>
              <div className="h-px w-20 bg-gray-300"></div>
            </div>
            <h2 className="text-3xl">Pricing plan</h2>
            <p>Check out our flexible pricing that best fits your plan</p>
          </div>

          <div className="xl:grid xl:grid-cols-3 xl:gap-10 ">
            <main className="grid grid-row-3 gap-5 xl:grid xl:grid-rows-3 drop-shadow-xl border-[1px] border-gray-200 rounded-2xl bg-gray-50 xl:w-100 xl:h-150 p-4">
              <section className="h-[7em] flex flex-col justify-between xl:row-span-1 xl:flex xl:flex-col xl:gap-4">
                <h4 className="text-indigo-400">Basic plan</h4>
                <h2 className="text-3xl font-bold">$19.99/month</h2>
                <p className="text-sm">Our 30 days offer</p>
                <div className="border-1 w-[100%] border-gray-200"></div>
              </section>

              <section className="w-full xl:grid xl:grid-row-2 xl:p-5 xl:text-[.95em]  xl:row-span-3">
                <p className="m-0">Essential features:</p>
                <ul className="flex flex-col gap-2 xl:grid xl:grid-row-3">
                  <li className="flex gap-5 items-center">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                  <li className="flex gap-5">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                  <li className="flex gap-5">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                </ul>
              </section>

              <section className="grid gap-5x">
                <p>Perfect for</p>
                <ul className="my-[.9em] flex gap-2 text-[.81em]">
                  <img
                    className="h-[1.5em] w-auto"
                    src="./check.png"
                    alt="mark"
                  />
                  <p>
                    Small teams and startups looking to streamline basic HR
                    processes.
                  </p>
                </ul>
                <div className="mt-7">
                  <Link to="/signup">
                    {" "}
                    <button className="group  inline-flex items-center gap-2 px-30 py-3 bg-indigo-700 text-white  font-medium transition-all duration-500 hover:bg-indigo-800 overflow-hidden rounded-full hover:tracking-wide ease-in-out">
                      <span>SUBSCRIBE</span>
                      <FaArrowRight className="w-5 h-5 transform group-hover:translate-x-5 group-hover:opacity-0 transition-all duration-300 ease-in-out" />
                    </button>
                  </Link>
                </div>
              </section>
            </main>

            <main className="grid grid-row-3 gap-5 xl:grid xl:grid-rows-3 drop-shadow-xl border-[1px] border-gray-200 rounded-2xl bg-gray-50 xl:w-100 xl:h-150 p-4">
              <section className="h-[7em] flex flex-col justify-between xl:row-span-1 xl:flex xl:flex-col xl:gap-4">
                <h4 className="text-indigo-400">Pro plan</h4>
                <h2 className="text-3xl font-bold">$115.99/ 6month</h2>
                <p className="text-sm">Get it exclusive for half a year</p>
                <div className="border-1 w-[100%] border-gray-200"></div>
              </section>

              <section className="w-full xl:grid xl:grid-row-2 xl:p-5 xl:text-[.95em]  xl:row-span-3">
                <p className="m-0">Essential features:</p>
                <ul className="flex flex-col gap-2 xl:grid xl:grid-row-3">
                  <li className="flex gap-5 items-center">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                  <li className="flex gap-5">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                  <li className="flex gap-5">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                </ul>
              </section>

              <section className="grid gap-5x">
                <p>Perfect for</p>
                <ul className="my-[.9em] flex gap-2 text-[.81em]">
                  <img
                    className="h-[1.5em] w-auto"
                    src="./check.png"
                    alt="mark"
                  />
                  <p>
                    Small teams and startups looking to streamline basic HR
                    processes.
                  </p>
                </ul>
                <div className="mt-7">
                  <Link to="/signup">
                    {" "}
                    <button className="group  inline-flex items-center gap-2 px-30 py-3 bg-indigo-700 text-white  font-medium transition-all duration-500 hover:bg-indigo-800 overflow-hidden rounded-full hover:tracking-wide ease-in-out">
                      <span>SUBSCRIBE</span>
                      <FaArrowRight className="w-5 h-5 transform group-hover:translate-x-5 group-hover:opacity-0 transition-all duration-300 ease-in-out" />
                    </button>
                  </Link>
                </div>
              </section>
            </main>
            <main className="grid grid-row-3 gap-5 xl:grid xl:grid-rows-3 drop-shadow-xl border-[1px] border-gray-200 rounded-2xl bg-gray-50 xl:w-100 xl:h-150 p-4">
              <section className="h-[7em] flex flex-col justify-between xl:row-span-1 xl:flex xl:flex-col xl:gap-4">
                <h4 className="text-indigo-400">Enterprice Plan</h4>
                <h2 className="text-3xl font-bold">$229.99/Year</h2>
                <p className="text-sm">Get our yearly plan</p>
                <div className="border-1 w-[100%] border-gray-200"></div>
              </section>

              <section className="w-full xl:grid xl:grid-row-2 xl:p-5 xl:text-[.95em]  xl:row-span-3">
                <p className="m-0">Essential features:</p>
                <ul className="flex flex-col gap-2 xl:grid xl:grid-row-3">
                  <li className="flex gap-5 items-center">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                  <li className="flex gap-5">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                  <li className="flex gap-5">
                    <img
                      className="h-[1.5em] w-auto"
                      src="./check.png"
                      alt="mark"
                    />
                    <p className="xl:text-[1em] text-[.8em] ">
                      Centralized Employee Database Management
                    </p>
                  </li>
                </ul>
              </section>

              <section className="grid gap-5x">
                <p>Perfect for</p>
                <ul className="my-[.9em] flex gap-2 text-[.81em]">
                  <img
                    className="h-[1.5em] w-auto"
                    src="./check.png"
                    alt="mark"
                  />
                  <p>
                    Small teams and startups looking to streamline basic HR
                    processes.
                  </p>
                </ul>
                <div className="mt-7">
                  <Link to="/signup">
                    {" "}
                    <button className="group  inline-flex items-center gap-2 px-30 py-3 bg-indigo-700 text-white  font-medium transition-all duration-500 hover:bg-indigo-800 overflow-hidden rounded-full hover:tracking-wide ease-in-out">
                      <span>SUBSCRIBE</span>
                      <FaArrowRight className="w-5 h-5 transform group-hover:translate-x-5 group-hover:opacity-0 transition-all duration-300 ease-in-out" />
                    </button>
                  </Link>
                </div>
              </section>
            </main>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pricing;
