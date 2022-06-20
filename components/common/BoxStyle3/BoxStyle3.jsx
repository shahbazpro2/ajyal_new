import React from "react";
// import "./BoxStyle1.scss";
// import "./BoxStyle1-rtl.scss";

export default ({ children, headerContent, className }) => {
  return (
    <div className={`boxStyle3 ${className ? className : ''}`}>
      <header className="boxStyle3__header">
        <span className="boxStyle3__border"></span>
        {typeof headerContent === "string" ? (
          <h2 className="boxStyle3__header-text">{headerContent}</h2>
        ) : (
          headerContent
        )}
      </header>
      {children}
    </div>
  );
};
