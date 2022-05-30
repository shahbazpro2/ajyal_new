import React from "react";

import { connect } from "react-redux";
// import { withLocalize } from "react-localize-redux";

/// import assets
import { ReactComponent as InformaionIcon } from "./../../../assets/icons/Help.svg";
import { ReactComponent as MailIcon } from "./../../../assets/icons/Email.svg";
import { ReactComponent as WhatsappIcon } from "./../../../assets/icons/whatsapp-icon.svg";
import { ReactComponent as PhoneIcon } from "./../../../assets/icons/phone-icon.svg";
import { ReactComponent as FacebookIcon } from "./../../../assets/icons/social-media/facebook.svg";
import { ReactComponent as TwitterIcon } from "./../../../assets/icons/social-media/twitter.svg";
import { ReactComponent as InstagramIcon } from "./../../../assets/icons/social-media/instagram.svg";
import { ReactComponent as LinkedinIcon } from "./../../../assets/icons/social-media/linkdin.svg";
import appStoreImg from "./../../../assets/images/app-store.png";
import googlePlay from "./../../../assets/images/google-play.png";
import appStoreImgAr from "./../../../assets/images/app-store-ar.png";
import googlePlayAr from "./../../../assets/images/google-play-ar.png";
import american from "./../../../assets/icons/Footer/img-american.svg";
import visa from "./../../../assets/icons/Footer/img-visa.svg";
import mastercard from "./../../../assets/icons/Footer/img-mastercard.svg";
import cash from "./../../../assets/icons/Footer/img-cash.svg";
import paypal from "./../../../assets/icons/Footer/img-paypal.svg";
import credimax from "./../../../assets/icons/Footer/img-credimax.svg";
import sadad from "./../../../assets/icons/Footer/img-sadad.svg";
import Link from "next/link";
import { selectLang, selectCurr } from "../../../appConfigSlice";
import { Translate } from "react-localize-redux";
import { SEARCH_TYPE_CATEGORY } from "../../../lib/querys";
import ActiveLink from "./../../common/ActiveLink/ActiveLink";
import AccountIcon from "./../../../assets/icons/mobile/bottomTabs/account.svg";
import CartIcon from "./../../../assets/icons/mobile/bottomTabs/cart.svg";
import CategoriesIcon from "./../../../assets/icons/mobile/bottomTabs/categories.svg";
import HomeIcon from "./../../../assets/icons/mobile/bottomTabs/home.svg";
import DealsIcon from "./../../../assets/icons/mobile/bottomTabs/deals.svg";
import {
  addCartCount,
  selectCartCount,
} from "../pages/CartAndWishlist/cartAndWishlistSlice";
class AppFooter extends React.Component {
  constructor(props) {
    super(props);
    this.data = this.props.data;
    this.links = this.props.data.links ? this.props.data.links : {};
    this.lang = this.props.lang;
  }

  render() {
    return (
      <footer className="footer  p-0">
        <section className="footer__top-container">
          <div className="container siteWidthContainer">
            <div className="footer__top-list row">
              <div className="col-xl-4 col-12 footer__top-item footer__top-item--first">
                <p className="footer__top-left-text">
                  <Translate id="footer.footer-msg1" />
                </p>
                <p className="footer__btn-left-text">
                  <Translate id="footer.footer-msg2" />
                </p>
              </div>
              <div className="col-xl-8 col-12">
                <div className="row footer__mobile-style">
                  <div className="footer__top-item col-12 col-lg-3">
                    <InformaionIcon className="footer__top-icon" />
                    <Link href={`/${this.props.curr}-${this.props.lang}/hc`}>
                      <a className="top-item-info">
                        <p className="footer__t-text">
                          <Translate id="footer.helpCenter" />
                        </p>
                        <span className="footer__b-text">
                          {this.links.address}
                        </span>
                      </a>
                    </Link>
                  </div>
                  <div className="footer__top-item col-12 col-lg-3">
                    <MailIcon className="footer__top-icon" />
                    <div className="top-item-info">
                      <p className="footer__t-text">
                        <Translate id="footer.emailSupport" />
                      </p>
                      <span className="footer__b-text">{this.links.email}</span>
                    </div>
                  </div>
                  <div className="footer__top-item col-12 col-lg-3">
                    <PhoneIcon className="footer__top-icon" />
                    <div className="top-item-info">
                      <p className="footer__t-text">
                        <Translate id="footer.phoneSupport" />
                      </p>
                      <span className="footer__b-text">{this.links.phone}</span>
                    </div>
                  </div>
                  <div className="footer__top-item col-12 col-lg-3">
                    <WhatsappIcon className="footer__top-icon" />
                    <div className="top-item-info">
                      <p className="footer__t-text">
                        <Translate id="footer.whatsAppUs" />
                      </p>
                      <span className="footer__b-text">
                        {this.links.supportPhone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          className="siteWidthContainer container-home"
          style={{ margin: "0 auto" }}
        >
          <section className="footer__btm-container ">
            <div className="footer__list-cnt row">
              {this.data.footer &&
                this.data.footer.map((cat) => {
                  return (
                    <ul
                      className="footer__md-list col-md-2"
                      key={cat.categoryId}
                    >
                      <h3 className="footer__list-header">
                        {cat.categoryTitle}
                      </h3>
                      {cat.childs &&
                        cat.childs.map((child) => {
                          let allLink = "#";
                          if (child.haveWebPage) {
                            allLink = `/${this.props.curr}-${this.props.lang}/category/${child.categoryId}`;
                          } else {
                            allLink = `/${this.props.curr}-${this.props.lang}/search?id=${child.categoryId}&type=${SEARCH_TYPE_CATEGORY}`;
                          }
                          return (
                            <li
                              key={child.categoryId}
                              className="footer__list-item"
                            >
                              <Link href={allLink}>
                                <a className="footer__list-link">
                                  {child.categoryTitle}
                                </a>
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  );
                })}
            </div>
          </section>
          <section className="pr-5 pl-5">
            <div className="footer__nt-container row">
              <div className="footer__nt-left col-12 col-xl-6 mb-5">
                <h4 className="footer__nt-header">
                  <Translate id="footer.ShopOnTheGo" />
                </h4>
                <div className="d-flex justify-content-center">
                  <a href="">
                    <img
                      alt=""
                      src={this.lang[1] === "ar" ? appStoreImgAr : appStoreImg}
                      className="footer__nt-img"
                    />
                  </a>
                  <a href="">
                    <img
                      alt=""
                      src={this.lang[1] === "ar" ? googlePlayAr : googlePlay}
                      className="footer__nt-img"
                    />
                  </a>
                </div>
              </div>
              <div className="footer__nt-right col-12 col-xl-6">
                <h4 className="footer__nt-header footer__nt-header--margin">
                  <Translate id="footer.ConnectWithUs" />
                </h4>
                <ul className="footer__nt-icon-list">
                  <li>
                    <a
                      target="_blank"
                      className="footer__nt-icon-container footer__nt-icon-container--facebook"
                      href={this.links.facebookUrl}
                    >
                      <FacebookIcon />
                    </a>
                  </li>
                  <li>
                    <a
                      className="footer__nt-icon-container"
                      href={this.links.twitterUrl}
                      target="_blank"
                    >
                      <TwitterIcon />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      className="footer__nt-icon-container"
                      href={this.links.instagramUrl}
                    >
                      <InstagramIcon />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      className="footer__nt-icon-container"
                      href={this.links.linkedinUrl}
                    >
                      <LinkedinIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        <section className="footer__btm2-container">
          <div
            className="container siteWidthContainer container-home footer__btm2-container--flex row"
            style={{ margin: "0 auto" }}
          >
            <div className="footer__btm2-left col-12 col-xl-5 justify-content-center">
              <p className="footer__btm2-text ">
                <Translate id="footer.copyRight" />
              </p>
              <img
                src={paypal}
                alt="paypal"
                title=""
                className="footer__btm2-img"
              />
              <img src={credimax} alt="credimax" className="footer__btm2-img" />
              <img src={sadad} alt="sadad" className="footer__btm2-img" />
              <img src={american} alt="american" className="footer__btm2-img" />
              <img src={cash} alt="cash" className="footer__btm2-img" />
              <img src={visa} alt="visa" className="footer__btm2-img" />
              <img
                src={mastercard}
                alt="mastercard"
                className="footer__btm2-img"
              />
            </div>
            <div className="footer__btm2-right col-12 col-xl-7">
              <div className="footer__desktop-end">
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/CustomerRights`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.Careers" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/WarrantyPolicy`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.warrantyPolicy" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/becomeSeller`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.sellWithUs" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/TermsOfUse`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.termOfUse" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/TermsOfSale`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.termsOfSale" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/PrivacyPolicy`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.privacyPolicy" />
                  </a>
                </Link>
                {/* {this.content.bottom.list.map((text, index) => {
                  return (
                    <a href="" key={index} className="footer__btm2-link">
                      {text}
                    </a>
                  );
                })} */}
              </div>
              <div className="footer__mobile-end row">
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/CustomerRights`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.Careers" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/WarrantyPolicy`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.warrantyPolicy" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/becomeSeller`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.sellWithUs" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/TermsOfUse`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.termOfUse" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/TermsOfSale`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.termsOfSale" />
                  </a>
                </Link>
                <Link
                  href={`/${this.props.curr}-${this.props.lang}/content/PrivacyPolicy`}
                >
                  <a className="footer__btm2-link">
                    <Translate id="footer.btm-nav.privacyPolicy" />
                  </a>
                </Link>

                <div className="col-12 text-center">
                  <p className="footer__btm2-text-mobile">
                    <Translate id="footer.chat" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!this.props.isDesktop && (
          <div style={{ marginTop: "100px" }}>
            <nav className="footer__nav">
              <ActiveLink
                activeClassName="active-footer"
                href={`/${this.props.curr}-${this.props.lang}`}
              >
                <a href="">
                  <span>
                    <HomeIcon />
                  </span>
                  <span>
                    <Translate id="footer.btm-nav.home" />
                  </span>
                </a>
              </ActiveLink>

              <ActiveLink
                activeClassName="active-footer"
                href={`/${this.props.curr}-${this.props.lang}/categories`}
              >
                <a href="">
                  <span>
                    <CategoriesIcon />
                  </span>
                  <span>
                    <Translate id="footer.btm-nav.category" />
                  </span>
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName="active-footer"
                href={`/${this.props.curr}-${this.props.lang}/search?type=5`}
              >
                <a href="">
                  <span>
                    <DealsIcon />
                  </span>
                  <span>
                    <Translate id="footer.btm-nav.deals" />
                  </span>
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName="active-footer"
                href={`/${this.props.curr}-${this.props.lang}/panel`}
              >
                <a href="">
                  <span>
                    <AccountIcon />
                  </span>
                  <span>
                    <Translate id="footer.btm-nav.profile" />
                  </span>
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName="active-footer"
                href={`/${this.props.curr}-${this.props.lang}/cart`}
              >
                <a
                  href={`/${this.props.curr}-${this.props.lang}/cart`}
                  className="iconContainer"
                >
                  <div style={{ position: "relative" }}>
                    <span>
                      <CartIcon />
                      {this.props.cartCount > 0 && (
                        <span className="cart-mobile-counter">
                          {this.props.cartCount}
                        </span>
                      )}
                    </span>
                  </div>
                  <span>
                    <Translate id="footer.btm-nav.cart" />
                  </span>
                </a>
              </ActiveLink>
            </nav>
          </div>
        )}
      </footer>
    );
  }
}

const mapDispatchToProps = {
  addCartCount,
};

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    cartCount: selectCartCount(state),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppFooter);
