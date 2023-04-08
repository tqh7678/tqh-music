import { memo } from "react";
import { SliderContainer } from "./style";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

function Slider(props) {
  const { bannerList } = props;

  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ type: "bullets", clickable: true }}
          >
            {bannerList?.map((slider) => {
              return (
                <SwiperSlide key={slider.imageUrl}>
                  <img
                    src={slider.imageUrl}
                    width="100%"
                    height="100%"
                    alt="推荐"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </SliderContainer>
  );
}

export default memo(Slider);
