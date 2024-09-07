import { ChevronsDown } from "lucide-react";
import React from "react";

const Section = () => {
  return (
    <section className="max-w-[90rem] mt-20 mx-auto rounded-2xl  p-4 bg-gradient-to-b from-gray-300">
      <div className="rounded-tl-2xl rounded-tr-2xl border-b mb-4 border-neutral-700 ">
        <div>
          <h1 className="text-6xl font-extrabold pb-6">Gear</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        <div className="col-span-2">
          <div className="p-6 min-h-[500px] rounded-2xl bg-[#151515] text-white text-center flex flex-col gap-4">
            <img
              src="https://imgix.bustle.com/uploads/image/2024/5/20/b07f8ce0/sonos-ace-headphones-hands.jpg?w=860&h=482&fit=crop&crop=faces"
              alt="image"
              className="w-full h-full object-cover rounded-lg"
            />
            <span className="border font-semibold uppercase w-fit mx-auto border-white rounded-full px-3 py-1 text-[10px]">
              THE INCERSE INTRERVIEW
            </span>
            <h3 className="text-4xl font-semibold mx-auto max-w-2xl">
              Sono's Lead Designers Get Nerdy About the New Ace Headphones
            </h3>

            <p className="max-w-xl mx-auto">
              The audio company VP od Design dana krieger and Senior Indestrial
              Designer David Keating go deeper into what makes the upcomming Ace
              headphones so special.
            </p>
            <span className="text-xs uppercase">BY RAYMOND WONG</span>
          </div>
          <div className="border-t border-b border-gray-700 divide-gray-700 mt-6 flex divide-x">
            <div className="flex p-8 gap-6 ">
              <div className="h-44 w-full rounded overflow-hidden">
                <img
                  src="https://imgix.bustle.com/uploads/image/2024/5/17/66ebf7e9/ipad-pro-nano-texture.jpeg?w=205&h=205&fit=crop&crop=faces"
                  alt="iamge"
                  className="object-cover rounded-lg bg-red-300 h-full w-full"
                />
              </div>
              <div className="flex justify-between flex-col">
                <p className="uppercase px-3 text-[10px] font-bold border-2 text-center w-fit mx-auto border-gray-700 py-1 rounded-full">
                  THE INCERSE INTRERVIEW
                </p>
                <h6 className=" font-semibold">
                  Apple Previewd the Future of the iPad and Nobody Noticed
                </h6>
              </div>
            </div>
            <div className="flex p-8 gap-6 ">
              <div className="h-44 w-full rounded overflow-hidden">
                <img
                  src="https://imgix.bustle.com/uploads/image/2024/5/17/66ebf7e9/ipad-pro-nano-texture.jpeg?w=205&h=205&fit=crop&crop=faces"
                  alt="iamge"
                  className="object-cover rounded-lg bg-red-300 h-full w-full"
                />
              </div>
              <div className="flex justify-between flex-col">
                <p className="uppercase px-3 text-[10px] font-bold border-2 text-center w-fit mx-auto border-gray-700 py-1 rounded-full">
                  THE INCERSE INTRERVIEW
                </p>
                <h6 className=" font-semibold">
                  Apple Previewd the Future of the iPad and Nobody Noticed
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 w-full">
          <ul className="w-full">
            <li className="py-5 border-b border-gray-700 flex items-center">
              <ChevronsDown className="text-gray-700 font-black" size={50} />
              <h2 className="text-5xl font-extrabold">News</h2>
            </li>
            <li className="py-3 border-b border-gray-700">
              <p className="uppercase text-[10px] text-neutral-500">
                23 hours ago
              </p>
              <h4 className="font-semibold text-lg">
                AI's Takeover of Wireless Earbuds Is Here, Whether You Like It
                or Not
              </h4>
            </li>
            <li className="py-3 border-b border-gray-700">
              <p className="uppercase text-[10px] text-neutral-500">
                23 hours ago
              </p>
              <h4 className="font-semibold text-lg">
                AI's Takeover of Wireless Earbuds Is Here, Whether You Like It
                or Not
              </h4>
            </li>
            <li className="py-3 border-b border-gray-700">
              <p className="uppercase text-[10px] text-neutral-500">
                23 hours ago
              </p>
              <h4 className="font-semibold text-lg">
                AI's Takeover of Wireless Earbuds Is Here, Whether You Like It
                or Not
              </h4>
            </li>
            <li className="py-3 border-b border-gray-700">
              <p className="uppercase text-[10px] text-neutral-500">
                23 hours ago
              </p>
              <h4 className="font-semibold text-lg">
                AI's Takeover of Wireless Earbuds Is Here, Whether You Like It
                or Not
              </h4>
            </li>
          </ul>
          <div className="flex-col flex gap-4 text-center pt-6">
            <div className="h-52 w-full rounded-t-lg bg-red-400 ">
              <img
                src="https://imgix.bustle.com/uploads/image/2024/5/16/38029435/artboard-1.jpg?w=440&h=262&fit=crop&crop=faces"
                alt="image"
                className="w-full h-full object-cover rounded-t-xl"
              />
            </div>
            <p className="uppercase bg-lime-200 w-fit mx-auto px-3 py-1 rounded-full text-xs">
              Review
            </p>
            <h3 className="uppercase text-3xl font-black ">
              THIS dirt-cheap gaming controller made me loe xbox cloud gaming
            </h3>
            <p className="text-[#151515]">
              Xbox's cloud sreaming game service and game Sire's X2s controller
              are a match made in heaven.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section;
