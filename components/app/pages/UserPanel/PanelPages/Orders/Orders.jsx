import React, { useState, useEffect } from "react";
import { BoxStyle1, GoodSituation, Pager } from "../../../../../common";
import { Switch, Route, useRouteMatch } from "react-router";
import NoOrdersPage from "./OrdersLayouts/NoOrdersPage";
import { Translate } from "react-localize-redux";
import arrowIcon from "./../../../../../../assets/icons/img-down-arrow-white.svg";
import arrowLink from "./../../../../../../assets/icons/img-linear-arrow.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OrderDetail from "./OrdersLayouts/OrderDetail";
import OrderReview from "./OrdersLayouts/OrderReview";
import CancelOrders from "./OrdersLayouts/CancelOrders";
import { Scrollbars } from "react-custom-scrollbars";
import { selectLang } from "../../../../../../appConfigSlice";
import { format } from "date-fns";
import {
  LandScapePhonesAndBigger,
  LandScapePhones,
} from "../../../../../../Responsive";
import { client_getOrderList } from "./../../../../../../lib/api/client/clientUserPanel";

const renderBoxHeader = () => {
  return (
    <div className="profile-edit__header-container">
      <h2 className="profile-edit__box-header">
        <Translate id="orders.orders" />
      </h2>
      <LandScapePhonesAndBigger>
        <p className="profile-edit__box-subheader">
          <Translate id="orders.orders-des1" />
        </p>
      </LandScapePhonesAndBigger>
    </div>
  );
};

export default () => {
  const [emptyOrdersPage, setEmptyOrdersPage] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [orderItems, setOrderItems] = useState([]);
  const [totalNumber, setTotalNumber] = useState(0);
  const { path, url } = useRouteMatch();
  //this code is for Development purpose
  const lang = useSelector((state) => {
    return state.appConfig.lang.code;
  });

  const currency = useSelector((state) => {
    return state.appConfig.currency.name;
  });
  // const activeLang = langs.find((lang) => {
  //   return lang.active === true;
  // });

  const order_pre = process.env.NEXT_PUBLIC_Goods_PREFIX;
  const download_pre = process.env.NEXT_PUBLIC_Download_PREFIX;

  useEffect(() => {
    const res = getData(pageNumber);
    return () => { };
  }, []);

  const getData = async (pagenumber) => {
    const response = await client_getOrderList({
      id: 0,
      pageSize: pageSize,
      pageNumber: pagenumber
    });
    setTotalNumber(response.result.count);
    setOrderItems(response.result.data);
    if (response.result.count == 0) {
      setEmptyOrdersPage(true);
    } else {
      setEmptyOrdersPage(false);
    }
  };

  const pageChangedAction = async (pagenumber) => {
    setPageNumber(pagenumber);
    const res = await getData(pagenumber);
  };

  return (
    <Switch>
      <Route
        strict
        path={`${path}/:id/cancel`}
        render={(routeProps) => {
          return <CancelOrders  {...routeProps} />;
        }}
      />
      <Route
        strict
        path={`${path}/:id/:orderItemId/:good`}
        render={(routeProps) => {
          return <OrderReview  {...routeProps} />;
        }}
      />
      <Route
        strict
        path={`${path}/:id`}
        render={(routeProps) => {
          return <OrderDetail {...routeProps} />;
        }}
      />
      <Route path={`${path}`}>
        {emptyOrdersPage ? (
          <NoOrdersPage />
        ) : (
            <BoxStyle1 headerContent={renderBoxHeader()}>
              <section className="orders">
                {orderItems.map((item) => {
                  return (
                    <article className="orders__item-cnt">
                      <LandScapePhones>
                        <Link to={`${url}/${item.orderId}`}>
                          <header className="orders__item-header flex-wrap no-gutters">
                            <img
                              src={arrowLink}
                              alt="arrow"
                              className="orders__mobile-arrow"
                            />
                            <h2 className="orders__item-cnt-header">
                              <Translate id="orders.orders" /> &nbsp;
                            {item.trackingCode}
                            </h2>
                            <span className="col-md-auto col-12 orders__header-gray-text">
                              <Translate id="orders.placed-on" />{" "}
                              {item.placedDateTime}
                            </span>
                          </header>
                        </Link>
                      </LandScapePhones>
                      <LandScapePhonesAndBigger>
                        <header className="orders__item-header flex-wrap no-gutters">
                          <h2 className="orders__item-cnt-header">
                            <Translate id="orders.orders" /> &nbsp;
                          {item.trackingCode}
                          </h2>
                          <span className="col-md-auto col-12 orders__header-gray-text">
                            <Translate id="orders.placed-on" />{" "}
                            {format(new Date(item.placedDateTime), "MMM dd , yyyy")}
                          </span>
                        </header>
                      </LandScapePhonesAndBigger>

                      <div className="orders__order-cnt">
                        <Scrollbars
                          renderView={(props) => (
                            <div
                              {...props}
                              className="deliveryPanel__scrol-view"
                            />
                          )}
                          // renderTrackVertical={(props) => (
                          //   <div
                          //     {...props}
                          //     className="deliveryPanel__track-vertical"
                          //   />
                          // )}
                          // Hide delay in ms autoHideTimeout={1000}
                          // Duration for hide animation in ms. autoHideDuration={200}
                          style={{ width: "100%", height: "203px" }}
                        >
                          <ul className="orders__orders-list">
                            {item?.items.map((orderItems) => {
                              return (
                                
                                <li className="orders__order-item">
                                  {orderItems.isDownloadable ? (
                                  <a target="_blank" href={`${download_pre}/${orderItems.goodsId}/${orderItems.downloadUrl}`}>
                                  <figure className="orders__img-fig">
                                    <img
                                      src={`${order_pre}/${orderItems.goodsId}/${orderItems.goodsImage}`}
                                      alt="item"
                                      className="orders__img"
                                    />
                                    {!orderItems.isDownloadable && (
                                  <figcaption className="orders__fig-cap">
                                  <GoodSituation
                                    id={orderItems.statusId}
                                    title={orderItems.statusTitle}
                                  />
                                </figcaption>
                                    )}

                                  </figure>
                                </a>
                                  ) : 
                                  (
                                    <a>
                                    <figure className="orders__img-fig">
                                      <img
                                        src={`${order_pre}/${orderItems.goodsId}/${orderItems.goodsImage}`}
                                        alt="item"
                                        className="orders__img"
                                      />
                                      {!orderItems.isDownloadable && (
                                    <figcaption className="orders__fig-cap">
                                    <GoodSituation
                                      id={orderItems.statusId}
                                      title={orderItems.statusTitle}
                                    />
                                  </figcaption>
                                      )}
  
                                    </figure>
                                  </a>
                                  )}

                                </li>
                              )

                            })}
                          </ul>
                        </Scrollbars>

                        <div className="mt-5 mt-md-0 orders__right-cnt">
                          <div className="orders__right-items">
                            <span className="orders__text-bold">
                              <Translate id="orders.order-sum" />
                              <span className="orders__text-small">
                              {item.orderItemCount}
                              </span>                              
                              <span className="orders__text-small">
                                <Translate id="orders.items" />
                              </span>
                            </span>
                            <span className="mt-3 orders__text-bold d-block">
                              {currency} {item.finalPrice.toLocaleString()}
                            </span>

                            <LandScapePhonesAndBigger>
                              <Link
                                to={`${url}/${item.orderId}`}
                                className="primary-btn orders__btn"
                              >
                                <Translate id="orders.detail-view" />
                                <img
                                  className="orders__btn-arrow-icon"
                                  src={arrowIcon}
                                  alt="arrow icon"
                                />
                              </Link>
                            </LandScapePhonesAndBigger>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              <Pager
                count={Math.ceil(totalNumber / pageSize)}
                activeItem={pageNumber}
                onPageClick={(pageNumber) => {
                  pageChangedAction(pageNumber);
                }}
              />
            </BoxStyle1>
          )}
      </Route>
    </Switch>
    // <BoxStyle1 headerContent={renderBoxHeader()}>
    //   <section className="orders">

    //   </section>
    // </BoxStyle1>
  );
};

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
  };
};
