import { Outlet } from "react-router-dom";
import HrDashboardSidebar from "../Components/Reuseable/HrDashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen max-w-[1900px] mx-auto">
      {/* Sidebar always visible */}
      <div className="max-[1100px]:hidden">
        {" "}
        <HrDashboardSidebar />
      </div>

      {/* Content shifts right */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
