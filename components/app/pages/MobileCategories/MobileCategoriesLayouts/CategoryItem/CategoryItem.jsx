import React from "react";
import { connect } from "react-redux";
import LazyLoad from "react-lazyload";
import "./CategoryItem.scss";
import "./CategoryItem-rtl.scss";

import Tooltip from "react-tooltip-lite";
import Link from "next/link";
import { isRtl } from "../../../../../../lib/isRtl";
import {
  selectLang,
  selectCurr,
  selectLogin,
  PREVLINK_CHANGE,
} from "../../../../../../appConfigSlice";
import { Translate } from "react-localize-redux";
import {
  slugy,
  setCartCookie,
  trimText,
  roundDecimalNumber,
  formatMoney,
} from "../../../../../../lib/helpers";
import { withRouter } from "next/router";
import {
  client_addToCart,
  client_likeGood,
} from "../../../../../../lib/api/client/clientCart";
import axiosClient from "../../../../../../lib/api/axios";
import Cookies from "js-cookie";
import {
  selectCartCount,
  selectWishCount,
  addCartCount,
  addWishCount,
} from "../../../CartAndWishlist/cartAndWishlistSlice";
import { SEARCH_TYPE_CATEGORY } from "../../../../../../lib/querys";
import categoryIcon from "./../../../../../../assets/icons/img-category.svg";

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
        const Category_pre = process.env.NEXT_PUBLIC_CategoryImages_PREFIX;

        let allLink2 = "#";
        let hrefLink = "";
        if (this.props.haveWebPage) {
          allLink2 = `/${this.props.curr}-${this.props.lang}/category/${this.props.categoryId}`;
          hrefLink = "/[usd-cur]/category";

        } else {
          allLink2 = `/${this.props.curr}-${this.props.lang}/search?id=${this.props.categoryId}&type=${SEARCH_TYPE_CATEGORY}`;
          hrefLink = "/[usd-cur]/search";
        
        }

        let imgPath = null;
        if (this.props.imageUrl) {
          imgPath = `${Category_pre}/${this.props.categoryId}/${this.props.imageUrl}`;
        }

        return (
          <div className="categoryItem-container-parent">
            <div className="categoryItem-container categoryItem-container--hover">
              {/* {this.state.navigation && <GoodItemNavigation />} */}
              <article
                title={this.props.categoryTitle}
                className={
                  this.props.hover
                    ? "categoryItem categoryItem--hover"
                    : "categoryItem"
                }
              >
                <Link
                  href={`${allLink2}`}
                >
                  <figure className="categoryItem__fig">
                    <div className="categoryItem__fig-img">
                      <LazyLoad
                        placeholder={
                          <img
                            className="goodItem-loader__img goodItem-loader__img--slider"
                            src="/assets/imgs/placeholder-v2.png"
                          />
                        }
                      >
                        <div className="categoryItem__aspect">

                          {this.props.imageUrl ?
                            <img
                              className="categoryItem__img"
                              src={`${imgPath}`}
                            />
                            :
                            <img
                              className="categoryItem__img"
                              src={categoryIcon}
                            />}
                        </div>
                      </LazyLoad>
                    </div>
                    {/* <Tooltip content={this.props.title}> */}
                    <figcaption className="categoryItem__fig-cap">
                      {trimText(this.props.categoryTitle, 30)}
                    </figcaption>
                    {/* </Tooltip> */}
                  </figure>
                </Link>
                <footer className="categoryItem__footer">
                  <div className="categoryItem__footer__product-count-wrapper">

                    <p className="categoryItem__footer__product-count-text">
                      <span className="mr-2 ml-2">
                       <Translate id="Goods" />
                      </span>
                      <span>
                      {roundDecimalNumber(this.props.goodsCount)}
                      </span>
                      <span>
                      +
                      </span>
                      </p>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        );
      }
    }
  )
);
