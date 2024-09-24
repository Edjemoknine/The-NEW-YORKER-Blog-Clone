import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "./utils";
type BlogProps = {
  data: BlogItem[];
};

interface BlogItem {
  image: string;
  category: string;
  title: string;
  username: string;
}

const Slider = ({ data }: BlogProps) => {
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class=${cn(className)}>  </span>`;
    },
  };
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      slidesPerView={1}
      pagination={pagination}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      loop={true}
      className="w-full h-full absolute inset-0 z-0"
    >
      {data.map((item, index) => (
        <SwiperSlide key={index} className=" flex items-end">
          <div className="absolute bg-[#211b1b]/50 inset-0 z-10" />
          <img
            src={item.image}
            alt="banner"
            className="w-full h-full object-cover absolute z-0"
          />
          <div className="px-4 sm:px-6 xl:px-8 relative pb-28 w-full  z-20 flex justify-between items-center text-white font-grotesk">
            <div>
              <h5 className="text-white mb-3 uppercase text-xs font-grotesk">
                {item.category}
              </h5>
              <h1 className="text-white mb-7 font-light text-4xl max-w-md  font-grotesk">
                {item.title}
              </h1>
              <p className="max-w-md text-xl">{item.username}</p>
            </div>
            <div>
              <h5 className="uppercase text-xs mb-3">Up next</h5>
              <p className="capitalize max-w-xs">
                Naomi Pollock: The Japanesse House Since 1945 | Wrightwood 659
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default Slider;
