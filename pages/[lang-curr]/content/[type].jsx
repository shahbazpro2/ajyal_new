import React from "react";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import Error from "next/error";
import { translationsPayload } from "../../../translations/payload";
import HeaderTranslations from "../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import {
  server_fetchHeader,
  server_fetchFooter,
} from "../../../lib/api/client/serverCommon";
import Head from "next/head";
import Content from "../../../components/app/pages/content/Content";
import { server_fetchContent } from "../../../lib/api/client/serverContent";
import {
  WithUserAgentProps,
  withUserAgent,
  useUserAgent,
} from "next-useragent";
class TrackingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.errorCode !== 200) {
      return <Error statusCode={this.props.errorCode} />;
    }
    const content = <Content content={this.props.content} />;
    return (
      <LocalizeProvider
        initialize={translationsPayload(HeaderTranslations, this.props.lang)}
      >
        <Translate>
          {({ translate: t }) => {
            return <Head>{/* <title>{t("@TrackingTitle")}</title> */}</Head>;
          }}
        </Translate>
        <Header
          data={this.props.data.header}
          lang={this.props.lang}
          curr={this.props.curr}
          isDesktop={this.props.ua.isDesktop}
        />
        {content}
        <Footer lang={this.props.lang} isDesktop={this.props.ua.isDesktop} data={this.props.data.footer} cartCount ={this.props.data.header.cartCount}/>
      </LocalizeProvider>
    );
  }
}

export default connect()(TrackingPage);

export const getServerSideProps = wrapper.getServerSideProps(
  async ({req, query}) => {
    // const generatedFilters = searchQueryToFilters(query);
    const { type } = query;
    const ua = useUserAgent(req.headers["user-agent"]);

    const Result = await Promise.all([
      server_fetchHeader(ua.isDesktop),
      server_fetchFooter(),
      server_fetchContent(type),
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
        errorCode: 200,
        content: Result[2].result,
        ua,
        data: {
          header: Result[0].result,
          footer: Result[1].result,
        },
      },
    };
  }
);
