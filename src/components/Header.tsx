"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MountainIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white border-b">
      <Link to="/" className="flex items-center justify-center gap-2">
        <MountainIcon className="h-6 w-6 text-indigo-600" />
        <span className="font-semibold text-lg">MyApp</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          to="#"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Features
        </Link>
        <Link
          to="#"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Pricing
        </Link>
        <Link
          to="#"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          About
        </Link>
        <Button>Get Started</Button>
      </nav>
    </header>
  );
};

export default Header;