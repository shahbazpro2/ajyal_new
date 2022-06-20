import React, { useState } from "react";
//import classnames from "classnames";
// import "./SeeMore.scss";
//import "./SeeMore-rtl.scss";

export default ({ children, textOpen, maxHeight, textClose }) => {
  const [height, setheight] = useState("auto");

  const handleClick = (e) => {
    e.preventDefault();
    setheight(height === "auto" ? maxHeight : "auto");
  };

  return (
    <>
      <div className="seemore" style={{ "max-height": maxHeight }}>
        {children}
      </div>
      <a href="" onClick={handleClick} className="seemore__link">
        {height === "auto" ? textClose : textOpen}
      </a>
    </>
  );
};
