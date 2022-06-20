import React from "react";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import {
  translationsPayload,
  mergeTranslations,
} from "../../../translations/payload";
import cartTranslation from "../../../translations/cart-whishlist-translations.json";
import HeaderTranslations from "./../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import { CartAndWishlist } from "../../../components/app/pages/CartAndWishlist";
import {
  server_fetchHeader,
  server_fetchFooter,
} from "../../../lib/api/client/serverCommon";
import Head from "next/head";
import {
  useUserAgent,
} from "next-useragent";
class CartPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cart = <CartAndWishlist />;
    return (
      <>
        <LocalizeProvider
          initialize={translationsPayload(
            mergeTranslations(HeaderTranslations, cartTranslation),
            this.props.lang
          )}
        >
          <Translate>
            {({ translate: t }) => {
              return (
                <Head>
                  <title>{t("@cartTitle")}</title>
                 <meta property="og:title" content={t("@cartTitle")} key="og:title" />
                 <meta property="title" content={t("@cartTitle")} key="title" />
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
          {cart}
          <Footer data={this.props.data.footer} isDesktop={this.props.ua.isDesktop} lang={this.props.lang} cartCount ={this.props.data.header.cartCount}/>
        </LocalizeProvider>
      </>
    );
  }
}

export default connect()(CartPage);

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const ua = useUserAgent(context.req.headers["user-agent"]);

  // initialize page lang and currency
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
