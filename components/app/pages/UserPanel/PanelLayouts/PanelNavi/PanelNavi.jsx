import React from "react";
// import "./PanelNavi.scss";
// import "./PanelNavi-rtl.scss";
/// import assets
import { ReactComponent as ProfileIcon } from "./../../../../../../assets/icons/menu - profile.svg";
import { ReactComponent as OrderIcon } from "./../../../../../../assets/icons/menu - orders.svg";
import { ReactComponent as AddressIcon } from "./../../../../../../assets/icons/menu - addresses.svg";
import { ReactComponent as PaymentIcon } from "./../../../../../../assets/icons/menu - payment.svg";
import { ReactComponent as CreditIcon } from "./../../../../../../assets/icons/menu - credit.svg";
import { ReactComponent as ReturnIcon } from "./../../../../../../assets/icons/menu - return.svg";
import { ReactComponent as PreferenceIcon } from "./../../../../../../assets/icons/menu - Preference.svg";
import { ReactComponent as ClaimsIcon } from "./../../../../../../assets/icons/menu - Claims.svg";
import { Translate } from "react-localize-redux";
import { connect, useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import Link from "next/link";
import classnames from "classnames";
import { removeTokenCookie } from "../../../../../../lib/helpers";
import { LOGOUT } from "../../../../../../appConfigSlice";
import { useRouter } from "next/router";

export default ({
  closeMenu,
  dontShowSignOut,
  loc,
  outOfReactRouter,
  accountDrop,
  weAreInPanel,
}) => {
  let url = loc;
  const dis = useDispatch();
  const router = useRouter();

  const handleCloseMobileMenu = () => {
    if (closeMenu) closeMenu();
  };

  const CrossLink = ({ children, ...props }) => {
    if (outOfReactRouter && !weAreInPanel)
      return (
        <Link href={props.href} as={props.as}>
          <a className={props.className}>{children}</a>
        </Link>
      );
    return <NavLink {...props}>{children}</NavLink>;
  };

  return (
    <nav
      className={classnames("user-panel-nav mobile", {
        accountDrop: accountDrop,
      })}
    >
      <ul className="user-panel-nav__list">
        <li className="user-panel-nav__item" onClick={handleCloseMobileMenu}>
          <CrossLink
            exact
            isActive={(match, location) => {
              if (location.pathname.includes(`${url}/profile`)) return true;
            }}
            to={`${url}/profile`}
            className="user-panel-nav__link"
            activeClassName="active"
            href={`/[lang-curr]/panel/profile`}
            as={`${url}/profile`}
          >
            <div className="user-panel-nav__itm-cnt">
              <ProfileIcon className="user-panel-nav__item-icon" />
              <span className="user-panel-nav__link-text">
                <Translate id="nav.profile" />
              </span>
            </div>
          </CrossLink>
        </li>
        <li className="user-panel-nav__item" onClick={handleCloseMobileMenu}>
          <CrossLink
            exact
            className="user-panel-nav__link"
            to={`${url}/orders`}
            activeClassName="active"
            isActive={(match, location) => {
              if (location.pathname.includes(`${url}/orders`)) return true;
            }}
            href={`/[lang-curr]/panel/orders`}
            as={`${url}/orders`}
          >
            <div className="user-panel-nav__itm-cnt">
              <OrderIcon className="user-panel-nav__item-icon" />
              <span className="user-panel-nav__link-text">
                <Translate id="nav.orders" />
              </span>
            </div>
          </CrossLink>
        </li>
        <li className="user-panel-nav__item" onClick={handleCloseMobileMenu}>
          <CrossLink
            exact
            isActive={(match, location) => {
              if (location.pathname.includes(`${url}/addresses`)) return true;
            }}
            className="user-panel-nav__link"
            to={`${url}/addresses`}
            activeClassName="active"
            href={`/[lang-curr]/panel/addresses`}
            as={`${url}/addresses`}
          >
            <div className="user-panel-nav__itm-cnt">
              <AddressIcon className="user-panel-nav__item-icon" />
              <span className="user-panel-nav__link-text">
                <Translate id="nav.address" />
              </span>
            </div>
          </CrossLink>
        </li>
        <li className="user-panel-nav__item" onClick={handleCloseMobileMenu}>
          <CrossLink
            exact
            className="user-panel-nav__link"
            to={`${url}/payment`}
            activeClassName="active"
            href={`/[lang-curr]/panel/payment`}
            as={`${url}/payment`}
          >
            <div className="user-panel-nav__itm-cnt">
              <PaymentIcon className="user-panel-nav__item-icon" />
              <span className="user-panel-nav__link-text">
                <Translate id="nav.payment" />
              </span>
            </div>
          </CrossLink>
        </li>
        <li className="user-panel-nav__item" onClick={handleCloseMobileMenu}>
          <CrossLink
            exact
            className="user-panel-nav__link"
            to={`${url}/credits`}
            activeClassName="active"
            href={`/[lang-curr]/panel/credits`}
            as={`${url}/credits`}
          >
            <div className="user-panel-nav__itm-cnt">
              <CreditIcon className="user-panel-nav__item-icon" />
              <span className="user-panel-nav__link-text">
                <Translate id="nav.credit" />
              </span>
            </div>
          </CrossLink>
        </li>
        <li className="user-panel-nav__item" onClick={handleCloseMobileMenu}>
          <CrossLink
            exact
            className="user-panel-nav__link"
            to={`${url}/returns`}
            activeClassName="active"
            isActive={(match, location) => {
              if (location.pathname.includes(`${url}/returns`)) return true;
            }}
            href={`/[lang-curr]/panel/returns`}
            as={`${url}/returns`}
          >
            <div className="user-panel-nav__itm-cnt">
              <ReturnIcon className="user-panel-nav__item-icon" />
              <span className="user-panel-nav__link-text">
                <Translate id="nav.return" />
              </span>
            </div>
          </CrossLink>
        </li>
        <li className="user-panel-nav__item" onClick={handleCloseMobileMenu}>
          <CrossLink
            exact
            className="user-panel-nav__link"
            to={`${url}/preference`}
            activeClassName="active"
            href={`/[lang-curr]/panel/preference`}
            as={`${url}/preference`}
          >
            <div className="user-panel-nav__itm-cnt user-panel-nav__itm-cnt--last">
              <PreferenceIcon className="user-panel-nav__item-icon" />
              <span className="user-panel-nav__link-text">
                <Translate id="nav.preference" />
              </span>
            </div>
          </CrossLink>
        </li>
        {/* <li className="user-panel-nav__item" onClick={handleCloseMobileMenu}>
          <CrossLink
            exact
            className="user-panel-nav__link"
            to={`${url}/claims`}
            activeClassName="active"
            href={`/[lang-curr]/panel/claims`}
            as={`${url}/claims`}
          >
            <div className="user-panel-nav__itm-cnt user-panel-nav__itm-cnt--last">
              <ClaimsIcon className="user-panel-nav__item-icon" />
              <span className="user-panel-nav__link-text">
                <Translate id="nav.claims" />
              </span>
            </div>
          </CrossLink>
        </li> */}
      </ul>
      {!dontShowSignOut && (
        <div className="user-panel-nav__signout">
          <a
            href="/#"
            className="user-panel-nav__signout-text"
            onClick={(e) => {
              e.preventDefault();
              removeTokenCookie();
              //dis({ type: LOGOUT });
              router.reload();
            }}
          >
            <Translate id="nav.signout" />
          </a>
        </div>
      )}
    </nav>
  );
};
