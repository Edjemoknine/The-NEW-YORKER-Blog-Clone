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
            <div className="absolute inset-0 z-10 bg-foreground/50" />
            <img
              src={getOptimizedImageUrl(item.image || "/placeholder.svg", 2000)}
              alt={item.title}
              className="w-full h-full object-cover absolute z-0"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
            <div className="absolute inset-x-0 bottom-0 z-20 flex w-full items-end justify-between px-4 pb-28 text-white sm:px-6 xl:px-8">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  {item.postType || item.categories?.[0] || "Magazine"}
                </p>
                <Link to={`/blog/${item._id}`} className="group">
                  <h1 className="mb-7 max-w-2xl font-editorial text-4xl font-medium leading-tight tracking-tight text-white group-hover:underline md:text-6xl">
                    {item.title}
                  </h1>
                </Link>
                <p className="max-w-md text-lg text-white/85">
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
