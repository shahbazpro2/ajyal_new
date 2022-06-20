import React from "react";
// import "./Returns.scss";
// import "./Returns-rtl.scss";

import BoxStyle2 from "../../../../../common/BoxStyle2/BoxStyle2";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Translate, withLocalize } from "react-localize-redux";
import {
  ReturnsRequested,
  ReturnsDelivered,
  ReturnsAdd,
  ReturnsAddSingle,
} from "./ReturnsLayouts";
import { connect } from "react-redux";
import { ReactComponent as AddIcon } from "./../../../../../../assets/icons/add-icon.svg";
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import {
  LandScapePhones,
  LandScapePhonesAndBigger,
} from "../../../../../../Responsive";

class Returns extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: {},
    };

    //this code is for Development purpose

    this.lang = this.props.lang;

  }

  selectItemForReturn = (item) => {
    this.setState({ item: item });
  };

  render() {
    return (
      <section className="returns">
        <Switch>
          <Route
            path={`${this.props.match.path}/add/:id`}
            render={(props) => {
              return (
                <ReturnsAddSingle
                  {...props}
                  data={this.state.item}
                  currency = {this.props.currency}
                  lang = {this.props.lang}
                />
              );
            }}
          />
          <Route
            path={`${this.props.match.path}/add`}
            render={(props) => {
              return <ReturnsAdd currency = {this.props.currency}  />;
            }}
          />
          <Route path={`${this.props.match.path}`}>
            <BoxStyle2 className="returns__box">
              <section className="goodDetailTabs">
                <Tabs>
                  <TabList>
                    <Tab>
                      <Translate id="returns.return-request-tab1" />
                    </Tab>
                    <Tab>
                      <Translate id="returns.return-delivered-tab2" />
                    </Tab>
                    <LandScapePhonesAndBigger>
                      <Link
                        to={`${this.props.match.url}/add`}
                        className="primary-btn returns__add-btn primary-btn--icon"
                      >
                        <AddIcon className="primary-btn-icon" />
                        <Translate id="returns.add-btn" />
                      </Link>
                    </LandScapePhonesAndBigger>
                  </TabList>

                  <TabPanel>
                    <ReturnsRequested   currency = {this.props.currency}/>
                  </TabPanel>
                  <TabPanel>
                    <ReturnsDelivered   currency = {this.props.currency}/>
                  </TabPanel>
                </Tabs>
              </section>
              <LandScapePhones>
                <div className="checkout-fix">
                  <Link
                    to={`${this.props.match.url}/add`}
                    className="primary-btn returns__add-btn primary-btn--icon"
                  >
                    <Translate id="returns.add-btn" />
                  </Link>
                </div>
              </LandScapePhones>
            </BoxStyle2>
          </Route>
        </Switch>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.appConfig.lang.code,
    currency: state.appConfig.currency.code
  };
};

export default connect(mapStateToProps)(Returns);
