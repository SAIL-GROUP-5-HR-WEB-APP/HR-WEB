import { LuNetwork, LuTrendingUp, LuCalendarCheck } from "react-icons/lu";
const Body = () => {
  const details = [
    {
      icon: <LuNetwork size={35} color="white" />,
      title: "Employee Database Management",
      desc: "Centralized employee information for easy access.",
    },
    {
      icon: <LuCalendarCheck color="white" size={35} />,
      title: "Attendance Tracking",
      desc: "Real-time attendance monitoring and reporting.",
    },
    {
      icon: <LuTrendingUp color="white" size={35} />,
      title: "Performance Analytics",
      desc: "In-depth analytics for strategic decision making.",
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto mt-20 px-10">
      <div className="flex justify-between max-[830px]:flex-col max-[830px]:gap-16">
        {details?.map((data, i) => (
          <main key={i} className="flex flex-col items-center">
            <div className="bg-indigo-800 max-w-[60px] px-2 py-2 rounded-2xl border-4 border-white shadow-2xl leading-20">
              {data.icon}
            </div>
            <h1 className="text-3xl font-semibold w-[280px] text-center mt-4">
              {data.title}
            </h1>
            <p className="text-gray-600 text-sm w-[230px] text-center mt-3">
              {data.desc}
            </p>
          </main>
        ))}
      </div>
    </div>
  );
};

export default Body;
