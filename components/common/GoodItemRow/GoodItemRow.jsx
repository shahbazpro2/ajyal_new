import React from "react";
import { connect } from "react-redux";
import StarRatingComponent from "react-star-rating-component";
// import "./GoodItemRow.scss";
// import "./GoodItemRow-rtl.scss";
import expressIcon from "./../../../assets/icons/express.png";
import expressArIcon from "./../../../assets/icons/express-ar.png";
import marketEn from "./../../../assets/icons/marketplace.png";
import marketAr from "./../../../assets/icons/marketplaceAr.png";
import startIcon from "./../../../assets/icons/img-star.svg";
import startGrayIcon from "./../../../assets/icons/img-star-gray.svg";
import { ReactComponent as HeartCircleIcon } from "./../../../assets/icons/heart-circle.svg";
import { ReactComponent as HeartCircleIconFill } from "./../../../assets/icons/heart-circle-fill.svg";
import { Translate } from "react-localize-redux";
import Button from "../Button/Button";
import { isRtl } from "../../../lib/isRtl";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import {
  selectLang,
  selectCurr,
  selectLogin,
  PREVLINK_CHANGE,
} from "../../../appConfigSlice";
import {
  slugy,
  setCartCookie,
  formatMoney,
  trimTextLonger,
} from "../../../lib/helpers";
import { withRouter } from "next/router";
import {
  client_addToCart,
  client_likeGood,
} from "../../../lib/api/client/clientCart";
import axiosClient from "../../../lib/api/axios";
import Loading from "../Loading/Loading";
import GoodItemNavigation from "../GoodItemNavigation/GoodItemNavigation";
import Cookies from "js-cookie";
import {
  selectWishCount,
  addWishCount,
} from "../../app/pages/CartAndWishlist/cartAndWishlistSlice";

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
    isLogin: selectLogin(state).isLogin,
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
  addWishCount,
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
          navigation: false,
        };
        this.goToDetails = this.props.haveVariation || this.props.saleWithCall;
      }

      handleCartClick = async (e) => {
        e.preventDefault();

        if (this.state.cartIconLoading) return;

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
            this.props.router.push(
              `/${this.props.curr}-${this.props.lang}/cart`
            );
          }
        } catch (err) {
          console.log(err);
          // return false;
        }
      };

      handleGoToDetail = (e) => {
        e.preventDefault();
        this.setState({ navigation: true });
        this.props.router.push(
          `/${this.props.curr}-${this.props.lang}/product/${
            this.props.goodsId
          }/${this.props.providerId}/${slugy(this.props.title)}`
        );
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
          <div className="goodItem-s2-container">
            {this.state.navigation && <GoodItemNavigation />}
            <article
              className={
                this.props.hover
                  ? "goodItem-s2 goodItem-s1--hover"
                  : "goodItem-s2"
              }
            >
              <div className="goodItem-s2__left-container">
                {/* {!this.props.withoutCaption && (
                <span
                  style={{ backgroundColor: this.props.caption["bg-color"] }}
                  className="goodItem-s2__sticky"
                >
                  {this.props.caption.text}
                </span>
              )} */}
                <Link
                  href="/[usd-cur]/product/[...good]"
                  as={`/${this.props.curr}-${this.props.lang}/product/${
                    this.props.goodsId
                  }/${this.props.providerId}/${slugy(this.props.title)}`}
                >
                  <a
                    className="goodItem-s2__fig"
                    onClick={() => {
                      this.setState({
                        navigation: true,
                      });
                    }}
                  >
                    <figure>
                      <LazyLoad
                        placeholder={
                          <img
                            className="goodItem-loader__img"
                            src="/assets/imgs/placeholder-v2.png"
                          />
                        }
                      >
                        <img
                          className="goodItem-s2__img"
                          src={`${process.env.NEXT_PUBLIC_Goods_PREFIX}/${this.props.goodsId}/thumb-${this.props.goodsImage}`}
                        />
                      </LazyLoad>
                    </figure>
                  </a>
                </Link>
                <div className="goodItem-s2__left-right">
                  <div className="goodItem-s2__ns-con">
                    <Link
                      href="/[usd-cur]/product/[...good]"
                      as={`/${this.props.curr}-${this.props.lang}/product/${
                        this.props.goodsId
                      }/${this.props.providerId}/${slugy(this.props.title)}`}
                    >
                      <a
                        className="goodItem-s2__name"
                        onClick={() => {
                          this.setState({
                            navigation: true,
                          });
                        }}
                      >
                        {trimTextLonger(this.props.title)}
                      </a>
                    </Link>
                    {this.props.withModelNumber && (
                      <div className="cart-item__model-container">
                        <span className="order-item__small-text">
                          <Translate id="common.good-item.model-num" />
                        </span>
                        <span className="order-item__small-value">
                          {this.props.modelnumber}
                        </span>
                      </div>
                    )}
                    {this.props.surveyCount > 0 ? (
                      <div className="goodItem-s2__star-container">
                        <StarRatingComponent
                          name="good Item rate"
                          editing={false}
                          renderStarIcon={(index, value) => {
                            return (
                              <img
                                alt=""
                                className="goodItem-s2__star"
                                src={index <= value ? startIcon : startGrayIcon}
                              />
                            );
                          }}
                          starCount={5}
                          value={this.props.surveyScore}
                        />
                        <span className="goodItem-s2__start-count">
                          ({this.props.surveyScore})
                        </span>
                      </div>
                    ) : undefined}
                  </div>
                  <div className="goodItem-s2__right-ft-con">
                    <div className="goodItem-s2__right-ft">
                      {!this.is_rtl ? (
                        <span className="goodItem-s2__currency">
                          <Translate id={this.props.curr} />
                        </span>
                      ) : undefined}
                      <div className="goodItem-s2__price-container">
                        <span className="goodItem-s2__number">
                          {formatMoney(this.props.finalPrice)}
                        </span>
                      </div>
                      {this.is_rtl ? (
                        <span className="goodItem-s2__currency">
                          <Translate id={this.props.curr} />‏
                        </span>
                      ) : undefined}
                      {this.props.discountAmount > 0 ? (
                        <div className="goodItem-s2__off-percentage-container">
                          <span className="goodItem-s2__off-percentage">
                            {this.props.discountPercentage}
                          </span>
                          <span className="goodItem-s2__off-text">% OFF</span>
                        </div>
                      ) : undefined}

                      {this.props.discountAmount > 0 && (
                        <span className="goodItem-s2__price-off">
                          {formatMoney(this.props.price)}
                        </span>
                      )}
                    </div>

                    {this.props.shippingPossibilities ? (
                      <img
                        alt="market icon"
                        className="goodItem-s2__exp"
                        src={this.is_rtl ? marketAr : marketEn}
                      />
                    ) : (
                      <img
                        alt="express icon"
                        className="goodItem-s2__exp"
                        src={this.is_rtl ? expressArIcon : expressIcon}
                      />
                    )}
                  </div>
                </div>
              </div>

              {!this.props.withoutRightBox && (
                <div className="goodItem-s2__right-container">
                  {!this.goToDetails ? (
                    <Button
                      radius="true"
                      onClick={this.handleCartClick}
                      value={
                        this.state.cartIconLoading ? (
                          <Loading type="white" width="22px" height="22px" />
                        ) : (
                          <Translate id="addcard" />
                        )
                      }
                    />
                  ) : (
                    <Button
                      radius="true"
                      onClick={this.handleGoToDetail}
                      value={
                        this.props.saleWithCall ? (
                          <Translate id="common.show-p-info" />
                        ) : (
                          <Translate id="common.go-detail" />
                        )
                      }
                    />
                  )}
                  <a
                    href=""
                    className="goodItem-s2__wishlist-cnt"
                    onClick={this.handleLike}
                  >
                    {this.state.liked ? (
                      <>
                        <HeartCircleIconFill className="goodItem-s2__wishlist-icon" />
                        <span className="goodItem-s2__wishlist-text">
                          <Translate id="in-wishlist" />
                        </span>
                      </>
                    ) : (
                      <>
                        <HeartCircleIcon className="goodItem-s2__wishlist-icon" />
                        <span className="goodItem-s2__wishlist-text">
                          <Translate id="add-wish" />
                        </span>
                      </>
                    )}
                  </a>
                </div>
              )}
            </article>
          </div>
        );
      }
    }
  )
);
