import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import "./GoodsSlider.scss";
import "./GoodsSlider-rtl.scss";
import ArrowIconLeft from "../../../assets/icons/img-arrow-left.svg";
import ArrowIconRight from "../../../assets/icons/img-arrow-right.svg";
import { GoodItem } from "../../common";
import { selectLang } from "../../../appConfigSlice";
import { isRtl } from "../../../lib/isRtl";
import { useSelector } from "react-redux";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });

const renderPrevNav = () => {
  return `<div class="goodsSlider__nav-container goodsSlider__nav-container--prev">
            <img class="goodsSlider__nav-icon goodsSlider__nav-icon--prev" src=${ArrowIconLeft} alt="">
           </div>`;
};

const renderNextNav = () => {
  return `<div class="goodsSlider__nav-container goodsSlider__nav-container--next">
            <img class="goodsSlider__nav-icon goodsSlider__nav-icon--next" src=${ArrowIconRight} alt="">
           </div>`;
};

export default ({ count, data, reloadOnClick = false }) => {

  const lang = useSelector(selectLang);
  const rtl = isRtl(lang);
  const options = {
    dots: false,
    items: count,
    className: "owl-theme",
    loop: false,
    rtl: rtl,
    navElement: "div",
    nav: true,
    slideBy: count,
    navText: [renderPrevNav(), renderNextNav()],
    responsive: {
      0: {
        rtl: rtl,
        dots: true,
        nav: true,
        items: 2,
      },
      575: {
        rtl: rtl,
        dots: true,
        nav: true,
        items: 3,
      },
      767: {
        rtl: rtl,
        dots: true,
        nav: true,
        items: 4,
      },
      991: {
        rtl: rtl,
        dots: true,
        nav: true,
        items: 5,
      },
      1199: {
        rtl: rtl,
        nav: true,
        dots: false,
        items: count,
      },
    },
  };

  return (
    <aside className="goodsSlider">
      <OwlCarousel {...options}>
        {data?.map((good) => {
          return (
            <GoodItem
              reload={reloadOnClick}
              key={good.goodsId}
              {...good}
              hover
            />
          );
        })}
      </OwlCarousel>
    </aside>
  );
};
