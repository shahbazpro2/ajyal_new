import React from "react";
import { PanelNavi } from "./PanelLayouts";
// import ProfileTranslations from "./../../../../translations/user-panel-translations.json";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
import { CSSTransition, SwitchTransition } from "react-transition-group";
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
import { DesktopsAndBigger } from "../../../../Responsive";
import { ScrollToTopReactRouter } from "../../ScrollToTop/ScrollToTop";
import { selectLang } from "../../../../appConfigSlice";

class UserPanel extends React.Component {
  constructor(props) {
    super(props);

    // this.content = data[this.lang[1]].search;
    // this.content2 = data2[this.lang[1]].goodsSliderComponent;

    // this.props.addTranslation(ProfileTranslations);
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
    // console.log(this.matchedPath)
    return (
      <div className="container siteWidthContainer container-home container-home-profile">
        <div className="row">
          <DesktopsAndBigger className="col-2-5 pl-0">
            <div style={{ marginBottom: "-25px" }}>
              <PanelNavi loc={this.matchedPath} />
            </div>
          </DesktopsAndBigger>

          <div className="col padd-sm-0">
            <ScrollToTopReactRouter />
              <section className="user-panel">
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
                  <Route
                    path={`${this.matchedPath}/claims`}
                    component={Claims}
                  />
                  <Route
                    strict
                    path={`${this.matchedPath}/profile`}
                    component={Profile}
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
  };
};

export default connect(mapStateToProps)(UserPanel);
