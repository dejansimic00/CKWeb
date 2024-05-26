const Input = ({ img, placeholder, id, onChange, value, type = "text" }) => {
  return (
    <div className="flex items-center pl-2 h-10 w-80 self-start rounded-xl border-black border-2">
      {img && <img src={img} alt="input" className="w-4 h-4"></img>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="bg-transparent w-full outline-none placeholder-gray-700 pl-2"
        placeholder={placeholder}
        autoComplete="off"
      ></input>
    </div>
  );
};

export default Input;
