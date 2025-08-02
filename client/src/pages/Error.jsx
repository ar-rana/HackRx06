import React from "react";

const Error = () => {
  return (
    <div className="relative z-10 bg-slate-800 h-screen w-screen">
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <h2 className="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]">
            404
          </h2>
          <h4 className="mb-3 text-[22px] font-semibold leading-tight text-white">
            Oops! That page can’t be found
          </h4>
          <p className="mb-8 text-lg text-white">
            Some error may have occured, thus you see me!
          </p>
          <a
            href="/"
            className="inline-block rounded-lg border border-white px-8 py-3 text-center text-base font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Go To Home
          </a>
        </div>
      </div>
      <div className="absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-between space-x-5 md:space-x-8 lg:space-x-14">
        <div className="h-full w-1/3 bg-linear-to-t from-[#FFFFFF14] to-[#C4C4C400]" />
        <div className="flex h-full w-1/3">
          <div className="h-full w-1/2 bg-linear-to-b from-[#FFFFFF14] to-[#C4C4C400]" />
          <div className="h-full w-1/2 bg-linear-to-t from-[#FFFFFF14] to-[#C4C4C400]" />
        </div>
        <div className="h-full w-1/3 bg-linear-to-b from-[#FFFFFF14] to-[#C4C4C400]" />
      </div>
    </div>
  );
};

export default Error;
