import React from "react";
// import { PanelNavi } from "./PanelLayouts";
// import ProfileTranslations from "./../../../../translations/user-panel-translations.json";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
// import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Switch, Route, Redirect } from "react-router";
import {
  Profile,
  Addresses,
  Payment,
  Credits,
  Returns,
  Preference,
  Claims,
  Orders,
} from "./PanelPages";
// import { DesktopsAndBigger } from "../../../../Responsive";
import { ScrollToTopReactRouter } from "../../ScrollToTop/ScrollToTop";
import { selectCurr, selectLang } from "../../../../appConfigSlice";
import ProfileMenu from "./PanelPages/ProfileMenu/ProfileMenu";
import MobileBack from "./PanelLayouts/MobileBack";
import { withRouter } from "react-router";

class UserPanelMobile extends React.Component {
  constructor(props) {
    super(props);
    this.matchedPath = this.props.loc;
  }

  renderBoxHeader() {
    return (
      <h2 className="user-panel__box-header">
        <Translate id="nav.profile" />
      </h2>
    );
  }
  render() {
    return (
      <div className="container siteWidthContainer container-home container-home-profile">
        <div className="row no-gutters">
          {/* <DesktopsAndBigger className="col-2-5 pl-0">
            <div style={{ marginBottom: "-25px" }}>
              <PanelNavi loc={this.matchedPath} />
            </div>
          </DesktopsAndBigger> */}

          <div className="col disable-boxStyle">
            <ScrollToTopReactRouter />
            {this.props.location.pathname !=
              `/${this.props.curr}-${this.props.lang}/panel` && (
              <MobileBack
                onBack={() => {
                  this.props.history.push(this.matchedPath);
                }}
              />
            )}

            <section className="user-panel" style={{ marginBottom: "-25px" }}>
              {/* <SwitchTransition className="user-panel__container">
                <CSSTransition
                  key={
                    this.props.loc
                      ? this.props.loc
                      : "2412123"
                  }
                  classNames="user-panel__routes"
                  timeout={200}
                > */}
              <Switch>
                <Route
                  strict
                  path={`${this.matchedPath}/orders`}
                  component={Orders}
                />
                <Route
                  path={`${this.matchedPath}/addresses`}
                  component={Addresses}
                />
                <Route
                  path={`${this.matchedPath}/payment`}
                  component={Payment}
                />
                <Route
                  path={`${this.matchedPath}/credits`}
                  component={Credits}
                />
                <Route
                  path={`${this.matchedPath}/returns`}
                  component={Returns}
                />
                <Route
                  path={`${this.matchedPath}/preference`}
                  component={Preference}
                />
                <Route path={`${this.matchedPath}/claims`} component={Claims} />
                <Route
                  strict
                  path={`${this.matchedPath}/profile`}
                  component={Profile}
                />
                <Route
                  strict
                  render={(props) => {
                    return (
                      <ProfileMenu
                        {...props}
                        customerName={this.props.customerFullName}
                      />
                    );
                  }}
                  path={`${this.matchedPath}`}
                />
                {/* <Redirect to={`${this.props.match.url}/profile`} /> */}
              </Switch>
              {/* </CSSTransition>
              </SwitchTransition> */}
            </section>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
  };
};

export default connect(mapStateToProps)(withRouter(UserPanelMobile));
