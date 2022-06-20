import React from "react";
import { withRouter } from "next/router";
import Error from "next/error";
import { LocalizeProvider } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import {
  translationsPayload,
  mergeTranslations,
} from "../../../translations/payload";
import goodTranslations from "../../../translations/good-detail-translations.json";
import HeaderTranslations from "../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import { GoodDetail } from "../../../components/app/pages/GoodDetail";
import { slugy } from "../../../lib/helpers";
import {
  server_fetchFooter,
  server_fetchHeader,
} from "../../../lib/api/client/serverCommon";
import { server_fetchGoodDetail } from "../../../lib/api/client/serverGoodDetail";
import Head from "next/head";
import {
  WithUserAgentProps,
  withUserAgent,
  useUserAgent,
} from "next-useragent";
class GoodDetailPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.errorCode !== 200) return;
    const slugyTitle = slugy(this.props.data.good.title);
    const query = this.props.router.query;
    if (
      !this.props.data.goodPermalink ||
      slugyTitle !== slugy(this.props.data.goodPermalink)
    ) {
      this.props.router.replace(
        `${slugyTitle}`,
        `/${query["lang-curr"]}/product/${query["good"][0]}/${query["good"][1]}/${slugyTitle}`,
        {
          shallow: true,
        }
      );
    }
  }

  render() {
    if (this.props.errorCode !== 200) {
      return <Error statusCode={this.props.errorCode} />;
    }

    const goodDetail = <GoodDetail data={this.props.data.good} />;

    return (
      <>
        <Head>
          <title>ajyal.bh | {this.props.data.good.title}</title>
          <meta property="og:title" content={this.props.data.good.metaTitle} key="og:title" />
          <meta property="og:description" content={this.props.data.good.metaDescription} key="og:description" />
          <meta property="og:image" content={process.env.NEXT_PUBLIC_Goods_PREFIX + "/" + this.props.data.good.goodsId + "/thumb-" + this.props.data.good.image} key="og:image" />
          <meta property="twitter:title" content={this.props.data.good.metaTitle} key="twitter:title" />
          <meta property="twitter:description" content={this.props.data.good.metaDescription} key="twitter:description" />
          <meta property="twitter:image" content={process.env.NEXT_PUBLIC_Goods_PREFIX + "/" + this.props.data.good.goodsId + "/thumb-" + this.props.data.good.image} key="twitter:image" />
          <meta property="title" content={this.props.data.good.metaTitle} key="title" />
          <meta property="description" content={this.props.data.good.metaDescription} key="description" />
          <meta property="keywords" content={this.props.data.good.metaKeywords} key="keywords" />
        </Head>

        <LocalizeProvider
          initialize={translationsPayload(
            mergeTranslations(goodTranslations, HeaderTranslations),
            this.props.lang
          )}
        >
          <Header
            data={this.props.data.header}
            lang={this.props.lang}
            curr={this.props.curr}
            isDesktop={this.props.ua.isDesktop}
          />
          {goodDetail}
          <Footer data={this.props.data.footer} isDesktop={this.props.ua.isDesktop} lang={this.props.lang} cartCount ={this.props.data.header.cartCount}/>
        </LocalizeProvider>
      </>
    );
  }
}

export default connect()(withRouter(GoodDetailPage));

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
  // initialize page lang and currency

  // getting goodId & providerId
  const [goodId, providerId, goodPermalink] = ctx.params.good;
  const ua = useUserAgent(ctx.req.headers["user-agent"]);

  const Result = await Promise.all([
    server_fetchHeader(ua.isDesktop),
    server_fetchFooter(),
    server_fetchGoodDetail(goodId, providerId),
  ]);

  return {
    props: {
      errorCode: Result[2].status ? Result[2].status : 500,
      ua,
      data: {
        header: Result[0]?.result,
        footer: Result[1]?.result,
        good: Result[2]?.result,
        // footer: {},
        // good: data,
        goodPermalink: goodPermalink ? goodPermalink : "",
        // good: {},
      },
    },
  };
});
