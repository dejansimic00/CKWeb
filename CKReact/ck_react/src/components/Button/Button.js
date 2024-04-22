const Button = ({
  minWidth = "130px",
  text,
  onClick,
  plusSign = false,
  type,
}) => {
  return (
    <div
      className={`rounded-lg  h-10   flex items-center`}
      style={{ minWidth: minWidth, background: "#ff0000" }}
    >
      {plusSign && <span className="text-2xl leading-3 text-white">+</span>}
      <button className="w-full  text-white" onClick={onClick} type={type}>
        {text}
      </button>
    </div>
  );
};

export default Button;
