import { useEffect, useState } from "react";

const DateTime = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: e.g. "Aug 20, 2025, 14:35:21"
      const formatted = now.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formatted);
    };

    updateTime(); // initial call
    const timer = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(timer); // cleanup
  }, []);

  return <p className="font-semibold text-gray-700">{currentTime}</p>;
};

export default DateTime;
