import { Outlet } from "react-router-dom";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import HrDashboardSidebar from "../Components/Reuseable/HrDashboardSidebar";
import { useState } from "react";
import Hrmside from "../Components/Reuseable/Hrmside";

const DashboardLayout = () => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => setToggle((prev) => !prev);

  return (
    <div className="flex h-screen max-w-[1900px] mx-auto">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block">
        <HrDashboardSidebar />
      </div>

      {/* Sidebar (mobile collapsible) */}
      {toggle && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="w-64 h-full bg-white shadow-lg">
            <Hrmside handleToggle={handleToggle} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
        {/* Mobile Navbar */}
        <div className="p-4 text-black flex justify-start lg:hidden">
          <button onClick={handleToggle} aria-label="Toggle menu">
            {toggle ? (
              <RxCross1
                size={28}
                className="text-black hover:text-indigo-200 transition-colors duration-200"
              />
            ) : (
              <RxHamburgerMenu
                size={28}
                className="text-black hover:text-indigo-200 transition-colors duration-200"
              />
            )}
          </button>
        </div>

        {/* Routed pages */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
