import React from "react";
import { withRouter } from "next/router";
import Error from "next/error";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import {
  translationsPayload,
  mergeTranslations,
} from "../../../translations/payload";
import helpCenterTranlations from "../../../translations/help-center-translations.json";
import HeaderTranslations from "../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import {
  server_fetchFooter,
  server_fetchHeader,
} from "../../../lib/api/client/serverCommon";
import HelpSubHeader from "../../../components/app/helpSubHeader/HelpSubHeader";
import { HelpCenter } from "../../../components/app/pages/HelpCenter";
import {
  server_fetchHelp,
  server_fetchImage,
} from "../../../lib/api/client/serverHelpcenter";
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

  render() {
    if (this.props.errorCode !== 200) {
      return <Error statusCode={this.props.errorCode} />;
    }
    return (
      <LocalizeProvider
        initialize={translationsPayload(
          mergeTranslations(helpCenterTranlations, HeaderTranslations),
          this.props.lang
        )}
      >
        <Translate>
          {({ translate: t }) => {
            return (
              <Head>
                <title>{t("@helpcenterTitle")}</title>
                <meta property="og:title" content={t("@helpcenterTitle")} key="og:title" />
                 <meta property="title" content={t("@helpcenterTitle")} key="title" />
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
        <HelpSubHeader img={this.props.data.img} />
        <HelpCenter data={this.props.topics} />
        {/* {goodDetail} */}
        <Footer data={this.props.data.footer} isDesktop={this.props.ua.isDesktop} lang={this.props.lang} cartCount ={this.props.data.header.cartCount}/>
      </LocalizeProvider>
    );
  }
}

export default connect()(withRouter(GoodDetailPage));

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const ua = useUserAgent(context.req.headers["user-agent"]);

  const Result = await Promise.all([
    server_fetchHeader(ua.isDesktop),
    server_fetchFooter(),
    server_fetchHelp(),
    server_fetchImage(),
  ]);

  if (Result[2].status !== 200) {
    return {
      props: {
        ua,
        errorCode: Result[2].status,
      },
    };
  }

  return {
    props: {
      //   errorCode: Result[2].status ? Result[2].status : 500,
      // topics: data.result,
      topics: Result[2].result,
      errorCode: 200,
      ua,
      data: {
        // topics: Result[2].result,
        header: Result[0]?.result,
        footer: Result[1]?.result,
        img: Result[3]?.result,
      },
    },
  };
});
