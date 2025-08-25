import Button from "../../Reuseable/Button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="max-w-[1280px] mx-auto mt-16">
      <div className="flex items-center justify-center my-8">
        <div className="h-px w-20 bg-gray-300"></div>
        <h2 className="mx-6 text-lg  text-black">How it works</h2>
        <div className="h-px w-20 bg-gray-300"></div>
      </div>

      <div>
        <h1 className="max-w-[350px] mx-auto text-5xl font-bold text-center">
          How it{" "}
          <span>
            <i>works</i>
          </span>{" "}
          in simple way
        </h1>
      </div>
      {/* card section */}
      <div className="flex mt-16 max-[830px]:flex-col max-[830px]:gap-16">
        {/* start */}
        <div className="max-w-md mx-auto border border-gray-200 bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Start Your Free Trial
          </h1>

          <div className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="flex items-center justify-between peer  w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">First name</span>
                    <span className="font-medium">Jane</span>
                  </div>
                  <div className="text-indigo-500 font-semibold text-sm">✓</div>
                </div>
              </div>

              <div className="relative">
                <div
                  aria-hidden="true"
                  className="flex items-center justify-between peer  w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Last name</span>
                    <span className="font-medium">Doe</span>
                  </div>
                  <div className="text-indigo-500 font-semibold text-sm">✓</div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="flex items-center justify-between  w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Email address</span>
                  <span className="font-medium">jane.doe@example.com</span>
                </div>
                <div className="text-indigo-500 font-semibold text-sm">✓</div>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-19">
              <div className="flex-1">
                <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-300"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <div className="mt-1">
                  All set! Review and start your trial.
                </div>
              </div>
              <div className="text-xs font-medium text-indigo-600 uppercase">
                Step 1 of 3
              </div>
            </div>

            <p className="text-xs text-center text-gray-500">
              Create your account within minutes.
            </p>
            <div className="flex justify-center items-center mt-11">
              {" "}
              <Link to="/signup">
                {" "}
                <Button
                  title="Get Started"
                  bg="#4F46E5"
                  textColor="white"
                  borderColor="white"
                  hoverr=" hover:scale-105"
                />
              </Link>
            </div>
          </div>
        </div>
        {/* start */}

        {/* configure */}
        <div className="max-w-md mx-auto border border-gray-200 bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Configure Your Account
          </h1>

          <div className="space-y-5">
            {/* Password Setup */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="flex items-center justify-between  w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Password</span>
                  <span className="font-medium">••••••••</span>
                </div>
                <div className="text-indigo-500 font-semibold text-sm">✓</div>
              </div>
            </div>

            {/* Preferences */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="flex items-center justify-between  w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Position </span>
                  <span className="font-medium">Admin</span>
                </div>
                <div className="text-indigo-500 font-semibold text-sm">✓</div>
              </div>
            </div>

            {/* Two-Factor Auth */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="flex items-center justify-between  w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Two-Factor Auth</span>
                  <span className="font-medium">Enabled</span>
                </div>
                <div className="text-indigo-500 font-semibold text-sm">✓</div>
              </div>
            </div>

            {/* Progress  */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex-1">
                <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-300"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <div className="mt-1">Account configured successfully.</div>
              </div>
              <div className="text-xs font-medium text-indigo-600 uppercase">
                Step 2 of 3
              </div>
            </div>

            <p className="text-xs text-center text-gray-500">
              Tailor the system to your unique needs
            </p>
            <div className="flex justify-center items-center">
              {" "}
              <Link to="/signup">
                {" "}
                <Button
                  title="Get Started"
                  bg="#4F46E5"
                  textColor="white"
                  borderColor="white"
                  hoverr=" hover:scale-105"
                />
              </Link>
            </div>
          </div>
        </div>
        {/* configure */}

        {/* start process */}
        <div className="mx-auto w-[350px] border border-gray-200 bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-xl font-bold text-center mb-3">
            Start Optimizing Your HR Processes
          </h1>

          <div className="space-y-4">
            {/* Employee Profiles */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="flex items-center justify-between w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col">
                  <span className="font-medium"> Employee Profiles</span>
                </div>
              </div>
            </div>

            {/* Leave Policy */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="flex items-center justify-between w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Leave Policy</span>
                </div>
              </div>
            </div>

            {/* Payroll */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="flex items-center justify-between w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Payroll Setup</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex-1">
                <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-300"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <div className="mt-1">Your HR system is ready to use.</div>
              </div>
              <div className="font-medium text-indigo-600 uppercase">
                Step 3 of 3
              </div>
            </div>

            <p className="text-xs text-center text-gray-500">
              Streamline operations and get insightful analytics.
            </p>
            <div className="flex justify-center items-center mt-16">
              {" "}
              <Link to="/signup">
                {" "}
                <Button
                  title="Get Started"
                  bg="#4F46E5"
                  textColor="white"
                  borderColor="white"
                  hoverr=" hover:scale-105"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* start process */}

        {/* card section */}
      </div>
    </div>
  );
};

export default HowItWorks;
