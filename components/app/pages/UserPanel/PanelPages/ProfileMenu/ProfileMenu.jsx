import React from "react";
import { connect } from "react-redux";
import { Link as ReactRouterLink } from "react-router-dom";
import {
  selectCurr,
  selectLang,
  selectLogin,
} from "../../../../../../appConfigSlice";
import {
  selectCartCount,
  selectWishCount,
} from "../../../CartAndWishlist/cartAndWishlistSlice";
// import Link from "next/link";
import AccountIcon from "../../../../../../assets/icons/mobile/account-profile.svg";
import AccountIconSignUp from "../../../../../../assets/icons/mobile/account-signup.svg";
import logo from "../../../../../../assets/images/logo-2.png";
import { Translate } from "react-localize-redux";
import TopMenuItem from "./TopMenuItem";
import MenuItem from "./MenuItem";
import { removeTokenCookie } from "../../../../../../lib/helpers";
import { withRouter } from "next/router";
import {
  showNextCurr,
  showNextLang,
  switchCurr,
  switchLang,
} from "../../../../../../lib/switch";

// menu icons
import CurrencyIcon from "../../../../../../assets/icons/mobile/account-region.svg";
import LangIcon from "../../../../../../assets/icons/mobile/account-language.svg";
import HelpIcon from "../../../../../../assets/icons/mobile/account-help.svg";
import ContactIcon from "../../../../../../assets/icons/mobile/account-contact.svg";
import OrderIcon from "../../../../../../assets/icons/mobile/account-orders.svg";
import ReturnsIcon from "../../../../../../assets/icons/mobile/account-returns.svg";
import CreditsIcon from "../../../../../../assets/icons/mobile/account-credits.svg";
import PreferenceIcon from "../../../../../../assets/icons/mobile/account-preference.svg";
import WhatsApp from "../../../../../../assets/icons/mobile/whatsapp.svg";
import AddressIcon from "../../../../../../assets/icons/mobile/account-addresses.svg";
import PaymentIcon from "../../../../../../assets/icons/mobile/account-payment.svg";
// import ClaimsIcon from "../../../../../../assets/icons/mobile/account-claims.svg";
import ProfileIcon from "../../../../../../assets/icons/mobile/account-profile-blank.svg";
import WhishListIcon from "../../../../../../assets/icons/mobile/like.svg";
import SignOut from "../../../../../../assets/icons/mobile/sign-out.svg";
import StoresIcon from "../../../../../../assets/icons/mobile/store.svg";

class ProfileMenu extends React.Component {
  constructor(props) {
    super(props);
    this.path = props.location.pathname;
  }

  generatePanelLink(text) {
    return this.path + "/" + text;
  }

  handleSignOut = (e) => {
    e.preventDefault();
    removeTokenCookie();
    this.props.router.reload();
  };

  render() {
    return (
      <div className="mobile-profile__cnt">
        <header className="mobile-profile__menu-header">
          <div className="d-flex mobile-profile__head align-items-center">
            <img src={logo} alt="logo" />
            <div className="ml-5">
              <h3>
                {!this.props.isLogin ? (
                  <Translate id="mobile-profile.hala" />
                ) : (
                  <>
                    <Translate id="mobileProfile.hala2" />
                    {this.props.customerName}
                  </>
                )}
              </h3>
              <p>
                <Translate id="mobile-profile.hala-des" />
              </p>
            </div>
          </div>

          <nav className="mobile-profile__menu-top-nav  mobile-profile--shadow d-flex justify-content-around align-items-center">
            {this.props.isLogin && (
              <>
                <TopMenuItem
                  href="/[lang-curr]/panel/orders"
                  link={this.generatePanelLink("orders")}
                  icon={<OrderIcon />}
                  text={<Translate id="nav.orders" />}
                  isReactRouter
                />
                <TopMenuItem
                  href="/[lang-curr]/panel/returns"
                  link={this.generatePanelLink("returns")}
                  icon={<ReturnsIcon />}
                  text={<Translate id="nav.return" />}
                  isReactRouter
                />
                <TopMenuItem
                  href="/[lang-curr]/panel/credits"
                  link={this.generatePanelLink("credits")}
                  icon={<CreditsIcon />}
                  text={<Translate id="nav.credit" />}
                  isReactRouter
                />
                <TopMenuItem
                  href="/[lang-curr]/vendors"
                  link={`/${this.props.curr}-${this.props.lang}/vendors`}
                  icon={<StoresIcon />}
                  text={<Translate id="mobileProfile.stores" />}
                />
              </>
            )}
            {!this.props.isLogin && (
              <>
                <TopMenuItem
                  href="/[lang-curr]/Auth"
                  link={`/${this.props.curr}-${this.props.lang}/Auth`}
                  icon={<AccountIcon />}
                  text={<Translate id="signin2" />}
                />
                <TopMenuItem
                  href="/[lang-curr]/Auth?signup"
                  link={`/${this.props.curr}-${this.props.lang}/Auth?signup`}
                  icon={<AccountIconSignUp />}
                  text={<Translate id="signup" />}
                />
              </>
            )}
          </nav>
        </header>

        {this.props.isLogin && (
          <div className="mobile-profile__nav-sec">
            <div className="mobile-profile__nav-title">
              <span className="mobile-profile__nav-title--border"></span>
              <h4>
                <Translate id="mobileProfile.my-account" />
              </h4>
            </div>
            <ul className="mobile-profile__nav-list mobile-profile--shadow">
              <MenuItem
                icon={<WhishListIcon />}
                text={<Translate id="wishlist" />}
                badge={this.props.wishCount}
                isReactRouter={false}
                href="/[lang-curr]/cart"
                link={`/${this.props.curr}-${this.props.lang}/cart`}
              />
              <MenuItem
                icon={<AddressIcon />}
                text={<Translate id="nav.address" />}
                link={this.generatePanelLink("addresses")}
              />
              <MenuItem
                icon={<PaymentIcon />}
                text={<Translate id="nav.payment" />}
                link={this.generatePanelLink("payment")}
              />

              {/* <MenuItem
                icon={<ClaimsIcon />}
                text={<Translate id="nav.claims" />}
                link={this.generatePanelLink("payment")}

              /> */}

              <MenuItem
                icon={<ProfileIcon />}
                text={<Translate id="nav.profile" />}
                link={this.generatePanelLink("profile")}
              />
            </ul>
          </div>
        )}

        <div className="mobile-profile__nav-sec">
          <div className="mobile-profile__nav-title">
            <span className="mobile-profile__nav-title--border"></span>
            <h4>
              <Translate id="mobileProfile.settings" />
            </h4>
          </div>
          <ul className="mobile-profile__nav-list mobile-profile--shadow">
            <MenuItem
              icon={<CurrencyIcon />}
              text={<Translate id="mobileProfile.currency" />}
              value={showNextCurr(this.props.curr)}
              onClick={(e) => {
                e.preventDefault();
                switchCurr(this.path, true);
              }}
            />
            <MenuItem
              icon={<LangIcon />}
              text={<Translate id="mobileProfile.language" />}
              value={showNextLang(this.props.lang)}
              onClick={(e) => {
                e.preventDefault();
                switchLang(this.path, true);
              }}
            />
            {this.props.isLogin && (
              <MenuItem
                icon={<PreferenceIcon />}
                text={<Translate id="nav.preference" />}
                link={this.generatePanelLink("preference")}
                // value={BH}
              />
            )}
          </ul>
        </div>

        <div className="mobile-profile__nav-sec">
          <div className="mobile-profile__nav-title">
            <span className="mobile-profile__nav-title--border"></span>
            <h4>
              <Translate id="mobileProfile.reach-out-us" />
            </h4>
          </div>
          <ul className="mobile-profile__nav-list mobile-profile--shadow">
            <MenuItem
              icon={<WhatsApp />}
              text={<Translate id="mobileProfile.whatsup-us" />}
            />
            <MenuItem
              icon={<HelpIcon />}
              text={<Translate id="mobileProfile.help" />}
              isReactRouter={false}
              href="/[lang-curr]/hc"
              link={`/${this.props.curr}-${this.props.lang}/hc`}
            />

            <MenuItem
              icon={<ContactIcon />}
              text={<Translate id="mobileProfile.contact-us" />}
              // link={this.generatePanelLink("preference")}
              // value={BH}
            />
          </ul>
        </div>

        {this.props.isLogin && (
          <button
            className="d-flex align-items-center mobile-profile__signout-btn"
            onClick={this.handleSignOut}
          >
            <SignOut />
            <span className="mx-4">
              <Translate id="nav.signout" />
            </span>
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLogin: selectLogin(state).isLogin,
    lang: selectLang(state),
    curr: selectCurr(state),
    cartCount: selectCartCount(state),
    wishCount: selectWishCount(state),
  };
};

export default connect(mapStateToProps)(withRouter(ProfileMenu));
