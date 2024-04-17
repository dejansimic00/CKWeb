import React from "react";

function TextBox({ width, placeholder = "placeholder", onChange }) {
  return (
    <div className={`rounded-[5.5rem] border-black border-2 h-12 w-full my-5`}>
      <input
        type="text"
        placeholder={`${placeholder}`}
        onChange={onChange}
        className="rounded-[5.5rem]  h-full w-full pl-6 text-2xl"
      ></input>
    </div>
  );
}

export default TextBox;
