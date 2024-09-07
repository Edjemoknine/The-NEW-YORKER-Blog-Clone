import React from "react";

const Sponsor = () => {
  return (
    <div className="flex items-center gap-3 w-fit mx-auto py-6 px-4">
      <img
        src="https://media.newyorker.com/photos/65b2c4913a23f17e3cba58e1/master/w_120,c_limit/TNYStore_ticker_art_02%20copy.png"
        className="w-10 h-10 object-contain"
        alt=""
      />
      <p className="text-sm">
        Find new offerings in The New Yorker Store, including limited-edition
        totes.
      </p>
      <a
        className="hover:border-b font-medium text-sm border-gray-500"
        href="#"
      >
        Browser and buy
      </a>
    </div>
  );
};

export default Sponsor;
