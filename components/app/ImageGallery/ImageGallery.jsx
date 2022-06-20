import React from "react";
import "./ImageGallery.scss";
import "./ImageGallery-rtl.scss";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
// import Magnifier from "react-magnifier";
import ReactImageMagnify from "react-image-magnify";
// import jaro from "./../../data/jaro-gherez.jpg";
import { LandScapePhones, LandScapePhonesAndBigger } from "../../../Responsive";
import { connect } from "react-redux";
import { isRtl } from "../../../lib/isRtl";
import { selectLang } from "../../../appConfigSlice";
class ImageGalleryC extends React.Component {
  constructor(props) {
    super(props);

    const { firstImg, data, id } = this.props;

    this.images = [];
    this.images.push({
      original: `${process.env.NEXT_PUBLIC_Goods_PREFIX}/${id}/${firstImg}`,
      thumbnail: `${process.env.NEXT_PUBLIC_Goods_PREFIX}/${id}/${firstImg}`,
    });
    data?.forEach((img) => {
      this.images.push({
        original: `${process.env.NEXT_PUBLIC_Goods_PREFIX}/${id}/${img.documentUrl}`,
        thumbnail: `${process.env.NEXT_PUBLIC_Goods_PREFIX}/${id}/${img.documentUrl}`,
      });
    });

    this.showThumbnails = this.images.length > 1 ? true : false;

    // this.images = [
    //   {
    //     original: jaro,
    //     thumbnail: jaro,
    //   },
    //   {
    //     original: jaro,
    //     thumbnail: jaro,
    //   },
    //   {
    //     original: jaro,
    //     thumbnail: jaro,
    //   },
    // ];
  }
  myRenderItem = (props) => {
    return (
      <div>
        {/* <img src={props.original} className="image-gallery-image" /> // */}
        {/* <Magnifier
          mgShape="square"
          src={props.original}
          className="image-gallery-image"
        /> */}
        <ReactImageMagnify
          {...{
            enlargedImageContainerClassName: "zoomed-image-container",
            enlargedImagePortalId: "imageGalley-portal-magnifier",
            enlargedImageContainerDimensions: {
              width: "200%",
              height: "100%",
            },

            smallImage: {
              isFluidWidth: true,
              src: props.original,
            },
            largeImage: {
              src: props.original,
              width: 780,
              height: 1091,
            },
            shouldUsePositiveSpaceLens: true,
          }}
        />
      </div>
    );
  };

  render() {
    return (
      <div className="imagegallery">
        <LandScapePhonesAndBigger>
          <div>
            <ImageGallery
              lazyLoad
              isRTL={isRtl(this.props.lang)}
              renderItem={this.myRenderItem}
              showPlayButton={false}
              showNav={false}
              showThumbnails={this.showThumbnails}
              items={this.images}
              showFullscreenButton={false}
            />
          </div>
        </LandScapePhonesAndBigger>
        <LandScapePhones>
          <ImageGallery
            lazyLoad
            showPlayButton={false}
            showNav={false}
            items={this.images}
            showBullets={true}
            showThumbnails={false}
            showFullscreenButton={false}
          />
        </LandScapePhones>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
  };
};

export default connect(mapStateToProps)(ImageGalleryC);
