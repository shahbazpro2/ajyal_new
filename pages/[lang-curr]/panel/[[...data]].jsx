import React from "react";
import { withRouter } from "next/router";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import {
  translationsPayload,
  mergeTranslations,
} from "../../../translations/payload";
import UserPanelTranslations from "../../../translations/user-panel-translations.json";
import HeaderTranslations from "./../../../translations/header-translations.json";
import { isServer } from "../../../lib/isServer";
// import { StaticRouter, BrowserRouter } from "react-router-dom";
// import Footer from "../../../components/app/footer";
// import { Header } from "../../../components/app/header";
import {
  server_fetchHeader,
  server_fetchFooter,
} from "../../../lib/api/client/serverCommon";
import Cookies from "js-cookie";
import Head from "next/head";
import dynamic from "next/dynamic";
import {
  WithUserAgentProps,
  withUserAgent,
  useUserAgent,
} from "next-useragent";

const PanelDesktop = dynamic(() => import("./PanelDesktop"));
const PanelMobile = dynamic(() => import("./PanelMobile"));

class Panel extends React.Component {
  constructor(props) {
    super(props);

    if (!isServer()) {
      this.redirect = false;
      this.isLogin = true;
      const token = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name);
      // check user is login or not
      if (!token) {
        this.isLogin = false;
      }

      if (!this.isLogin) {
        if (this.props.ua.isDesktop) {
          this.props.router.push(`/${this.props.curr}-${this.props.lang}/Auth`);
          this.redirect = true;
        } else {
          if (
            this.props.router.asPath ==
              `/${this.props.curr}-${this.props.lang}/panel` ||
            this.props.router.asPath ==
              `/${this.props.curr}-${this.props.lang}/panel/`
          ) {
            return;
          }

          this.props.router.push(`/${this.props.curr}-${this.props.lang}/Auth`);
          this.redirect = true;
        }
      }
    }
  }

  render() {
    if (this.redirect) {
      return <p>Redirecting...</p>;
    }

    const loc = "/" + this.props.router.asPath.split("/")[1] + "/panel";

    return (
      <>
        <LocalizeProvider
          initialize={translationsPayload(
            mergeTranslations(UserPanelTranslations, HeaderTranslations),
            this.props.lang
          )}
        >
          <Translate>
            {({ translate: t }) => {
              return (
                <Head>
                  <title>{t("@userpanelTitle")}</title>
                </Head>
              );
            }}
          </Translate>
          {!this.props.ua.isDesktop ? (
            <PanelMobile
              wishCount={this.props.data.header?.wishListCount}
              customerFullName={this.props.data.header?.customerFullName}
              {...this.props}
              loc={loc}
            />
          ) : (
            <PanelDesktop {...this.props} loc={loc} />
          )}
        </LocalizeProvider>
      </>
    );
  }
}

export default connect()(withRouter(withUserAgent(Panel)));

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const ua = useUserAgent(context.req.headers["user-agent"]);

    const Result = await Promise.all([
      server_fetchHeader(ua.isDesktop),
      server_fetchFooter(),
    ]);

    return {
      props: {
        ua,
        useragent: ua.source,
        data: { header: Result[0].result, footer: Result[1].result },
      },
    };
  }
);
