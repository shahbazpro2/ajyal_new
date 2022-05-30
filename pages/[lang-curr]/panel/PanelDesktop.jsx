import React from "react";
import { StaticRouter, BrowserRouter } from "react-router-dom";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import UserPanel from "../../../components/app/pages/UserPanel/UserPanel";
import { isServer } from "../../../lib/isServer";

const context = {};

export default class PanelDesktop extends React.Component {
  render() {
    const userPanel = <UserPanel lang={this.props.lang} loc={this.props.loc} />;
    return (
      <>
        {isServer() ? (
          <StaticRouter context={context} location={this.props.router.asPath}>
            <Header
              data={this.props.data.header}
              lang={this.props.lang}
              curr={this.props.curr}
              loc={this.props.loc}
              isDesktop = {true}
            />

            {userPanel}
          </StaticRouter>
        ) : (
          <BrowserRouter>
            <Header
              data={this.props.data.header}
              lang={this.props.lang}
              curr={this.props.curr}
              loc={this.props.loc}
              isDesktop = {true}
            />

            {userPanel}
          </BrowserRouter>
        )}

        <Footer data={this.props.data.footer} lang={this.props.lang} isDesktop = {true} cartCount ={this.props.data.header.cartCount}/>
      </>
    );
  }
}
