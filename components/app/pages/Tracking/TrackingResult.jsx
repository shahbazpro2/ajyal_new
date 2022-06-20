import Link from "next/link";
import React from "react";
import { BoxStyle2 } from "../../../common";
import { ReactComponent as BackIcon } from "../../../../assets/icons/back.svg";
import { ReactComponent as BusinessIcon } from "../../../../assets/icons/business-and-trade.svg";
import { ReactComponent as NewsIcon } from "../../../../assets/icons/news.svg";
import { ReactComponent as DollarIcon } from "../../../../assets/icons/dollar.svg";
import { LandScapePhonesAndBigger } from "../../../../Responsive";
import { Translate } from "react-localize-redux";
import TrackItem from "./TrackItem";
import { useSelector } from "react-redux";
import { selectCurr,selectLang } from "../../../../appConfigSlice";
import TrackCartDetail from "./TrackCartDetail";
import { TRACK } from "./Tracking";
import { format } from "date-fns";

const TrackingResult = ({ dis, result }) => {
  const curr = useSelector(selectCurr);
  const lang = useSelector(selectLang);
  const renderBoxHeader = () => {
    return (
      <header className="mapAddress__header">
        <a
          // to={this.props.match.url.split("/").slice(0, -1).join("/")}
          className="orderDetail__backlink"
          onClick={(e) => {
            e.preventDefault();
            dis({ type: TRACK });
          }}
        >
          <BackIcon className="mapAddress__back-icon" />
          <div className="orders__item-header flex-wrap no-gutters">
            <h2 className="orders__item-cnt-header">
              <Translate id="orders.orders" /> &nbsp; {result.trackingCode}
            </h2>
            <span className="col-md-auto col-12 orders__header-gray-text">
              <Translate id="orders.placed-on" /> &nbsp;{" "}
              {result.placedDateTime}
            </span>
          </div>
        </a>
      </header>
    );
  };

  return (
    <div className="tracking container siteWidthContainer">
      <section className="orderDetail track-result">
        <BoxStyle2 headerContent={renderBoxHeader()}>
          <header className="orderDetail__header-top row justify-content-between">
            <div className="col-12 col-sm-6 col-md-5">
              <i className="orderDetail__addr-icon">
                <BusinessIcon />
              </i>
              <p className="orderDetail__header-text orderDetail__header-text--margin">
                {result.address}
              </p>
            </div>

            <div className="mt-4 mt-sm-0 col-sm-4 col-md-3">
              <span className="orderDetail__header-text d-block">
                {result.transfereeName} {result.transfereeFamily}
              </span>
              <span className="orderDetail__header-text d-block">
                {result.transfereeMobile}
              </span>
            </div>
            <LandScapePhonesAndBigger className="col-3">
              <div>
                {/* <a className="orderDetail__header-text-gray d-block">
                  <NewsIcon className="orderDetail__header-gray-icon" />
                  <Translate id="orders.taxInvo" />
                </a>
                <a className="orderDetail__header-text-gray">
                  <DollarIcon className="orderDetail__header-gray-icon" />
                  <Translate id="orders.inSum" />
                </a> */}
                {/* {this.state.data.cancelingAllowed ? (
                  <a
                    to={`${this.props.match.url}/cancel`}
                    className="orange-btn orderDetail__cancel-btn"
                  >
                    <Translate id="orders.cancel-item-btn" />
                  </Link>
                ) : null} */}
              </div>
            </LandScapePhonesAndBigger>
            {/* <LandScapePhones className="d-flex mt-3 w-100 justify-content-center">
              {this.state.data.cancelingAllowed ? (
                <Link
                  to={`${this.props.match.url}/cancel`}
                  className="orange-btn orderDetail__cancel-btn"
                >
                  <Translate id="orders.cancel-item-btn" />
                </Link>
              ) : null}
            </LandScapePhones> */}
          </header>
          <section className="orderDetail__goods-cnt">
            {result.items?.map((item) => {
              return (
                <TrackItem
                  //   reviewLink={`${this.props.match.url}/${this.props.match.params.id}`}
                  data={item}
                  key={item.itemId}
                  currency={curr}
                  lang={lang}
                />
              );
            })}
          </section>
          <div className="row mt-4 mb-4">
            <div className="col-md-5 col-sm-4 col-12">
              <TrackCartDetail data={result} currency={curr} />
            </div>
          </div>
        </BoxStyle2>
      </section>
    </div>
  );
};

export default TrackingResult;
