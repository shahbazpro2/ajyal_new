import React from "react";
import { ReturnItem } from "..";
import { Translate } from "react-localize-redux";
import { client_getReturnOrderDelivereds } from "./../../../../../../../../lib/api/client/clientUserPanel";
import { format } from "date-fns";
import Pagination from "react-js-pagination";
import EmptyReturnsRequest from "../EmptyReturnsRequest";
import { Loading } from "../../../../../../../common";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEmptyPage: true,
      showLoader: false,
      pageNumber: 1,
      pageSize: 10,
      orderItems: [],
      resultOrderCount: 0,
    };

    this.goods_Pre = process.env.NEXT_PUBLIC_BrandImages_PREFIX;
  }

  async componentDidMount() {
    this.setState({ showLoader: true });
    let model = {
      pageNumber: this.state.pageNumber,
      pageSize: this.state.pageSize,
    };
    const result = await client_getReturnOrderDelivereds(model);
    this.setState({ showLoader: false, orderItems: result.result.data, resultOrderCount : result.result.count  });
  }

  async pageChangedAction(pageNumber) {
    this.setState({ showLoader: true, pageNumber: pageNumber });
    let model = {
      pageNumber: pageNumber,
      pageSize: this.state.pageSize,
    };
    const result = await client_getReturnOrderDelivereds(model);
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
        <EmptyReturnsRequest type="delivered"/>
      ) : (
      <div className="return-del">
        <div className="return-req">
          <ul className="return-req__list">
            {this.state.orderItems.map((item) => {
              return (
                <li className="return-req__item">
                  <header className="orders__item-header flex-wrap no-gutters">
                    <h2 className="orders__item-cnt-header">
                      <Translate id="returns.return" /> &nbsp; {item.goodsCode}
                    </h2>
                    <span className="col-md-auto col-12 orders__header-gray-text">
                      <Translate id="orders.placed-on" />
                      {item.orderStatusPlacedDateTime}
                    </span>
                  </header>
                  <ReturnItem
                    withoutModelNumber
                    withoutRightBox
                    data={item}
                    currency={this.props.currency}
                  />
                </li>
              );
            })}
          </ul>
        </div>
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
