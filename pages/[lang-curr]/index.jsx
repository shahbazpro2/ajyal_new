import React from "react";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../store";
import { translationsPayload } from "../../translations/payload";
import HeaderTranslations from "./../../translations/header-translations.json";
import Footer from "../../components/app/footer";
import { Header } from "../../components/app/header";
import Index from "../../components/app/pages/index/index";
import {
  server_fetchHeader,
  server_fetchFooter,
} from "../../lib/api/client/serverCommon";
import Head from "next/head";
import {
  useUserAgent,
} from "next-useragent";
class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const index = <Index data={this.props.data.result} />;

    return (
      <>
        <Head>
          <title>ajyal.bh | Online Shopping in Bahrain</title>

        </Head>

        <LocalizeProvider
          initialize={translationsPayload(HeaderTranslations, this.props.lang)}
        >
          <Translate>
            {({ translate: t }) => {
              return (
                <Head>
                  <title>{this.props.data.header.pageTitle}</title>
                  <meta property="og:title" content={this.props.data.header.metaTitle} key="og:title" />
                  <meta property="og:description" content={this.props.data.header.metaDescription} key="og:description" />
                  <meta property="og:image" content={process.env.NEXT_PUBLIC_LOGO_PREFIX + "/" + this.props.data.header.logoUrlShopHeader} key="og:image" />
                  <meta property="twitter:title" content={this.props.data.header.metaTitle} key="twitter:title" />
                  <meta property="twitter:description" content={this.props.data.header.metaDescription} key="twitter:description" />
                  <meta property="twitter:image" content={process.env.NEXT_PUBLIC_LOGO_PREFIX + "/" + this.props.data.header.logoUrlShopHeader} key="twitter:image" />
                  <meta property="title" content={this.props.data.header.metaTitle} key="title" />
                  <meta
                    property="description"
                    content={this.props.data.header.metaDescription}
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
          {index}
          <Footer lang={this.props.lang} isDesktop={this.props.ua.isDesktop} data={this.props.data.footer} cartCount={this.props.data.header.cartCount} />
        </LocalizeProvider>
      </>
    );
  }
}

export default connect()(IndexPage);


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
      data: {
        header: Result[0].result,
        footer: Result[1].result
      },
    },
  };
});
