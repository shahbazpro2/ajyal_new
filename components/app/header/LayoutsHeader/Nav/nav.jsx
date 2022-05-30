import React, { useState, useRef } from "react";
import { ReactComponent as HomeIcon } from "./../../../../../assets/icons/house.svg";
import { ReactComponent as HeaderDealsIcon } from "./../../../../../assets/icons/header-deals.svg";
import { ReactComponent as OrderTrackingIcon } from "./../../../../../assets/icons/header-OrderTracking.svg";
import { ReactComponent as HelpIcon } from "./../../../../../assets/icons/header-help.svg";
import { ReactComponent as StoreIcon } from "./../../../../../assets/icons/header-store.svg";
import { ReactComponent as HeaderIcon } from "./../../../../../assets/icons/header-menu.svg";
import { ReactComponent as StoreIcon2 } from "./../../../../../assets/icons/store-icon.svg";

import { ReactComponent as HeaderIconDown } from "./../../../../../assets/icons/header-arrow-down.svg";
import Item from "./Items/item";
import Category from "./Category/category";
import { connect, useSelector } from "react-redux";
import { selectCurr, selectLang } from "../../../../../appConfigSlice";
import Link from "next/link";
import { Translate } from "react-localize-redux";
import { SEARCH_TYPE_DEAL } from "../../../../../lib/querys";

const Nav = (props) => {
  // نشان دادن دسته بندی
  const [isShownCategory, setIsShownCategory] = useState(false);
  const [delayHandler, setDelayHandler] = useState(null);
  const DropRef = useRef();
  const lang = useSelector(selectLang);
  const curr = useSelector(selectCurr);
  const handleMouseEnter = (event) => {
    setDelayHandler(
      setTimeout(() => {
        DropRef.current.style.display = "block";
      }, 200)
    );
  };

  const handleMouseLeave = () => {
    DropRef.current.style.display = "none";
    clearTimeout(delayHandler);
  };

  const closeMenu = () => {
    DropRef.current.style.display = "none";
    clearTimeout(delayHandler);
  };

  return (
    <div onMouseLeave={handleMouseLeave} style={{ backgroundColor: "#E2E2E2" }}>
      <nav className="nav p-0 container siteWidthContainer">
        <ul className="nav__list m-0 ">
          <li
            className="nav__item nav__item--first"
            onMouseEnter={handleMouseEnter}
          >
            <Item
              content={props.content("category")}
              isCategory={true}
              icon={<HeaderIcon className="nav__item-svg" />}
              downIcon={<HeaderIconDown />}
            />
          </li>
          <li className="nav__item nav__item--secound">
            <Link href={`/${curr}-${lang}`}>
              <a>
                <Item
                  content={props.content("homeItem")}
                  isCategory={false}
                  icon={<HomeIcon className="nav__item-svg" />}
                />
              </a>
            </Link>
          </li>
          <li className="nav__item">
            <Link href={`/${curr}-${lang}/search?type=${SEARCH_TYPE_DEAL}`}>
              <a>
                <Item
                  content={props.content("dealsItem")}
                  isCategory={false}
                  icon={<HeaderDealsIcon className="nav__item-svg" />}
                />
              </a>
            </Link>
          </li>
          <li className="nav__item">
            <Link href={`/${curr}-${lang}/tracking`}>
              <a>
                <Item
                  content={props.content("orderTrackingItem")}
                  isCategory={false}
                  icon={<OrderTrackingIcon className="nav__item-svg" />}
                />
              </a>
            </Link>
          </li>
          <li className="nav__item">
            <Link href={`/${curr}-${lang}/hc`}>
              <a>
                <Item
                  content={props.content("helpCenterItem")}
                  isCategory={false}
                  icon={<HelpIcon className="nav__item-svg" />}
                />
              </a>
            </Link>
          </li>
          <li className="nav__item">
            <Link href={`/${curr}-${lang}/vendors`}>
              <a>
                <Item
                  content={<Translate id="main-nav.storeList" />}
                  isCategory={false}
                  icon={<StoreIcon2 className="nav__item-svg" />}
                />
              </a>
            </Link>
          </li>
          <li className="nav__item nav__item--last">
            <Link href={`/${curr}-${lang}/becomeSeller`}>
              <a>
                <Item
                  content={props.content("sellWithUsItem")}
                  isCategory={false}
                  icon={<StoreIcon className="nav__item-svg" />}
                />
              </a>
            </Link>
          </li>

          {/* <li className="nav__item"><a href="" className="nav__link "><span className="nav__link-text">Pets Supplies</span></a></li> */}
        </ul>
      </nav>

      <div ref={DropRef} style={{ display: "none" }}>
        <div className="web-category-overlay"></div>
        <div onMouseLeave={handleMouseLeave}>
          <Category
            closeHomeMenu={closeMenu}
            data={props.data?.categories}
            type="web"
            categoryContent={props.allCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default Nav;
