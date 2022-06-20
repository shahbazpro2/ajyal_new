import React from "react";
// import "./BoxStyle2.scss";
// import "./BoxStyle2-rtl.scss";

export default ({ children, headerContent, className}) => {
  return (
    <div className={`boxStyle2 ${className ? className : ''}`}>
      { headerContent && headerContent}
      {children}
    </div>
  );
};
