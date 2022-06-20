import React from "react";
//import SearchIcon from './../../../../../assets/icons/search.svg';
import { connect } from "react-redux";
import TopCategoryItem from "./TopCategoryItem";
import "./TopCategoriesList.scss";
import "./TopCategoriesList-rtl.scss";
import dynamic from "next/dynamic";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });

class TopCategoriesList extends React.Component {
  constructor(props) {
    super(props);
    const getLang = this.props.lang;
    this.options = {
      dots: false,
      items: 9,
      className: "owl-theme",
      loop: false,
      navElement: "div",
      nav: false,
      responsive: {
        0: {
          dots: true,
          navText: "",
          items: 4,
        },
        900: {
          dots: false,
          items: 9,
        },
        1200: {
          dots: false,
          items: 12,
        },
      },
    };
  }

  render() {
    return (
      <section className="topCategoriesList">
        {this.props.headerTitleComponent}
        <div className="topCategoriesList__item-container d-none d-lg-block">
          <OwlCarousel {...this.options}>
            {this.props.data?.map((webModuleCollection, index) => {
              return (
                <TopCategoryItem
                  key={index}
                  itemId={webModuleCollection.collectionId}
                  text={webModuleCollection.collectionTypeTitle}
                  linkUrl={webModuleCollection.linkUrl}
                  haveLink={webModuleCollection.haveLink}
                  imageUrl={`${process.env.NEXT_PUBLIC_ModuleCollections_PREFIX}/${this.props.iModuleId}/${webModuleCollection.collectionId}/${webModuleCollection.imageUrl}`}
                />
              );
            })}
          </OwlCarousel>
        </div>
        <div className="topCategoriesList__item-container d-lg-none d-block mobile">
          <OwlCarousel {...this.options}>
            {this.props.data?.map((webModuleCollection, index) => {
              return (
                <TopCategoryItem
                  key={index}
                  itemId={webModuleCollection.collectionId}
                  text={webModuleCollection.collectionTypeTitle}
                  linkUrl={webModuleCollection.linkUrl}
                  haveLink={webModuleCollection.haveLink}
                  imageUrl={`${process.env.NEXT_PUBLIC_ModuleCollections_PREFIX}/${this.props.iModuleId}/${webModuleCollection.collectionId}/${webModuleCollection.responsiveImageUrl}`}
                />
              );
            })}
          </OwlCarousel>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.appConfig.lang.code,
  };
};

export default connect(mapStateToProps)(TopCategoriesList);
