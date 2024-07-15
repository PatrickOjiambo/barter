"use client"
import PortalRenderer from "@/portal-renderer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="flex flex-col items-center justify-center w-full gap-y-5 ">
        <PortalRenderer
          kid={101}
          post_ref="post_ref"
          url="http://localhost:3000/shacks"
        />
        {/* <Image
          src="https://res.cloudinary.com/db7gfp5kb/image/upload/f_auto,q_auto/v1/portals/shacks/shack-banner"
          alt="Shack Banner"
          width={100}
          height={100}
          className="rounded-md overflow-hidden"
        />
        <p className="text-lg font-bold" >
          Shacks
        </p> */}
      </div>
    </div>
  );
}