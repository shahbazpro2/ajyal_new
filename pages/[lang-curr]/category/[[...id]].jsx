import React from "react";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import { translationsPayload } from "../../../translations/payload";
import HeaderTranslations from "../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import { Categories } from "../../../components/app/pages/Categories";
import {
  server_fetchHeader,
  server_fetchFooter,
} from "../../../lib/api/client/serverCommon";
import Head from "next/head";
import {
  WithUserAgentProps,
  withUserAgent,
  useUserAgent,
} from "next-useragent";
class CategoriesPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const category = <Categories catId2={this.props.catId} />;
    return (
      <>
        <LocalizeProvider
          initialize={translationsPayload(HeaderTranslations, this.props.lang)}
        >
          <Translate>
            {({ translate: t }) => {
              return (
                <Head>
                  <title>{t("@categoryTitle")}</title>
                  <meta property="og:title" content={t("@categoryTitle")} key="og:title" />
                 <meta property="title" content={t("@categoryTitle")} key="title" />
                  <meta
                    property="description"
                    content={t("@categoryTitle")}
                    key="description"
                  />
                  <meta
                    property="keywords"
                    content={this.props.data.header.metaKeywords}
                    key="keywords"
                  />
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
          {category}
          <Footer data={this.props.data.footer} isDesktop={this.props.ua.isDesktop} lang={this.props.lang} cartCount ={this.props.data.header.cartCount}/>
        </LocalizeProvider>
      </>
    );
  }
}

export default connect()(CategoriesPage);

export const getServerSideProps = wrapper.getServerSideProps(async ({ query,req }) => {
  const ua = useUserAgent(req.headers["user-agent"]);

  const Result = await Promise.all([
    server_fetchHeader(ua.isDesktop),
    server_fetchFooter(),
  ]);
  return {
    props: {
      ua,
      catId: query.id ? query.id[0] : null,
      data: { header: Result[0].result, footer: Result[1].result },
    },
  };
});
