import React, { useState } from "react";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(true);
  const slideMenu = () => {};
  return (
    <div className={`h-full w-[35%] bg-gray-600 border-r-4 border-white absolute left-0 flex flex-col z-10 duration-400 ease-in-out 
    ${isOpen ? "translate-x-0": "-translate-x-full"}`}>
      <div className="relative h-3 w-3 text-2xl left-[107%] top-7 flex justify-center items-center">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
            className="bg-white rounded-md px-1.5"
        >
          <b>H</b>
        </button>
      </div>
    </div>
  );
};

export default Profile;
