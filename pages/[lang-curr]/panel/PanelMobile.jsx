import React from "react";
import { StaticRouter, BrowserRouter } from "react-router-dom";
import Footer from "../../../components/app/footer";
// import Footer from "../../../components/app/footer";
// import { Header } from "../../../components/app/header";
import UserPanelMobile from "../../../components/app/pages/UserPanel/UserPanel-mobile";
import { isServer } from "../../../lib/isServer";

const context = {};

export default class PanelMobile extends React.Component {
  render() {
    const userPanel = (
      <UserPanelMobile
        {...this.props}
        lang={this.props.lang}
        loc={this.props.loc}
      />
    );
    return (
      <>
        {isServer() ? (
          <StaticRouter context={context} location={this.props.router.asPath}>
            {userPanel}
          </StaticRouter>
        ) : (
          <BrowserRouter>{userPanel}</BrowserRouter>
        )}
        <Footer
          data={this.props.data.footer}
          lang={this.props.lang}
          isDesktop = {false}
          cartCount={this.props.data.header.cartCount}
        />
      </>
    );
  }
}
