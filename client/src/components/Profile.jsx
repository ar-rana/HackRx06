import React, { useState } from "react";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [verified, setVerfied] = useState(false);

  const [username, setUsername] = useState("Hello");
  return (
    <div
      className={`h-full w-[35%] bg-gray-600 border-r-3 border-white absolute left-0 flex flex-col z-10 duration-400 ease-in-out 
    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="relative h-3 w-3 text-2xl left-[107%] top-7 flex justify-center items-center">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-white rounded-md px-1.5"
        >
          <b>H</b>
        </button>
      </div>
      <div className="mx-4 mb-3 bg-gray-400 p-2 h-full">
        <div className="flex flex-col">
          <img
            className="mr-auto ml-auto rounded-md"
            src="https://picsum.photos/200"
            alt="Image"
          />
          <span className="text-gray-700 text-sm mr-auto ml-auto">
            aadhar verified: {verified ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            UserName: {username}
          </span>
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            Phone: {"0000 1111 22"}
          </span>
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            Aadhar: {"XXXX XXXX XXXX 2406"}
          </span>
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            Address: {"xyz building, abd place, kyp city, dgf district, wmn state - XXYYZZ"}
          </span>
          <div>
          {verified ? (
            ""
          ) : (
            <button className="w-full text-white bg-blue-600 font-semibold rounded-lg relative bottom-0 p-2 focus:ring-2 focus:outline-none focus:ring-primary-300">
              Verify Aadhar
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
