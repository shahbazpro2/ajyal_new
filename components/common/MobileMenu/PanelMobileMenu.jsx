import React from "react";
import { PanelNavi } from "../../app/pages/UserPanel/PanelLayouts";
// import "./PanelMobileMenu.scss";
import { ReactComponent as BackIcon } from "./../../../assets/icons/back.svg";
import { Translate } from "react-localize-redux";

export default ({ mainManuRef, closeMenu, loc }) => {
  const panelMenuRef = React.createRef();
  const handleClick = () => {
    mainManuRef.current.classList.add("mainMenu--active");
    panelMenuRef.current.classList.add("panelMenu--inactive");
  };
  return (
    <div ref={panelMenuRef} className="panelMenu">
      <header className="mapAddress__header mobile-panel__back-header">
        <a onClick={handleClick}>
          <BackIcon className="mapAddress__back-icon" />
          <span className="mapAddress__header-text mobile-panel__header-text">
            <Translate id="back-to-main-menu" />
          </span>
        </a>
      </header>
      <PanelNavi loc={loc} closeMenu={closeMenu} />
    </div>
  );
};
