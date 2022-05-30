import React from "react";
import EmptyReturnsRequest from "../EmptyReturnsRequest";
import { Translate } from "react-localize-redux";
import jyalBlackIcon from "./../../../../../../../../assets/icons/img-jyal-backicon.svg";
import BusinessIcon from "./../../../../../../../../assets/icons/business-and-trade.svg";
import { ReturnItem } from "..";
import { ProtraitPhonesAndBigger } from "../../../../../../../../Responsive";
import { client_getReturnOrderRequests } from "./../../../../../../../../lib/api/client/clientUserPanel";
import { Loading } from "../../../../../../../common";
import Pagination from "react-js-pagination";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmptyPage: true,
      showLoader: false,
      pageNumber: 1,
      pageSize: 10,
      resultOrderCount: 0,
      orderItems: [],
    };

    this.goods_Pre = process.env.NEXT_PUBLIC_BrandImages_PREFIX;
    this.phoneUtil = PhoneNumberUtil.getInstance();
    this.PNF = PhoneNumberFormat;
  }

  async componentDidMount() {
    this.setState({ showLoader: true });
    let model = {
      pageNumber: this.state.pageNumber,
      pageSize: this.state.pageSize,
    };
    const result = await client_getReturnOrderRequests(model);

    this.setState({
      showLoader: false,
      orderItems: result.result.data,
      resultOrderCount: result.result.count,
    });
  }

  async pageChangedAction(pageNumber) {
    this.setState({ showLoader: true, pageNumber: pageNumber });
    let model = {
      pageNumber: pageNumber,
      pageSize: this.state.pageSize,
    };
    const result = await client_getReturnOrderRequests(model);
    this.setState({
      showLoader: false,
      orderItems: result.result.data,
      resultOrderCount: result.result.count,
    });
  }

  render() {
    return (
      <>
        {this.state.showLoader ? (
          <Loading type="gray" width="10%" height="50%" />
        ) : this.state.orderItems.length == 0 ? (
          <EmptyReturnsRequest type="requested" />
        ) : (
          <div className="return-req">
            <ul className="return-req__list">
              {this.state.orderItems.map((item) => {
                return (
                  <li className="return-req__item" key={item.itemId}>
                    <header className="orders__item-header flex-wrap no-gutters">
                      <h2 className="orders__item-cnt-header">
                        <Translate id="returns.return" /> &nbsp;
                        {item.goodsCode}
                      </h2>
                      <span className="col-md-auto col-12 orders__header-gray-text">
                        <Translate id="orders.placed-on" />
                      </span>
                      <span className="col-md-auto col-12 orders__header-gray-text">
                        {item.orderStatusPlacedDateTime}
                      </span>

                      <div className="col-12 return-req__detail">
                        <div className="row no-gutters justify-content-between">
                          <div className="col-12 col-lg-7">
                            <ProtraitPhonesAndBigger>
                              <h4 className="return-req__text1">
                                <Translate id="returns.pickup" />
                              </h4>
                            </ProtraitPhonesAndBigger>
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-12 col-md-7 p-0">
                                <i className="orderDetail__addr-icon">
                                  <BusinessIcon />
                                </i>
                                <p className="orderDetail__header-text orderDetail__header-text--margin">
                                  {item.adAddress}
                                </p>
                              </div>

                              <div className="col-12 ml-4 ml-md-0 col-md-3">
                                <span className="orderDetail__header-text d-block">
                                  {item.adTransfereeName +
                                    " " +
                                    item.adTransfereeFamily}
                                </span>
                                <span className="orderDetail__header-text d-block">
                                  {this.phoneUtil.format(
                                    this.phoneUtil.parseAndKeepRawInput(
                                      item.phoneCode + item.transfereeMobile,
                                      item.iso
                                    ),
                                    this.PNF.INTERNATIONAL
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 mt-5 mt-lg-0 col-lg-3 text-align-right">
                            <h4 className="return-req__text1">
                              <Translate id="returns.refund-method" />
                            </h4>
                            {item.returnActionId === 1 && (
                            <img
                              src={jyalBlackIcon}
                              alt="jyal refund icon"
                              className="d-inline"
                            />
                            )}
                            <span
                              style={{ verticalAlign: "middle" }}
                              className="d-inline ml-4 orders__header-gray-text"
                            >
                              {item.returnAction}
                            </span>
                          </div>
                        </div>
                      </div>
                    </header>
                    <ReturnItem
                      withoutRightBox
                      withoutModelNumber
                      data={item}
                      currency={this.props.currency}
                    />
                  </li>
                );
              })}
            </ul>
            <div>
              <Pagination
                activePage={this.state.pageNumber}
                itemsCountPerPage={this.state.pageSize}
                totalItemsCount={this.state.resultOrderCount}
                itemClass="pager__item"
                innerClass="pager"
                linkClass="pager__link"
                activeLinkClass="active"
                pageRangeDisplayed={5}
                onChange={(pageNumber) => {
                  this.props.pageChangedAction(pageNumber);
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}
