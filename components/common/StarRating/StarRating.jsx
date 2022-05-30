import React from "react";
import StarRatingComponent from "react-star-rating-component";
import starIcon from "./../../../assets/icons/img-star.svg";
import starGrayIcon from "./../../../assets/icons/img-star-gray.svg";

const renderStarIcon = (index, value) => {
  return (
    <img
      alt="star"
      className="goodItem-s2__star"
      src={index <= value ? starIcon : starGrayIcon}
    />
  );
};

export default ({ nextText, ...props }) => {
  return (
    <div className="goodItem-s2__star-container">
      <StarRatingComponent {...props} renderStarIcon={renderStarIcon} />
      <span className="goodItem-s2__start-count">
        {/* ( 214 <Translate id="reviews" /> ) */}
        {nextText}
      </span>
    </div>
  );
};
