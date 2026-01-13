import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Search } from "lucide-react";
import SearchBar from "./SearchBar";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [opensearch, setOpensearch] = useState(false);


  return (
    <div className="bg-gray-700 flex flex-wrap justify-between items-center w-full px-10">
      <div>
        <Logo />
      </div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/product">Products</Link>
        <Link to="/ai-buddy">Ai-Buddy</Link>
        <Link to="/about-us">About-Us</Link>
      </div>
      <div>
        <button
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
        <Link to="cart">
          <ShoppingCart />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
