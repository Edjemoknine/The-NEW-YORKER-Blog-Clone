import { ArrowUp, Facebook, Instagram, Slack, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-foreground px-4 py-8 text-background sm:px-6 xl:px-8">
      <div className="flex items-center justify-between py-10">
        <Link to={"/"}>
          <span
            className={
              "w-40 font-editorial text-xl font-bold uppercase leading-5 tracking-tight text-background first-letter:float-left first-letter:-mt-1.5 first-letter:text-5xl"
            }
          >
            News
            <br />
            exus
          </span>
        </Link>
        <div className="group flex size-11 cursor-pointer items-center justify-center rounded-full bg-background text-foreground">
          <ArrowUp
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group-hover:animate-bounce duration-300"
          />
        </div>
      </div>

      <div className="grid items-start py-6 text-sm font-medium text-background/65 md:grid-cols-2">
        <div className="grid items-end gap-6 border-y border-background/15 py-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-editorial text-lg font-semibold text-background">
              Sections
            </h2>
            <ul className="space-y-2 *:w-fit *:border-b *:border-transparent hover:*:border-background/50">
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
            <ul className="space-y-2 *:w-fit *:border-b *:border-transparent hover:*:border-background/50">
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
        <div className="grid gap-6 border-y border-background/15 py-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-editorial text-lg font-semibold text-background">
              More
            </h2>
            <ul className="space-y-2 *:w-fit *:border-b *:border-transparent hover:*:border-background/50">
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
            <ul className="space-y-2 *:w-fit *:border-b *:border-transparent hover:*:border-background/50">
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
      <div className="grid gap-6 border-b border-background/15 py-6 text-sm font-medium text-background/65 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <ul className="space-y-2 *:w-fit *:border-b *:border-transparent hover:*:border-background/50">
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
        <ul className="space-y-2 *:w-fit *:border-b *:border-transparent hover:*:border-background/50">
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

        <ul className="space-y-2 *:w-fit *:border-b *:border-transparent hover:*:border-background/50">
          <li>
            <Link to={"/"}>Accessibility Help</Link>
          </li>
          <li>
            <Link to={"/"}>User Agreement</Link>
          </li>
        </ul>
        <ul className="space-y-2 *:w-fit *:border-b *:border-transparent hover:*:border-background/50">
          <li>
            <Link to={"/"}>Privacy Policy & Cookie Statement</Link>
          </li>
          <li>
            <Link to={"/"}>Your California Privacy Rights</Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col-reverse items-center justify-between border-b border-background/15 pb-8 text-background/65 md:flex-row">
        <div className="max-w-5xl text-center text-xs md:text-left">
          © 2024 MokaEd. All rights reserved. The New Yorker may earn a portion
          of sales from products that are purchased through our site as part of
          our Affiliate Partnerships with retailers. The material on this site
          may not be reproduced, distributed, transmitted, cached or otherwise
          used, except with the prior written permission of Condé Nast. Ad
          Choices
        </div>
        <div className="flex gap-8 py-6">
          <Facebook size={25} className="cursor-pointer" />
          <Youtube size={25} className="cursor-pointer" />
          <Instagram size={25} className="cursor-pointer" />
          <Slack size={25} className="cursor-pointer" />
        </div>
      </div>
      <p className="pt-6 text-center text-sm italic text-background/50">
        Made with ❤️ by @moknine
      </p>
    </footer>
  );
};

export default Footer;
