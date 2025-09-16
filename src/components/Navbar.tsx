"use client";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full py-6 px-8 flex justify-between items-center bg-white shadow-lg">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="DAS MOCK Logo"
          width={48}
          height={48}
          className="rounded-full"
          unoptimized
        />
        <span className="text-3xl font-extrabold text-blue-700 tracking-tight">
          DAS MOCK
        </span>
      </div>
      <div className="flex gap-6 items-center">
        <a
          href="/examiner"
          className="text-lg font-semibold text-blue-600 hover:underline"
        >
          Examiner Portal
        </a>
        <a
          href="/student"
          className="text-lg font-semibold text-purple-600 hover:underline"
        >
          Student Portal
        </a>
      </div>
    </nav>
  );
}
