import React from "react";
import { BoxStyle2 } from "../../../../../../common";
import { Translate } from "react-localize-redux";
import { ReactComponent as BackIcon } from "./../../../../../../../assets/icons/back.svg";
import { Link } from "react-router-dom";
import { ReactComponent as BusinessIcon } from "./../../../../../../../assets/icons/business-and-trade.svg";
import OrderItem from "./OrderItem";
import OrderCartDetail from "./OrderCartDetail";
import {
  LandScapePhonesAndBigger,
  LandScapePhones,
} from "../../../../../../../Responsive";
import { format } from "date-fns";
import { client_getOrderItems } from "../../../../../../../lib/api/client/clientUserPanel";
import { connect } from "react-redux";
import { selectCurr,selectLang } from "../../../../../../../appConfigSlice";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

class OrderDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      data: {},
    };
    this.phoneUtil = PhoneNumberUtil.getInstance();
    this.PNF = PhoneNumberFormat;
  }
  handleBackClick = () => {
    //   console.log(this.props.match);
    //   this.props.history.push(`${this.props.match.url}`);
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({ showLoader: true });
    const result = await client_getOrderItems(this.props.match.params.id);
    this.setState({ showLoader: false });
    this.setState({ data: result.result });

  };

  renderBoxHeader() {

    return (
      <header className="mapAddress__header">
        <Link
          to={this.props.match.url.split("/").slice(0, -1).join("/")}
          className="orderDetail__backlink"
        >
          <BackIcon className="mapAddress__back-icon" />
          <div className="orders__item-header flex-wrap no-gutters">
            <h2 className="orders__item-cnt-header">
              <Translate id="orders.orders" /> &nbsp;{" "}
              {this.state.data.trackingCode}
            </h2>
            <span className="col-md-auto col-12 orders__header-gray-text">
              <Translate id="orders.placed-on" /> &nbsp;{" "}
              {this.state.data.placedDateTime !== undefined ?
                format(new Date(this.state.data.placedDateTime), "MMM dd , yyyy") : null}

            </span>
          </div>
        </Link>
      </header>
    );
  }

  render() {
    return (
      <section className="orderDetail">
        <BoxStyle2 headerContent={this.renderBoxHeader()}>
          <header className="orderDetail__header-top row mr-0 ml-0 justify-content-between">
            <div className="col-12 col-sm-6 col-md-5">
              <i className="orderDetail__addr-icon">
                <BusinessIcon />
              </i>
              <p className="orderDetail__header-text orderDetail__header-text--margin">
                {this.state.data.address}
              </p>
            </div>

            <div className="mt-4 mt-sm-0 col-sm-4 col-md-3">
              <span className="orderDetail__header-text d-block">
                {this.state.data.transfereeName}{" "}
                {this.state.data.transfereeFamily}
              </span>
              <span className="orderDetail__header-text d-block">
                {this.state.data.transfereeMobile ? (
                  this.phoneUtil.format(
                    this.phoneUtil.parseAndKeepRawInput(
                      this.state.data.transfereeMobile,
                      this.state.data.iso
                    ),
                    this.PNF.INTERNATIONAL
                  )
                ) : null}
              </span>
            </div>
            <LandScapePhonesAndBigger className="col-3 p-0">
              <div style={{ textAlign: 'right'}}>
                {/* <a className="orderDetail__header-text-gray d-block">
                  <NewsIcon className="orderDetail__header-gray-icon" />
                  <Translate id="orders.taxInvo" />
                </a>
                <a className="orderDetail__header-text-gray">
                  <DollarIcon className="orderDetail__header-gray-icon" />
                  <Translate id="orders.inSum" />
                </a> */}
                {this.state.data.cancelingAllowed ? (
                  <Link
                    to={`${this.props.match.url}/cancel`}
                    className="orange-btn orderDetail__cancel-btn"
                  >
                    <Translate id="orders.cancel-item-btn" />
                  </Link>
                ) : null}
              </div>
            </LandScapePhonesAndBigger>
            <LandScapePhones className="d-flex mt-3 w-100 justify-content-center">
              {this.state.data.cancelingAllowed ? (
                <Link
                  to={`${this.props.match.url}/cancel`}
                  className="orange-btn orderDetail__cancel-btn"
                >
                  <Translate id="orders.cancel-item-btn" />
                </Link>
              ) : null}
            </LandScapePhones>
          </header>
          <section className="orderDetail__goods-cnt">
            {this.state.data?.items?.map((item) => {
              return (
                <OrderItem
                  reviewLink={`${this.props.match.url}/${item.itemId}/${item.goodsId}`}
                  data={item}
                  key={item.itemId}
                  currency={this.props.currency}
                  lang={this.props.lang}
                />
              )
            })}
          </section>
        </BoxStyle2>

        <BoxStyle2 className="order-cart">
          <OrderCartDetail data={this.state.data} currency={this.props.currency} />
        </BoxStyle2>
      </section >
    );
  }
}


const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    currency: selectCurr(state)
  };
};

export default connect(mapStateToProps)(OrderDetail);
