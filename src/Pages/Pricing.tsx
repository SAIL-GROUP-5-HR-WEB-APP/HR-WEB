import React from "react";

const Pricing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-4/5 m-auto xl:max-w-7xl xl:m-auto">
        <main className="flex flex-col xl:grid xl:gap-15">
          <div className="flex flex-col text-center leading-normal xl:flex xl:flex-col xl:items-center">
            <p className="text-blue-400">Our Pricing</p>
            <h2 className="text-3xl">Pricing plan</h2>
            <p>Check out our flexible pricing that best fits your plan</p>
          </div>

          <div className="xl:grid xl:grid-cols-3 xl:gap-10 justify-items-center">
            <main className="grid grid-row-3 gap-5 xl:grid xl:grid-rows-3 drop-shadow-xl border-[1px] border-gray-200 rounded-2xl bg-gray-50 xl:w-100 xl:h-150 p-4">
              <section className="h-[7em] flex flex-col justify-between xl:row-span-1 xl:flex xl:flex-col xl:gap-4">
                <h4 className="text-indigo-400">Basic plan</h4>
                <h2 className="text-3xl font-bold">$19.99/month</h2>
                <p className="">or $180 yearly</p>
                <div className="border-1 w-[100%] border-gray-200"></div>
              </section>
              <section className="w-full xl:grid xl:grid-row-2 xl:p-5 xl:text-[.95em] xl:row-span-3">
                <p className="m-0">Essential features:</p>
                <ul className="flex flex-col gap-2 xl:grid xl:grid-row-3">
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">Centralized Employee Database Management</p>
                  </li>
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">Centralized Employee Database Management</p>
                  </li>
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">Centralized Employee Database Management</p>
                  </li>
                </ul>
              </section>
              <section className="grid gap-5x">
                <p>Perfect for</p>
                <ul className="my-[.9em] flex gap-2 text-[.81em]">
                  <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                  <p>Small teams and startups looking to streamline basic HR processes.</p>
                </ul>
                <div>
                  <button className="w-full h-[3em] flex items-center justify-around bg-purple-600 rounded-[4rem]">
                    <p className="pl-10">Subscribe</p>
                    <img className="h-[1em] w-auto" src="./arrow.png" alt="arrow" />
                  </button>
                </div>
              </section>
            </main>

            {/* Second Pricing Card - Copy of First */}
            <main className="grid grid-row-3 gap-5 xl:grid xl:grid-rows-3 drop-shadow-xl border-[1px] border-gray-200 rounded-2xl bg-gray-50 xl:w-100 xl:h-150 p-4">
              <section className="h-[7em] flex flex-col justify-between xl:row-span-1 xl:flex xl:flex-col xl:gap-4">
                <h4 className="text-indigo-400">Standard plan</h4>
                <h2 className="text-3xl font-bold">$39.99/month</h2>
                <p className="">or $360 yearly</p>
                <div className="border-1 w-[100%] border-gray-200"></div>
              </section>
              <section className="w-full xl:grid xl:grid-row-2 xl:p-5 xl:text-[.95em] xl:row-span-3">
                <p className="m-0">Essential features:</p>
                <ul className="flex flex-col gap-2 xl:grid xl:grid-row-3">
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">Advanced Employee Database Management</p>
                  </li>
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">Payroll Automation</p>
                  </li>
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">Leave Management</p>
                  </li>
                </ul>
              </section>
              <section className="grid gap-5x">
                <p>Perfect for</p>
                <ul className="my-[.9em] flex gap-2 text-[.81em]">
                  <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                  <p>Growing businesses needing more automation and control.</p>
                </ul>
                <div>
                  <button className="w-full h-[3em] flex items-center justify-around bg-purple-600 rounded-[4rem]">
                    <p className="pl-10">Subscribe</p>
                    <img className="h-[1em] w-auto" src="./arrow.png" alt="arrow" />
                  </button>
                </div>
              </section>
            </main>

            {/* Third Pricing Card - Copy of First */}
            <main className="grid grid-row-3 gap-5 xl:grid xl:grid-rows-3 drop-shadow-xl border-[1px] border-gray-200 rounded-2xl bg-gray-50 xl:w-100 xl:h-150 p-4">
              <section className="h-[7em] flex flex-col justify-between xl:row-span-1 xl:flex xl:flex-col xl:gap-4">
                <h4 className="text-indigo-400">Premium plan</h4>
                <h2 className="text-3xl font-bold">$59.99/month</h2>
                <p className="">or $540 yearly</p>
                <div className="border-1 w-[100%] border-gray-200"></div>
              </section>
              <section className="w-full xl:grid xl:grid-row-2 xl:p-5 xl:text-[.95em] :row-span-3">
                <p className="m-0">Essential features:</p>
                <ul className="flex flex-col gap-2 xl:grid xl:grid-row-3">
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">All Standard Features</p>
                  </li>
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">Dedicated Support</p>
                  </li>
                  <li className="flex gap-5 items-center">
                    <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                    <p className="xl:text-[1em] text-[.8em] ">Custom Integrations</p>
                  </li>
                </ul>
              </section>
              <section className="grid gap-5x">
                <p>Perfect for</p>
                <ul className="my-[.9em] flex gap-2 text-[.81em]">
                  <img className="h-[1.5em] w-auto" src="./check.png" alt="mark" />
                  <p>Enterprises requiring advanced HR solutions and support.</p>
                </ul>
                <div>
                  <button className="w-full h-[3em] flex items-center justify-around bg-purple-600 rounded-[4rem]">
                    <p className="pl-10">Subscribe</p>
                    <img className="h-[1em] w-auto" src="./arrow.png" alt="arrow" />
                  </button>
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