import React, { useEffect, useState } from "react";
import defimg from "../assets/default_profile.png"
import { useAuthContext } from "../hooks/TokenContext";
import { useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [verified, setVerfied] = useState(false);

  const [photo, setPhoto] = useState(defimg);
  const [name, setName] = useState("verification required");
  const [gender, setGender] = useState("verification required");
  const [username, setUsername] = useState(location?.state?.msg);
  const [phone, setPhone] = useState("verification required");
  const [aadhaar, setAadhaar] = useState("verification required");
  const [address, setAddress] = useState("verification required");
  const [kycData, setKycdata ] = useState("verification required");

  const startkyc = async () => {
    try {
      const res = await fetch("http://localhost:8080/verification/start/kyc", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("kyc verify res: ", res);
      if (res.status == 403) {
        navigate("/", {state: {msg: "session timed out"}});
      } else if (res) {
        const data = await res.text();
        console.log("kyc verify: ", data);

        window.open(data, "_blank");
      }
    } catch (e) {
      console.log("some error occured at KYC verification: ", e.message);
    }
  };

  const getKycData = async () => {
    try {
      const res = await fetch("http://localhost:8080/verification/kyc", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("kyc: ", res);

      if (res.ok) {
        const data = await res.json();
        console.log("kyc: ", data);

        setAadhaar(data.maskedNumber);
        setAddress(data.address);
        setGender(data.gender);
        setKycdata(data.pdf);
        setPhone(data.phone);
        setName(data.name);
        const img = "data:image/png;base64," + data.photo;
        setPhoto(img);
        setVerfied(true);
      }
    } catch (e) {
      console.log("some error occured at KYC verification: ", e.message);
    }
  };

  useEffect(() => {
    getKycData();
  }, []);

  return (
    <div
      className={`h-full w-[85%] sm:w-[45%] bg-gray-600 border-r-3 border-white absolute left-0 flex flex-col z-10 duration-400 ease-in-out 
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
      <div className="mx-4 mb-3 bg-gray-700 p-5 h-full overflow-y-scroll rounded-md">
        <div className="flex flex-col">
          <img
            className="mr-auto ml-auto rounded-md max-h-60"
            src={photo}
            alt="Image"
          />
          <span className="text-white text-sm mr-auto ml-auto">
            Aadhaar verified: {verified ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            UserName: {username}
          </span>
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            Name: {name}
          </span>
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            Gender: {gender}
          </span>
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            Phone: {phone}
          </span>
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            Aadhar: {aadhaar}
          </span>
          <span className="bg-gray-200 text-gray-600 font-semibold rounded-lg block w-full p-2 py-1.5">
            Address: {address}
          </span>
          <div>
            {verified ? (
              <button
                className="w-full text-white bg-blue-600 font-semibold rounded-lg relative bottom-0 p-2 focus:ring-2 focus:outline-none focus:ring-primary-300"
                onClick={() => window.open(kycData, "_blank")}
              >
                Download Your Data
              </button>
            ) : (
              <button
                className="w-full text-white bg-blue-600 font-semibold rounded-lg relative bottom-0 p-2 focus:ring-2 focus:outline-none focus:ring-primary-300"
                onClick={startkyc}
              >
                Verify KYC
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
