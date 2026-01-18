import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [opensearch, setOpensearch] = useState(false);

  return (
    <div className="bg-gray-950 flex flex-wrap justify-between items-center w-full px-10 py-5">
      <div>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-10">
        <Link
          className="text-lg font-semibold text-gray-200 pointer-cursor active:scale-90"
          to="/"
        >
          Home
        </Link>
        <Link
          className="text-lg font-semibold text-gray-200 pointer-cursor active:scale-90"
          to="/product"
        >
          Products
        </Link>
        <Link
          className="text-lg font-semibold text-gray-200 pointer-cursor active:scale-90"
          to="/ai-buddy"
        >
          Ai-Buddy
        </Link>
        <Link
          className="text-lg font-semibold text-gray-200 pointer-cursor active:scale-90"
          to="/about-us"
        >
          About-Us
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <button
          className="font-semibold text-gray-200 pointer-cursor active:scale-90"
          onClick={() => {
            setOpensearch(true);
          }}
        >
          <Search size={22} />
        </button>
        {opensearch && (
          <SearchBar
            onClose={() => {
              setOpensearch(false);
            }}
          />
        )}
        <Link
          className="font-semibold text-gray-200 pointer-cursor active:scale-90"
          to="cart"
        >
          <ShoppingCart />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
