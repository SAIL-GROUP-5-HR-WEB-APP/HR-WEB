interface ButtonProps {
  title: string;
  bg?: string;
  textColor?: string;
  borderColor?: string;
  hoverr?: string;
  icon?: React.ReactNode;
  hoverColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  bg,
  textColor,
  borderColor,
  hoverr,
  icon,
  hoverColor,
}) => {
  return (
    <button
      style={{
        backgroundColor: `${bg}`,
        color: `${textColor}`,
        border: `2px solid ${borderColor}`,
      }}
      className={`px-5 py-3 rounded-lg flex items-center w-max transition-all duration-300 ${hoverr} font-bold cursor-pointer hover:${hoverColor}`}
    >
      <span> {title}</span>
      <span className="ml-1">{icon}</span>
    </button>
  );
};

export default Button;
