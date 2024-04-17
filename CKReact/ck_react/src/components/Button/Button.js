function Button({ width, text }) {
  return (
    <div
      className={`rounded-[5.5rem] border-black border-2 h-12  my-5 bg-red-200 `}
      style={{ width: width }}
    >
      <button className="w-full h-full">{text}</button>
    </div>
  );
}

export default Button;
