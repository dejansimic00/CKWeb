import DatePicker from "../../components/DatePicker/DatePicker";
import React, { useEffect, useState } from "react";

function Camp() {
  const [date, setDate] = useState();

  let x = {
    dateOfBirth: "1999-11-28",
  };

  useEffect(() => {
    console.log(x.dateOfBirth);
  }, [date]);
  //  = new Date(x.dateOfBirth);

  useEffect(() => {
    setDate(x.dateOfBirth);
  }, []);
  return (
    <div className="flex flex-col w-full items-center">
      <p className="self-start font-bold">Datum rođenja</p>
      <DatePicker value={x.dateOfBirth} />
    </div>
  );
}

export default Camp;
