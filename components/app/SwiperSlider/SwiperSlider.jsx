import React from "react";
import "./SwiperSlider.scss";
import "./SwiperSlider-rtl.scss";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import LazyLoad from "react-lazyload";
import { connect } from "react-redux";
import { selectCurr, selectLang } from "../../../appConfigSlice";
import { SEARCH_TYPE_MODULE } from "../../../lib/querys";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
class SwiperSlider extends React.Component {
  constructor(props) {
    super(props);
  }

  getColImage(webModuleCollection) {
    const images = !this.props.mobile ? (
      <img
        alt={webModuleCollection.collectionTitle}
        src={`${process.env.NEXT_PUBLIC_ModuleCollections_PREFIX}/${this.props.iModuleId}/${webModuleCollection.collectionId}/${webModuleCollection.imageUrl}`}
        className="images-container__img"
      />
    ) : (
      <img
        alt={webModuleCollection.collectionTitle}
        src={`${process.env.NEXT_PUBLIC_ModuleCollections_PREFIX}/${this.props.iModuleId}/${webModuleCollection.collectionId}/${webModuleCollection.responsiveImageUrl}`}
        className="images-container__img"
      />
    );

    return images;
  }

  render() {
    return (
      <Swiper spaceBetween={50} slidesPerView={1} navigation>
        {(
          this.props.data.map((webModuleCollection, index) => {
            return (
              
              <SwiperSlide>
                {webModuleCollection.haveLink !== true ? (
                  <Link
                    href={`/${this.props.curr}-${this.props.lang}/search?type=${SEARCH_TYPE_MODULE}&id=${webModuleCollection.collectionId}`}
                  >
                    <a>{this.getColImage(webModuleCollection)}</a>
                  </Link>
                ) : (
                  <a href={webModuleCollection.linkUrl} target="_blank">
                    {this.getColImage(webModuleCollection)}
                  </a>
                )}
              </SwiperSlide>
            );
          })
        )}
      </Swiper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
  };
};
export default connect(mapStateToProps)(SwiperSlider);
