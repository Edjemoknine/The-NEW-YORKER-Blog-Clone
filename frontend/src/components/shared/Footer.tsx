import { ArrowUp, Facebook, Instagram, Slack, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="p-4 sm:p-6 xl:p-8 bg-[#121212] w-full">
      <div className="flex items-center justify-between py-10">
        <Link to={"/"}>
          <h1
            className={
              "text-[19px] first-letter:text-5xl leading-5 first-letter:-mt-1.5 font-black duration-300   font-jerssy w-40 uppercase  first-letter:float-left text-white "
            }
          >
            News
            <br />
            exus
          </h1>
        </Link>
        <div className="w-12 h-12 flex items-center justify-center cursor-pointer group bg-white rounded-full">
          <ArrowUp
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group-hover:animate-bounce duration-300"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 text-sm items-en text-[#A2A2A2] font-medium  py-6">
        <div className="grid sm:grid-cols-2  items-end gap-6 border-t border-b border-neutral-700  py-6">
          <div>
            <h3 className="text-white mb-3">SECTIONS</h3>
            <ul className="space-y-2 *:w-fit *:border-b hover:*:border-b hover:*:border-[#A2A2A2]  *:border-transparent ">
              <li>
                <Link to={"/"}>News</Link>
              </li>
              <li>
                <Link to={"/"}>Books & Culture</Link>
              </li>
              <li>
                <Link to={"/"}>Fiction & Poetry</Link>
              </li>
              <li>
                <Link to={"/"}>Humor a Cartoons</Link>
              </li>
              <li>
                <Link to={"/"}>Magazine</Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 *:w-fit *:border-b hover:*:border-b hover:*:border-[#A2A2A2]  *:border-transparent ">
              <li>
                <Link to={"/"}>News</Link>
              </li>
              <li>
                <Link to={"/"}>Books & Culture</Link>
              </li>
              <li>
                <Link to={"/"}>Fiction & Poetry</Link>
              </li>
              <li>
                <Link to={"/"}>Humor a Cartoons</Link>
              </li>
              <li>
                <Link to={"/"}>Magazine</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 border-t border-b  border-neutral-700  py-6">
          <div>
            <h3 className="text-white mb-3">MORE</h3>
            <ul className="space-y-2 *:w-fit *:border-b hover:*:border-b hover:*:border-[#A2A2A2]  *:border-transparent ">
              <li>
                <Link to={"/"}>Customer Care</Link>
              </li>
              <li>
                <Link to={"/"}>Shop The New Yorker</Link>
              </li>
              <li>
                <Link to={"/"}>Buy Covers and Cartoons</Link>
              </li>
              <li>
                <Link to={"/"}>Condeé Nast Store</Link>
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <ul className="space-y-2 *:w-fit *:border-b hover:*:border-b hover:*:border-[#A2A2A2]  *:border-transparent ">
              <li>
                <Link to={"/"}>Digital Access</Link>
              </li>
              <li>
                <Link to={"/"}>Newsletters</Link>
              </li>
              <li>
                <Link to={"/"}>Jigsaw Puzzle</Link>
              </li>
              <li>
                <Link to={"/"}>RSS</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 text-sm text-[#A2A2A2] border-b  font-medium md:grid-cols-3 xl:grid-cols-4 gap-6 border-neutral-800 py-6">
        <ul className="space-y-2 *:w-fit *:border-b hover:*:border-b hover:*:border-[#A2A2A2]  *:border-transparent    ">
          <li>
            <Link to={"/"}>About</Link>
          </li>
          <li>
            <Link to={"/"}>Careers</Link>
          </li>
          <li>
            <Link to={"/"}>Contact</Link>
          </li>
        </ul>
        <ul className="space-y-2 *:w-fit *:border-b hover:*:border-b hover:*:border-[#A2A2A2]  *:border-transparent ">
          <li>
            <Link to={"/"}>F.A.Q</Link>
          </li>
          <li>
            <Link to={"/"}>Media Kit</Link>
          </li>
          <li>
            <Link to={"/"}>Press</Link>
          </li>
        </ul>

        <ul className="space-y-2 *:w-fit *:border-b hover:*:border-b hover:*:border-[#A2A2A2]  *:border-transparent ">
          <li>
            <Link to={"/"}>Accessibility Help</Link>
          </li>
          <li>
            <Link to={"/"}>User Agreement</Link>
          </li>
        </ul>
        <ul className="space-y-2 *:w-fit *:border-b hover:*:border-b hover:*:border-[#A2A2A2]  *:border-transparent ">
          <li>
            <Link to={"/"}>Privacy Policy & Cookie Statement</Link>
          </li>
          <li>
            <Link to={"/"}>Your California Privacy Rights</Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center md:flex-row flex-col-reverse  justify-between text-[#A2A2A2] border-b border-neutral-800 pb-8">
        <div className="text-xs text-center md:text-left max-w-5xl">
          © 2024 MokaEd. All rights reserved. The New Yorker may earn a portion
          of sales from products that are purchased through our site as part of
          our Affiliate Partnerships with retailers. The material on this site
          may not be reproduced, distributed, transmitted, cached or otherwise
          used, except with the prior written permission of Condé Nast. Ad
          Choices
        </div>
        <div className="flex py-6 gap-8">
          <Facebook size={25} className="cursor-pointer" />
          <Youtube size={25} className="cursor-pointer" />
          <Instagram size={25} className="cursor-pointer" />
          <Slack size={25} className="cursor-pointer" />
        </div>
      </div>
      <p className="text-sm text-[#a2a2a2] text-center pt-6 italic">
        Made with ❤️ by @moknine
      </p>
    </footer>
  );
};

export default Footer;
