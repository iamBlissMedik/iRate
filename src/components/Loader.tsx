"use client";
import LoaderIcon from "@/assets/icons/loader.svg"; // adjust path
import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      {/* <Loader2 className="h-8 w-8 animate-spin text-secondary-2" /> */}
      <Image
        src={LoaderIcon}
        alt="Loading..."
        width={54}
        height={54}
        className="animate-spin"
      />
    </div>
  );
};

export default Loader;
