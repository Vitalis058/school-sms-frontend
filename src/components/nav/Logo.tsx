import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "./../../../public/logo.png";

function Logo({ width, height }: { width: number; height: number }) {
  return (
    <Link href={"/"}>
      <Image
        src={logo}
        alt="school logo"
        width={width}
        height={height}
        className="object-cover"
      />
    </Link>
  );
}

export default Logo;
