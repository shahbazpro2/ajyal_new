import React from "react";
import { Translate } from "react-localize-redux";
import Backicon from "../../../../../assets/icons/back-dark.svg";
import logo from "../../../../../assets/images/logo-2.png";

const MobileBack = ({
  onBack = () => {},
  onCancel = () => {},
  showCancel = false,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mobile-back">
      <div className="d-flex align-items-center">
        <Backicon className="mobile-back__back-icon" onClick={onBack} />
        <img className="mobile-back__img" src={logo} alt="logo.." />
      </div>
      <div>
        {showCancel && <Translate onClick={onCancel} id="common.cancel" />}
      </div>
    </div>
  );
};

export default MobileBack;
