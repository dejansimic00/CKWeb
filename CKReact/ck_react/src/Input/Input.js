const Input = ({ img, placeholder, id, onChange }) => {
  return (
    <div className=" flex items-center pl-2 h-10 w-80  self-start mb-4 rounded-xl border-black border-2">
      {img && <img src={img} alt="input" className="w-4 h-4"></img>}
      <input
        id={id}
        type="text"
        onChange={onChange}
        className="bg-transparent w-full outline-none placeholder-gray-700 pl-2"
        placeholder={placeholder}
      ></input>
    </div>
  );
};
export default Input;
