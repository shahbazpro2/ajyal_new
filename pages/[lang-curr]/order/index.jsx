import React from "react";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import {
  translationsPayload,
  mergeTranslations,
} from "../../../translations/payload";
import orderTranslations from "../../../translations/order-translations.json";
import HeaderTranslations from "./../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import { Order } from "../../../components/app/pages/Order";
import {
  server_fetchHeader,
  server_fetchFooter,
} from "../../../lib/api/client/serverCommon";
import Cookies from "js-cookie";
import { isServer } from "../../../lib/isServer";
import { selectLang, selectCurr } from "../../../appConfigSlice";
import { withRouter } from "next/router";
import Head from "next/head";
import {
  WithUserAgentProps,
  withUserAgent,
  useUserAgent,
} from "next-useragent";
class OrderPage extends React.Component {
  constructor(props) {
    super(props);

    if (!isServer()) {
      this.redirect = false;
      const token = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name);
      if (!token) {
        this.props.router.push(`/${this.props.curr}-${this.props.lang}/Auth`);
        this.redirect = true;
      }
    }
  }

  render() {
    if (this.redirect) {
      return <p>Redirecting...</p>;
    }

    const order = <Order />;
    return (
      <LocalizeProvider
        initialize={translationsPayload(
          mergeTranslations(orderTranslations, HeaderTranslations),
          this.props.lang
        )}
      >
        <Translate>
          {({ translate: t }) => {
            return (
              <Head>
                <title>{t("@orderTitle")}</title>
              </Head>
            );
          }}
        </Translate>
        <Header
          data={this.props.data.header}
          lang={this.props.lang}
          curr={this.props.curr}
          isDesktop={this.props.ua.isDesktop}
        />
        {order}
        <Footer data={this.props.data.footer} isDesktop={this.props.ua.isDesktop} lang={this.props.lang} cartCount ={this.props.data.header.cartCount}/>
      </LocalizeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
  };
};

export default connect(mapStateToProps)(withRouter(OrderPage));

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const ua = useUserAgent(context.req.headers["user-agent"]);

  const Result = await Promise.all([
    server_fetchHeader(ua.isDesktop),
    server_fetchFooter(),
  ]);

  return {
    props: {
      ua,
      data: { header: Result[0].result, footer: Result[1].result },
    },
  };
});
