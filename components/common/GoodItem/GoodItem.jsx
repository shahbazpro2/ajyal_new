import React from "react";
import { connect } from "react-redux";
import StarRatingComponent from "react-star-rating-component";
import LazyLoad from "react-lazyload";
// import "./GoodItem.scss";
// import "./GoodItem-rtl.scss";

import bstIcon from "./../../../assets/icons/img-bst.svg";
import bstFillIcon from "./../../../assets/icons/img-bst-fill.svg";
import heartIcon from "./../../../assets/icons/img-heart.svg";
import heartFillIcon from "./../../../assets/icons/img-heart-fill.svg";
import expressIcon from "./../../../assets/icons/express.png";
import expressArIcon from "./../../../assets/icons/express-ar.png";
import marketEn from "./../../../assets/icons/marketplace.png";
import marketAr from "./../../../assets/icons/marketplaceAr.png";
import startIcon from "./../../../assets/icons/img-star.svg";
import startGrayIcon from "./../../../assets/icons/img-star-gray.svg";
// import eyeeee from "./../../../assets/icons/img-eye.svg";
import eye from "./../../../assets/icons/img-point.svg";
import callIcon from "./../../../assets/icons/img-good-Item-call.svg";

// import Tooltip from "react-tooltip-lite";
import Link from "next/link";
import { isRtl } from "../../../lib/isRtl";
import {
  selectLang,
  selectCurr,
  selectLogin,
  PREVLINK_CHANGE,
} from "../../../appConfigSlice";
import { Translate } from "react-localize-redux";
import {
  slugy,
  setCartCookie,
  trimText,
  formatMoney,
} from "../../../lib/helpers";
import { withRouter } from "next/router";
import {
  client_addToCart,
  client_likeGood,
} from "../../../lib/api/client/clientCart";
import axiosClient from "../../../lib/api/axios";
import Cookies from "js-cookie";
import Loading from "../Loading/Loading";
import GoodItemNavigation from "../GoodItemNavigation/GoodItemNavigation";
import {
  selectCartCount,
  selectWishCount,
  addCartCount,
  addWishCount,
} from "../../app/pages/CartAndWishlist/cartAndWishlistSlice";
import classnames from "classnames";

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    isLogin: selectLogin(state).isLogin,
    cartCount: selectCartCount(state),
    wishCount: selectWishCount(state),
  };
};

const mapDispatchToProps = {
  saveLink: (link) => {
    return {
      type: PREVLINK_CHANGE,
      payload: {
        link,
      },
    };
  },
  addCartCount,
  addWishCount,
};

const SmartRoute = ({ reload, as, children, className, onClick, ...props }) => {
  return !reload ? (
    <Link {...props} as={as}>
      <a className={className} onClick={onClick}>
        {children}
      </a>
    </Link>
  ) : (
    <a className={className} href={as} onClick={onClick}>
      {children}
    </a>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(
    class extends React.Component {
      constructor(props) {
        super(props);
        this.is_rtl = isRtl(this.props.lang);
        this.state = {
          cartIconLoading: false,
          liked: this.props.goodsLiked,
          inCart: this.props.inCart,
          navigation: false,
        };

        this.goToDetails = this.props.haveVariation || this.props.saleWithCall;
      }

      handleCartClick = async (e) => {
        e.preventDefault();

        this.setState({
          cartIconLoading: true,
        });

        try {
          const result = await client_addToCart({
            goodId: this.props.goodsId,
            providerId: this.props.providerId,
            count: 1,
          });
          if (result.status === 200) {
            const id = result.result.cookieId;
            const cartId = Cookies.get(
              process.env.NEXT_PUBLIC_Token_Cookie_name_cart
            );
            if (!cartId && id) {
              setCartCookie(id);
              axiosClient.setCartId(id);
            }

            // this.props.router.push(
            //   `/${this.props.curr}-${this.props.lang}/cart`
            // );
            if (!this.state.inCart) {
              this.props.addCartCount(this.props.cartCount + 1);
            }

            this.setState({
              cartIconLoading: false,
              inCart: true,
            });
          }
        } catch (err) {
          this.setState({
            cartIconLoading: false,
          });
          // return false;
        }
      };

      handleLike = (e) => {
        e.preventDefault();

        if (!this.props.isLogin) {
          this.props.saveLink(this.props.router.asPath);
          this.props.router.push(`/${this.props.curr}-${this.props.lang}/Auth`);
          return;
        }
        const prevLike = this.state.liked;
        try {
          const result = client_likeGood(this.props.goodsId);
          this.setState({
            liked: !prevLike,
          });

          const wishCount = prevLike
            ? this.props.wishCount - 1
            : this.props.wishCount + 1;
          this.props.addWishCount(wishCount);
        } catch (err) {
          this.setState({
            liked: prevLike,
          });
        }
      };

      render() {
        return (
          <div className="goodItem-s1-container goodItem-s1-container--hover">
            {this.state.navigation && <GoodItemNavigation />}
            <article
              title={this.props.title}
              className={
                this.props.hover
                  ? "goodItem-s1 goodItem-s1--hover"
                  : "goodItem-s1"
              }
            >
              {/* <span
                // style={{ backgroundColor: this.props.caption["bg-color"] }}
                className="goodItem-s1__sticky"
              >
                {this.props.caption?.text}
                
              </span> */}
              <img
                onClick={this.handleLike}
                className={
                  this.state.liked
                    ? "goodItem-s1__heart-icon goodItem-s1__heart-icon--block"
                    : "goodItem-s1__heart-icon"
                }
                src={this.state.liked ? heartFillIcon : heartIcon}
              />

              <SmartRoute
                reload={this.props.reload}
                href="/[usd-cur]/product/[...good]"
                as={`/${this.props.curr}-${this.props.lang}/product/${
                  this.props.goodsId
                }/${this.props.providerId}/${slugy(this.props.title)}`}
                onClick={() => {
                  this.setState({
                    navigation: true,
                  });
                }}
              >
                <figure className="goodItem-s1__fig">
                  <div className="goodItem-s1__fig-img">
                    <LazyLoad
                      once
                      placeholder={
                        <img
                          className="goodItem-loader__img goodItem-loader__img--slider"
                          src="/assets/imgs/placeholder-v2.png"
                        />
                      }
                    >
                      <div className="goodItem-s1__aspect">
                        <img
                          className="goodItem-s1__img"
                          src={`${process.env.NEXT_PUBLIC_Goods_PREFIX}/${this.props.goodsId}/thumb-${this.props.goodsImage}`}
                        />
                      </div>
                    </LazyLoad>
                  </div>
                  {/* <Tooltip content={this.props.title}> */}
                  <figcaption className="goodItem-s1__fig-cap">
                    {/* {this.props.goodName} */}
                    <span className="fig-cap-desktop">
                    {trimText(this.props.title)}
                    </span>
                    <span className="fig-cap-mobile">
                    {trimText(this.props.title , 40)}
                    </span>
                  </figcaption>
                  {/* </Tooltip> */}
                </figure>
              </SmartRoute>
              <footer className="goodItem-s1__footer">
                <div className="goodItem-s1__star-container">
                  {this.props.surveyCount > 0 ? (
                    <div className="d-flex align-items-center">
                      <StarRatingComponent
                        name="good Item rate"
                        editing={false}
                        renderStarIcon={(index, value) => {
                          return (
                            <img
                              className="goodItem-s1__star"
                              src={index <= value ? startIcon : startGrayIcon}
                            />
                          );
                        }}
                        starCount={5}
                        value={this.props.surveyScore}
                      />
                      <span className="goodItem-s1__start-count">
                        ({this.props.surveyScore})
                      </span>
                    </div>
                  ) : null}
                </div>
                {this.props.inventoryCount <= 0 && (
                  <div className="w-100 col-12 unavailable">
                    <span>
                      <Translate id="common.unavailable" />
                    </span>
                  </div>
                )}
                {this.props.inventoryCount > 0 && (
                  <div className="goodItem-s1__footer-left">
                    {!this.props.saleWithCall ? (
                      <div className="goodItem-s1__footer-left-div">
                        {!this.is_rtl ? (
                          <span className="goodItem-s1__currency">
                            <Translate id={this.props.curr} />
                          </span>
                        ) : undefined}
                        <div className="goodItem-s1__price-container">
                          <span className="goodItem-s1__number">
                            {formatMoney(this.props.finalPrice)}
                          </span>
                          {/* <span className="goodItem-s1__decimal">
                        .
                        {this.props.price.split(".")[1] &&
                          this.props.price.split(".")[1]}
                      </span> */}
                        </div>
                        {this.is_rtl ? (
                          <span className="goodItem-s1__currency">
                            <Translate id={this.props.curr} />
                          </span>
                        ) : undefined}
                        {this.props.discountAmount > 0 && (
                          <div>
                            <span className="goodItem-s1__price-off">
                              {formatMoney(this.props.price + this.props.vat)}
                            </span>
                            <div className="goodItem-s1__off-percentage-container show-on-mobile">
                              <span className="goodItem-s1__off-percentage">
                                {this.props.discountPercentage}
                              </span>
                              <span className="goodItem-s1__off-text">
                                %OFF
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="goodItem-s1__footer-left-div">
                        <span className="goodItem-s1__currency">
                          <Translate id="connect-provider" />
                        </span>
                      </div>
                    )}
                    {!this.props.saleWithCall && !this.props.isDownloadable && (
                      <div className="goodItem-s1__footer-left-div goodItem-s1__footer-left-div--align-center">
                        {this.props.shippingPossibilities ? (
                          <img
                            alt="market icon"
                            className="goodItem-s1__exp"
                            src={this.is_rtl ? marketAr : marketEn}
                          />
                        ) : (
                          <img
                            alt="express icon"
                            className="goodItem-s1__exp"
                            src={this.is_rtl ? expressArIcon : expressIcon}
                          />
                        )}
                        {this.props.discountAmount > 0 ? (
                          <div className="goodItem-s1__off-percentage-container">
                            <span className="goodItem-s1__off-percentage">
                              {this.props.discountPercentage}
                            </span>
                            <span className="goodItem-s1__off-text">%OFF</span>
                          </div>
                        ) : undefined}
                      </div>
                    )}
                  </div>
                )}
                {this.props.inventoryCount > 0 ? (
                  this.goToDetails ? (
                    <SmartRoute
                      reload={this.props.reload}
                      href="/[usd-cur]/product/[...good]"
                      as={`/${this.props.curr}-${this.props.lang}/product/${
                        this.props.goodsId
                      }/${this.props.providerId}/${slugy(this.props.title)}`}
                      className={classnames("goodItem-s1__eyeIcon", {
                        "goodItem-s1__eyeIcon--green": this.props.saleWithCall,
                      })}
                      onClick={() => {
                        this.setState({
                          navigation: true,
                        });
                      }}
                      title="go to detail"
                    >
                      <img
                        src={this.props.saleWithCall ? callIcon : eye}
                        alt="go to Detail"
                        title="go to detail"
                      />
                    </SmartRoute>
                  ) : this.state.cartIconLoading ? (
                    <Loading
                      type="gray"
                      width="30px"
                      height="30px"
                      styleSheet={{ margin: "initial", marginBottom: "5px" }}
                    />
                  ) : (
                    <a href="#" onClick={this.handleCartClick}>
                      <img
                        className="goodItem-s1__bst"
                        src={this.state.inCart ? bstFillIcon : bstIcon}
                      />
                    </a>
                  )
                ) : null}
              </footer>
            </article>
          </div>
        );
      }
    }
  )
);
