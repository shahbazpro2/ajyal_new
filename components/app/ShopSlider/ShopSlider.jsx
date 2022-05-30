import React from "react";
import dynamic from "next/dynamic";
import ArrowIconLeft from "../../../assets/icons/img-arrow-left.svg";
import ArrowIconRight from "../../../assets/icons/img-arrow-right.svg";
import HomeSliderLoader from "../HomeSlider/HomeSliderLoader";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });

const ShopSlider = ({ slider, shopId, isLoading }) => {
  const prevUrl = `${
    process.env.NEXT_PUBLIC_Shop_PREFIX
  }/${shopId}/shopslider/${slider[slider?.length - 1]?.imageUrl}`;

  const nextUrl = `${process.env.NEXT_PUBLIC_Shop_PREFIX}/${shopId}/shopslider/${slider[1]?.imageUrl}`;
  let nextAndPrevUrl = {};
  if (slider?.length > 0) {
    nextAndPrevUrl = {
      prevImageUrl: prevUrl,
      nextImageUrl: nextUrl,
    };

    const renderPrevNav = () => {
      return `<div class="homeSlider__nav-container homeSlider__nav-container--prev">
                <div class="homeSlider__nav-cover"></div>
                <img class="homeSlider__nav-icon homeSlider__nav-icon--prev" src=${ArrowIconLeft} alt="">
                <img id="homeSlider-image-prev" class="homeSlider__nav-image" src=${nextAndPrevUrl.prevImageUrl} alt="">
               </div>`;
    };

    const renderNextNav = () => {
      return `<div class="homeSlider__nav-container homeSlider__nav-container--next">
                <div class="homeSlider__nav-cover"></div>
                <img class="homeSlider__nav-icon homeSlider__nav-icon--next" src=${ArrowIconRight} alt="">
                <img id="homeSlider-image-next" class="homeSlider__nav-image" src=${nextAndPrevUrl.nextImageUrl} alt="">
               </div>`;
    };

    const changeImageHandler = (event) => {
      const div = Math.round(event.item.count / 2);
      let nextIndex = event.item.index - div + 1;
      let prevIndex = event.item.index - div - 1;

      if (nextIndex === event.item.count) nextIndex = 0;
      if (prevIndex < 0) prevIndex = event.item.count - 1;

      const prevUrl = `${process.env.NEXT_PUBLIC_Shop_PREFIX}/${shopId}/shopslider/${slider[prevIndex]?.imageUrl}`;
      const nextUrl = `${process.env.NEXT_PUBLIC_Shop_PREFIX}/${shopId}/shopslider/${slider[nextIndex]?.imageUrl}`;

      $("#homeSlider-image-prev").attr("src", prevUrl);
      $("#homeSlider-image-next").attr("src", nextUrl);
    };

    const options = {
      dots: false,
      items: 1,
      className: "owl-theme",
      loop: true,
      navElement: "div",
      navText: [renderPrevNav(), renderNextNav()],
      nav: true,
      onTranslated: changeImageHandler,
      responsive: {
        0: {
          dots: true,
          navText: "",
        },
        900: {
          dots: false,
          navText: [renderPrevNav(), renderNextNav()],
        },
      },
    };
    
    return (
      <section className="homeSlider">
        {isLoading ? (
          <HomeSliderLoader />
        ) : (
          <OwlCarousel {...options}>
            {slider?.map((item, index) => {
              return (
                <div className="homeSlider__item" key={index}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_Shop_PREFIX}/${shopId}/shopslider/${item.imageUrl}`}
                  />
                </div>
              );
            })}
          </OwlCarousel>
        )}
      </section>
    );
  }
};
export default React.memo(ShopSlider);
