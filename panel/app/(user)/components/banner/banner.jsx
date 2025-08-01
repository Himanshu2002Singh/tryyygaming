import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

const BannerCreate = () => {
  return (
    <div className="bg-black mx-2">
      {" "}
      <Link href="/posters">
        <div
          className="flex justify-between items-center bg-[var(--color-primary)]
         my-3 p-2 rounded-2xl"
        >
          <div className="flex items-center gap-2 py-1">
            <IoIosAddCircle className="text-black text-xl" />
            <h3 className=" text-black text-sm"> Offers</h3>
          </div>
          <div>
            {" "}
            <FaArrowRight className="text-black text-xl" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BannerCreate;
