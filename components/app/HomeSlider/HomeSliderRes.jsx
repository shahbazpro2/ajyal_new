import React from "react";
import dynamic from "next/dynamic";
import ArrowIconLeft from "../../../assets/icons/img-arrow-left.svg";
import ArrowIconRight from "../../../assets/icons/img-arrow-right.svg";
import HomeSliderLoader from "./HomeSliderLoader";
import Link from "next/link";
import { connect } from "react-redux";
import { selectCurr, selectLang } from "../../../appConfigSlice";
import { SEARCH_TYPE_SLIDER } from "../../../lib/querys";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });

class HomeSlider extends React.Component {
  constructor(props) {
    super(props);
  }
  renderPrevNav = () => {
    return `<div class="homeSlider__nav-container homeSlider__nav-container--prev">
            <div class="homeSlider__nav-cover"></div>
            <img class="homeSlider__nav-icon homeSlider__nav-icon--prev" src=${ArrowIconLeft} alt="">
            <img id="homeSlider-image-prev" class="homeSlider__nav-image" src=${this.nextAndPrevUrl.prevImageUrl} alt="">
           </div>`;
  };

  renderNextNav = () => {
    return `<div class="homeSlider__nav-container homeSlider__nav-container--next">
            <div class="homeSlider__nav-cover"></div>
            <img class="homeSlider__nav-icon homeSlider__nav-icon--next" src=${ArrowIconRight} alt="">
            <img id="homeSlider-image-next" class="homeSlider__nav-image" src=${this.nextAndPrevUrl.nextImageUrl} alt="">
           </div>`;
  };

  changeImageHandler = (event) => {
    const div = Math.round(event.item.count / 2);
    let nextIndex = event.item.index - div + 1;
    let prevIndex = event.item.index - div - 1;

    if (nextIndex === event.item.count) nextIndex = 0;
    if (prevIndex < 0) prevIndex = event.item.count - 1;

    $("#homeSlider-image-prev").attr(
      "src",
      `${process.env.NEXT_PUBLIC_Slider_PREFIX}/${this.props.slider[prevIndex]?.imageUrl}`
    );
    $("#homeSlider-image-next").attr(
      "src",
      `${process.env.NEXT_PUBLIC_Slider_PREFIX}/${this.props.slider[nextIndex]?.imageUrl}`
    );
  };

  render() {
    if (this.props?.slider?.length > 0) {
      this.nextAndPrevUrl = {
        prevImageUrl: `${process.env.NEXT_PUBLIC_Slider_PREFIX}/${
          this.props.slider[this.props.slider.length - 1]?.imageUrl
        }`,
        nextImageUrl: `${process.env.NEXT_PUBLIC_Slider_PREFIX}/${this.props.slider[1]?.imageUrl}`,
      };

      this.options = {
        dots: false,
        items: 1,
        className: "owl-theme",
        loop: true,
        navElement: "div",
        navText: [this.renderPrevNav(), this.renderNextNav()],
        nav: true,
        onTranslated: this.changeImageHandler,
        responsive: {
          0: {
            dots: true,
            navText: "",
          },
          900: {
            dots: false,
            navText: [this.renderPrevNav(), this.renderNextNav()],
          },
        },
      };
    } else {
      return null;
    }

    return (
      <>
        <section className="homeSlider d-none d-lg-block">
          {this.props.isLoading ? (
            <HomeSliderLoader />
          ) : (
            <OwlCarousel {...this.options}>
              {this.props.slider?.map((item, index) => {
                let link = "#";
                if (item.haveLink)
                  link = `/${this.props.curr}-${this.props.lang}/search?id=${item.sliderId}&type=${SEARCH_TYPE_SLIDER}`;

                return (
                  <div className="homeSlider__item" key={index}>
                    <Link href={link}>
                      <a>
                        <img
                          src={`${process.env.NEXT_PUBLIC_Slider_PREFIX}/${item.imageUrl}`}
                        />
                      </a>
                    </Link>
                  </div>
                );
              })}
            </OwlCarousel>
          )}
        </section>
        <section className="homeSlider d-lg-none d-block mobile">
          {this.props.isLoading ? (
            <HomeSliderLoader />
          ) : (
            <OwlCarousel {...this.options}>
              {this.props.slider?.map((item, index) => {
                let link = "#";
                if (item.haveLink)
                  link = `/${this.props.curr}-${this.props.lang}/search?id=${item.sliderId}&type=${SEARCH_TYPE_SLIDER}`;

                return (
                  <div className="homeSlider__item" key={index}>
                    <Link href={link}>
                      <a>
                        <img
                          src={`${process.env.NEXT_PUBLIC_Slider_PREFIX}/${item.responsiveImageUrl}`}
                        />
                      </a>
                    </Link>
                  </div>
                );
              })}
            </OwlCarousel>
          )}
        </section>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
  };
};

export default connect(mapStateToProps)(HomeSlider);
