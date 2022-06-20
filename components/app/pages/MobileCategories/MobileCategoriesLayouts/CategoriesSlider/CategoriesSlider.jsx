import React from "react";
import dynamic from "next/dynamic";
import "./CategoriesSlider.scss";
import "./CategoriesSlider-rtl.scss";
import ArrowIconLeft from "../../../../../../assets/icons/img-arrow-left.svg";
import ArrowIconRight from "../../../../../../assets/icons/img-arrow-right.svg";
import { isRtl } from "../../../../../../lib/isRtl";
import { useSelector } from "react-redux";
import CategoryItem from "../CategoryItem/CategoryItem";
import { selectLang } from "../../../../../../appConfigSlice";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });

// const renderPrevNav = () => {
//   return `<div class="goodsSlider__nav-container goodsSlider__nav-container--prev">
//             <img class="goodsSlider__nav-icon goodsSlider__nav-icon--prev" src=${ArrowIconLeft} alt="">
//            </div>`;
// };

// const renderNextNav = () => {
//   return `<div class="goodsSlider__nav-container goodsSlider__nav-container--next">
//             <img class="goodsSlider__nav-icon goodsSlider__nav-icon--next" src=${ArrowIconRight} alt="">
//            </div>`;
// };

export default ({ count, data, reloadOnClick = false }) => {
  console.log('====================================');
  console.log('dataaaaaaaaaa', data);
  console.log('====================================');
  const lang = useSelector(selectLang);
  const rtl = isRtl(lang);
  const options = {
    dots: false,
    items: count,
    className: "owl-theme",
    loop: false,
    rtl: rtl,
    // navElement: "div", 
    nav: false,
    // navText: [renderPrevNav(), renderNextNav()],
    responsive: {
      0: {
        rtl: rtl,
        dots: true,
        nav: false,
        items: 3,
      },
      575: {
        rtl: rtl,
        dots: true,
        nav: false,
        items: 5,
      },
      767: {
        rtl: rtl,
        dots: true,
        nav: false,
        items: 7,
      },
      991: {
        rtl: rtl,
        dots: true,
        nav: false,
        items: 10,
      },
      1199: {
        rtl: rtl,
        nav: false,
        dots: false,
        items: 10,
      },
    },
  };

  return (
    <aside className="categorySlider">
      <OwlCarousel {...options}>
        {data?.childs?.map((category) => {
          return (
            <CategoryItem
              reload={reloadOnClick}
              key={category.categoryId}
              {...category}
            />
            // <GoodItem
            //   reload={reloadOnClick}
            //   key={good.goodsId}
            //   {...good}
            //   hover
            // />
          );
        })}

      </OwlCarousel>
    </aside>
  );
};
