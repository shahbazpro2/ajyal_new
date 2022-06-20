import React from "react";
import LazyLoad from "react-lazyload";
import classnames from "classnames";
import { connect } from "react-redux";
import { selectCurr, selectLang } from "../../../appConfigSlice";
import { SEARCH_TYPE_MODULE } from "../../../lib/querys";
import Link from "next/link";
class ImgCols extends React.Component {
  constructor(props) {
    super(props);

    switch (this.props.selectedHeight) {
      case "135":
        this.height = "sm";
        break;
      case "190":
        this.height = "md";
        break;
      case "240":
        this.height = "lg";
      default:
        break;
    }

    this.is4 = this.props.data.length === 4;
    this.is6 = this.props.data.length === 6;
    this.is1 = this.props.data.length === 1;
    this.is2 = this.props.data.length === 2;
    this.is3 = this.props.data.length === 3;

    const { itemShadow, containerClass, itemClass, mobile } = props;
    this.itemClass = itemClass ? itemClass : "";
    this.containerClass = containerClass ? containerClass : "";
    this.shadow = itemShadow ? true : false;
    this.mobile = mobile;
  }


  getColImage(webModuleCollection) {
    const images =  
      !this.mobile ? (
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
      <aside className={`images-container no-gutters  ${this.containerClass}`}>
        {/* data is webHomeModuleList.webModuleCollections */}
        {this.props.data.map((webModuleCollection, index) => {
          return (
            <div
              key={index}
              className={classnames({
                "images-container__res": true,
                "col-6 col-lg-3 mt-3 mb-3": this.is4,
                "col-12": this.is1,
                "col-6 mt-3 mb-2": this.is2,
                "col-4 mt-3 mb-3": this.is3,
                "col-lg-2 col-4 p-3": this.is6,
              })}
            >
              <div
                className={classnames(
                  "images-container__art",
                  `images-container__art--${this.height}`,
                  this.itemClass,
                  {
                    "images-container__art--shadow": this.shadow,
                  }
                )}
              >
                <div href="/#" className="images-container__link">
                  <LazyLoad
                    height={200}
                    placeholder={
                      <div className="img-col-placeholder-cnt">
                        <img
                          className="img-col-placeholder"
                          src="/assets/imgs/img-placeholder.svg"
                        />
                      </div>
                    }
                  >
                  {webModuleCollection.haveLink !== true ? (
                    <Link
                      href={`/${this.props.curr}-${this.props.lang}/search?type=${SEARCH_TYPE_MODULE}&id=${webModuleCollection.collectionId}`}
                    >
                      
                      <a>
                        {this.getColImage(webModuleCollection)}
                      </a>

                    </Link>
                  ) : (
                    <a href={webModuleCollection.linkUrl} target="_blank">
                    {this.getColImage(webModuleCollection)}
                  </a>
                  )}  
                  </LazyLoad>
                </div>
              </div>
            </div>
          );
        })}
      </aside>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
  };
};
export default connect(mapStateToProps)(ImgCols);
