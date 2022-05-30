import React from "react";
import { BoxStyle2, GoodItemLoader2 as GoodItemLoader } from "../../common";
import dynamic from "next/dynamic";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });

const GoodsSliderLoader = () => {
  const options = {
    dots: false,
    items: 6,
    className: "owl-theme",
    loop: false,
    navElement: "div",
    nav: false,
    responsive: {
      0: {
        dots: true,
        navText: "",
        items: 2,
      },
      450: {
        dots: true,
        navText: "",
        items: 3,
      },
      700: {
        dots: true,
        navText: "",
        items: 4,
      },
      900: {
        dots: true,
        navText: "",
        items: 5,
      },
      1200: {
        dots: false,
        items: 6,
      },
    },
  };

  return (
    <BoxStyle2>
      <div className="d-flex goodsSliderLoader">
        {/* <OwlCarousel {...options}> */}
        <GoodItemLoader className="col-md-2 col-sm-3  col-6 d-none d-sm-block" />
        <GoodItemLoader className="col-md-2 col-sm-3 col-6 d-none d-sm-block" />
        <GoodItemLoader className="col-md-2 col-sm-3  col-6 d-none d-sm-block" />
        <GoodItemLoader className="col-md-2 col-sm-3 col-6 d-none d-sm-block" />
        <GoodItemLoader className="col-md-2  col-6 d-block d-sm-none d-md-block" />
        <GoodItemLoader className="col-md-2  col-6  d-block  d-sm-none d-md-block" />
        {/* </OwlCarousel> */}
      </div>
    </BoxStyle2>
  );
};

export default GoodsSliderLoader;
