import React from "react";
// import './MobileItemDrop.scss'
import itemDropIcon from "./../../../assets/icons/img-open-menu.svg";

export default ({ children }) => {
  return (
    <div className="mobile-drop">
      <img src={itemDropIcon} alt="drop icon" className="mobile-drop__icon" />
      <div className="mobile-drop__content">{children}</div>
    </div>
  );
};
