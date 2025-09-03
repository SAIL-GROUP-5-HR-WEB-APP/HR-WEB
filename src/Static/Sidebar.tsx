import { Link } from "react-router-dom";
import Button from "../Components/Reuseable/Button";

type SidebarProps = {
  handleToggle: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ handleToggle }) => {
  return (
    <div className="bg-[#f2f7f8] min-h-[100vh] fixed w-full flex items-center justify-center z-50">
      <ul className="flex flex-col items-center gap-5 text-lg font-medium">
        <li onClick={handleToggle}>
          <Link to="/">Home</Link>
        </li>

        <li onClick={handleToggle}>
          <Link to="/faqs">Faqs</Link>
        </li>
        <li onClick={handleToggle}>
          <Link to="/about">About</Link>
        </li>
        <Link to={"/login"}>
          <li>
            <Button
              title="login"
              bg="#4338CA"
              textColor="white"
              borderColor="white"
              hoverr=" hover:scale-105"
            />
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
