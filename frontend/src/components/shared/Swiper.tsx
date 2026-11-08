import { Pagination, A11y, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "@/lib/optimizedImageUrl";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import type { MagazineSliderProps } from "@/types/posts";

const Slider = ({ data }: MagazineSliderProps) => {
  const pagination = {
    clickable: true,
  };
  return (
    <Swiper
      modules={[Pagination, A11y, Autoplay]}
      slidesPerView={1}
      pagination={pagination}
      autoplay={
        data.length > 1
          ? {
              delay: 3500,
              disableOnInteraction: false,
            }
          : false
      }
      loop={data.length > 1}
      className="w-full h-full absolute inset-0 z-0"
    >
      {data.map((item, index) => {
        const nextPost = data[(index + 1) % data.length];

        return (
          <SwiperSlide key={item._id} className=" flex items-end">
            <div className="absolute bg-[#211b1b]/50 inset-0 z-10" />
            <img
              src={getOptimizedImageUrl(item.image || "/placeholder.svg", 2000)}
              alt={item.title}
              className="w-full h-full object-cover absolute z-0"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
            <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 xl:px-8 pb-28 w-full z-20 flex justify-between items-end text-white font-grotesk">
              <div>
                <p className="text-white mb-3 uppercase text-xs font-grotesk">
                  {item.postType || item.categories?.[0] || "Magazine"}
                </p>
                <Link to={`/blog/${item._id}`} className="group">
                  <h1 className="text-white mb-7 font-light text-4xl max-w-md font-grotesk group-hover:underline">
                    {item.title}
                  </h1>
                </Link>
                <p className="max-w-md text-xl">
                  By {item.username?.name || "Staff Writer"}
                </p>
              </div>
              {data.length > 1 && (
                <div>
                  <p className="uppercase text-xs mb-3">Up next</p>
                  <p className="capitalize max-w-xs">{nextPost.title}</p>
                </div>
              )}
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
export default Slider;
