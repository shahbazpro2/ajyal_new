import React, { useEffect, useRef, useState } from "react";
// import "./mobile-header.scss";
import logo from "../../../../assets/images/Logo.png";
import HeaderSearch from "./../../../../assets/icons/mobile/img-header-search.svg";
import HeaderCart from "./../../../../assets/icons/img-header-cart.svg";
import MenuIcon from "./../../../../assets/icons/img-header-menu.svg";
import { MobileMenu } from "../../../common";
import PanelMobileMenu from "../../../common/MobileMenu/PanelMobileMenu";
import { useSelector } from "react-redux";
import { selectLang, selectCurr } from "../../../../appConfigSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import classnames from "classnames";

const MobileHeader = (probs) => {
  // const location = useLocation();
  // console.log(probs)
  const router = useRouter();
  const weAreInPanel = router.asPath.includes("/panel");
  // weAreInPanel = location.pathname.includes("panel");
  const [isShownMenu, setIsShownMenu] = useState(false);
  const [searchCilck, setSearchClick] = useState(false);
  const [searchResultLoading, setSearchResultLoading] = useState(false);
  const mainManuRef = React.createRef();
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);

  const handleShowMenu = (value) => {
    if (!value) {
      document.body.style.overflowY = "auto";
    }
    setIsShownMenu(value);
  };


  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const removeResult = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSerach("");
      setSearchData([]);
      setSearchResultLoading(false);
      setSearchClick(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", removeResult);
    return () => {
      document.removeEventListener("mousedown", removeResult);
    };
  }, []);

  return (
    <div className="mobile-header" ref={wrapperRef}>
      <div className="row m-0">
        <div
          className={classnames("d-flex p-0", {
            "col": !searchCilck,
            "col-2": searchCilck,
          })}
          style={{ height: "100%" }}
        >
          <div className="mobile-header__menu">
            <a onClick={(event) => handleShowMenu(true, event)}>
              <img
                className="mobile-header-menu-open"
                src={MenuIcon}
                alt="MenuIcon"
              />
            </a>
            {/* <CSSTransition
              unmountOnExit
              mountOnEnter
              in={isShownMenu}
              timeout={250}
              classNames="nav-anime"
            > */}
            <div className="nav-anime">
              {isShownMenu === true ? (
                <>
                  {weAreInPanel ? (
                    <MobileMenu
                      content={probs.content}
                      allCategory={probs.allCategory}
                      lang={probs.lang}
                      currency={probs.currency}
                      isMainMenu={true}
                      closeMenu={() => handleShowMenu(false)}
                      userCheckIcon={probs.userCheckIcon}
                      data={probs.data}
                      logo={probs.logo}
                      userPanelNavi={
                        <PanelMobileMenu
                          mainManuRef={mainManuRef}
                          loc={probs.loc}
                          closeMenu={() => handleShowMenu(false)}
                        />
                      }
                      weAreInPanel={true}
                      mainManuRef={mainManuRef}
                    />
                  ) : (
                    <MobileMenu
                      logo={probs.logo}
                      content={probs.content}
                      allCategory={probs.allCategory}
                      lang={probs.lang}
                      currency={probs.currency}
                      isMainMenu={true}
                      closeMenu={() => handleShowMenu(false)}
                      data={probs.data}
                      userCheckIcon={probs.userCheckIcon}
                    />
                  )}
                </>
              ) : null}
            </div>
            {/* </CSSTransition> */}
          </div>
          {!searchCilck && (
            <div className="mobile-header__logo">
              {probs.logo && (
                <Link href={`/${curr}-${lang}/`}>
                  <a>
                    <img
                      src={`${process.env.NEXT_PUBLIC_LOGO_PREFIX}/${probs.logo}`}
                      alt="logo"
                    />
                  </a>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
