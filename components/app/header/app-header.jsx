import React from "react";
import SearchInput from "./LayoutsHeader/SearchInput/SearchInput";
import logo from "../../../assets/images/logo-2.png";
import UserCheckIcon from "./../../../assets/icons/img-header-profile.svg";
import HeartOutlineIcon from "./../../../assets/icons/img-header-heart.svg";
import BuyButtonIcon from "./../../../assets/icons/img-header-cart.svg";
import arrowdownLight from "./../../../assets/icons/img-header-arrow-down-light.svg";
import { SelectBox } from "../../common";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
import Link from "next/link";
import { withRouter } from "next/router";
import { selectCurr, selectLang, selectLogin } from "../../../appConfigSlice";
import {
  selectCartCount,
  selectWishCount,
  addWishCount,
  addCartCount,
} from "../pages/CartAndWishlist/cartAndWishlistSlice";
import { client_fetchCart } from "../../../lib/api/client/clientCart";
import { requestFirebaseNotificationPermission } from "../../../firebaseInit.js";
import { client_updateUserNotificationKey } from "../../../lib/api/client/clientCommon";
import { client_getHomeSerachAutoComplete } from "../../../lib/api/client/clientHome";
import SearchSugestion from "./LayoutsHeader/SearchInput/SearchSugestion/SearchSugestion";
import SearchIcon from "./../../../assets/icons/search-gray.svg";
import Nav from "./LayoutsHeader/Nav/nav";
import { getCookie, setCookies } from "cookies-next";
class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    //this code is for Development purpose
    this.activeCurrency = this.props.curr;
    this.lang = this.props.lang;
    this.activeLang = { code: this.props.lang };
    this.data = this.props.data;

    this.inputRef = React.createRef();
  }

  state = {
    showSelectBoxLang: false,
    showSelectBoxCurrency: false,
    showAccountBox: false,
    searchCilck: false,
    search: "",
    searchResultLoading: false,
    searchData: [],
  };

  async componentDidMount() {
    (async () => {
      const res = await client_fetchCart('', '', '', '')
      this.props.addCartCount(res?.result?.items?.length)
      setCookies('cartCount', res?.result?.items?.length)
    })()
    this.props.addWishCount(this.props.data?.wishListCount);

    let isSafari = false;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
        // alert("1"); // Chrome
      } else {
        // alert("2"); // Safari
        isSafari = true;
      }
    }

    if (!isSafari) {
      requestFirebaseNotificationPermission()
        .then((firebaseToken) => {
          // eslint-disable-next-line no-console
          console.log("Firebase Toke: ", firebaseToken);
          if (firebaseToken && this.props.isLogin == true) {
            console.log("Send token to server");
            client_updateUserNotificationKey(firebaseToken);
          }
        })
        .catch((err) => {
          return err;
        });
    }
  }

  handleSearchChange = async (e) => {
    const value = e.target.value;
    this.setState({
      search: value,
      searchResultLoading: true,
    });
    try {
      const result = await client_getHomeSerachAutoComplete(value);
      if (result.result.goods.length != 0) {
        this.setState({
          searchData: result.result,
          searchResultLoading: false,
        });
      } else {
        this.setState({
          searchData: [],
          searchResultLoading: false,
        });
      }
    } catch (error) {
      this.setState({
        searchData: [],
        searchResultLoading: false,
      });
    }
  };


  handRedirectSearch = (e) => {
    if (e.which === 13 && this.state.search != null && this.state.search != undefined && this.state.search != "") {
      this.props.router.push(`/${this.props.curr}-${this.props.lang}/search?search=${this.state.search}`)
    }
  }

  render() {
    const data = this.data;
    return (
      <header className="header ">
        {data.liveChatStatus && this.props.isDesktop && (
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src="//js.hs-scripts.com/8803827.js"
          ></script>
        )}
        <div>
          {this.props.isDesktop && (
            <section className="header-top">
              <div className="header-top__container container siteWidthContainer">
                <div className="header-top__item header-top__item--left-padding">
                  {data.logoUrlShopHeader && (
                    <Link
                      href="/[lang-curr]"
                      as={`/${this.props.curr}-${this.props.lang}`}
                    >
                      <a className="header-top__item-link">
                        <img
                          src={`${process.env.NEXT_PUBLIC_LOGO_PREFIX}/${data.logoUrlShopHeader}`}
                          alt="website logo"
                          className="header-top__logo"
                        />
                      </a>
                    </Link>
                  )}
                </div>
                <div className="header-top__item header-top__item--fill header-top__item--flex">
                  <Translate>
                    {({ translate }) => {
                      return (
                        <SearchInput
                          placeholder={translate("searchPlaceholder")}
                          lang={this.lang}
                          curr={this.activeCurrency}
                          search={translate("search")}
                          history={this.props.router}
                        />
                      );
                    }}
                  </Translate>
                  <a
                    onClick={() => {
                      this.setState({
                        showSelectBoxLang: this.state.showSelectBoxLang
                          ? false
                          : true,
                        showSelectBoxCurrency: false,
                        showAccountBox: false,
                      });
                    }}
                    className="header-top__item-drop-container d-flex align-align-items-center"
                  >
                    <span className="header-top__item-text">
                      <Translate id="lang" />
                    </span>
                    <img
                      src={arrowdownLight}
                      className="nav__item-svg"
                      alt="arrowdownLight"
                    />
                    {this.state.showSelectBoxLang ? (
                      <SelectBox
                        type={"lang"}
                        lang={this.lang}
                        currency={this.activeCurrency}
                      ></SelectBox>
                    ) : null}
                  </a>
                  <a
                    onClick={() => {
                      this.setState({
                        showSelectBoxLang: false,
                        showAccountBox: false,
                        showSelectBoxCurrency: this.state.showSelectBoxCurrency
                          ? false
                          : true,
                      });
                    }}
                    ref={this.wrapperRef}
                    className="header-top__item-drop-container d-flex align-align-items-center"
                  >
                    <span className="header-top__item-text">
                      {this.activeCurrency.toUpperCase()}
                    </span>
                    <img
                      src={arrowdownLight}
                      className="nav__item-svg"
                      alt="arrowdownLight"
                    />
                    {this.state.showSelectBoxCurrency ? (
                      <SelectBox
                        lang={this.lang}
                        currency={this.activeCurrency}
                        type={"currency"}
                      ></SelectBox>
                    ) : null}
                  </a>
                </div>
                <div className="header-top__item header-top__item--icon-margin">
                  <div className="header-top__item-container">
                    {/* <Link href="/[lang-curr]/panel" as="/usd-en/panel"> */}
                    <a
                      onClick={() => {
                        this.setState({
                          showSelectBoxLang: false,
                          showSelectBoxCurrency: false,
                          showAccountBox: !this.state.showAccountBox,
                        });
                      }}
                      className="header-top__item-link"
                    >
                      <div>
                        <span className="header-top__item-text-up">
                          {this.props.isLogin ? (
                            this.data?.customerFullName
                          ) : (
                            <Translate id="singin" />
                          )}
                        </span>
                        <span
                          style={{ cursor: "pointer" }}
                          className="header-top__item-text mr-3"
                        >
                          {this.props.isLogin ? (
                            <Translate id="my-account" />
                          ) : (
                            <Translate id="account" />
                          )}
                          <img
                            src={arrowdownLight}
                            className="nav__item-svg"
                            alt="arrowdownLight"
                          />
                        </span>
                      </div>
                      <img
                        src={UserCheckIcon}
                        className="header-top__item-icon header-top__item-icon--user"
                        alt="UserCheckIcon"
                      />
                      {this.state.showAccountBox ? (
                        <SelectBox
                          lang={this.lang}
                          currency={this.activeCurrency}
                          className="dropAccount"
                          type={"account"}
                        ></SelectBox>
                      ) : null}
                    </a>
                    {/* </Link> */}
                  </div>
                </div>
                <div className="header-top__item header-top__item--icon-margin">
                  <div className="header-top__item-container">
                    <a
                      href={`/${this.props.curr}-${this.props.lang}/cart`}
                      className="header-top__item-link header-top__item-link--relative"
                    >
                      <span className="header-top__item-text mr-3">
                        <Translate id="wishlist" />
                      </span>
                      {this.props.wishCount > 0 && (
                        <span className="header-top__badge">
                          {this.props.wishCount}
                        </span>
                      )}
                      <img
                        src={HeartOutlineIcon}
                        className="header-top__item-icon header-top__item-icon--heart"
                        alt="HeartOutlineIcon"
                      />
                    </a>
                  </div>
                </div>
                <div className="header-top__item">
                  <div className="header-top__item-container header-top__item--icon-margin">
                    <a
                      href={`/${this.props.curr}-${this.props.lang}/cart`}
                      className="header-top__item-link"
                    >
                      <span className="header-top__item-text mr-3">
                        <Translate id="cart" />
                      </span>
                      {this.props.cartCount > 0 && (
                        <span className="header-top__badge">
                          {this.props.cartCount}
                        </span>
                      )}
                      <img
                        src={BuyButtonIcon}
                        className="header-top__item-icon header-top__item-icon--buy"
                        alt="BuyButtonIcon"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <Translate>
          {({ translate }) => {
            return (
              <div>
                {this.props.isDesktop ? (
                  <Nav params={this.lang} content={translate} data={data} />
                ) : (
                  <div className="header__mobileMenu">
                    {data.logoUrlShopHeader && (
                      <Link
                        href="/[lang-curr]"
                        as={`/${this.props.curr}-${this.props.lang}`}
                      >
                        <a className="header-top__item-link mr-4 ml-4">
                          <img
                            src={logo}
                            alt="mobile logo"
                            className="header__mobileMenu--logo"
                          />
                        </a>
                      </Link>
                    )}

                    <div className="header__mobileMenu--search">
                      <Link
                        href={`/${this.props.curr}-${this.props.lang}/search?search=${this.state.search}`}
                      >
                        <a>
                          <SearchIcon className="mobile-search-input-icon" />
                        </a>
                      </Link>
                      <input
                        ref={this.inputRef}
                        onChange={this.handleSearchChange.bind(this)}
                        type="text"
                        value={this.state.search}
                        onKeyPress={this.handRedirectSearch}
                        placeholder={translate("searchPlaceholder")}
                      />
                    </div>
                    {this.state.searchData.length != 0 && (
                      <div className="searchResultMobile">
                        <SearchSugestion
                          showLoader={this.state.searchResultLoading}
                          data={this.state.searchData}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        </Translate>
      </header>
    );
  }
}

const mapDispatchToProps = {
  addCartCount,
  addWishCount,
};

const mapStateToProps = (state) => {
  return {
    isLogin: selectLogin(state).isLogin,
    lang: selectLang(state),
    curr: selectCurr(state),
    cartCount: selectCartCount(state),
    wishCount: selectWishCount(state),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AppHeader));
