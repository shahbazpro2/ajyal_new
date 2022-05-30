import React from "react";
import { LocalizeProvider } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import Error from "next/error";
import {
  translationsPayload,
  mergeTranslations,
} from "../../../translations/payload";
import searchTranslations from "../../../translations/search-translations.json";
import HeaderTranslations from "../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import { Provider } from "../../../components/app/pages/Provider";
import {
  server_fetchHeader,
  server_fetchFooter,
} from "../../../lib/api/client/serverCommon";
import { providerQueryToFilters } from "../../../lib/QueryToFilters";
import { serverProviderUpdate } from "../../../components/app/pages/Provider/providerSlice";
import { server_fetchProvider } from "../../../lib/api/client/serverProvider";
import Head from "next/head";
import {
  WithUserAgentProps,
  withUserAgent,
  useUserAgent,
} from "next-useragent";
class ProviderPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.errorCode !== 200) {
      return <Error statusCode={this.props.errorCode} />;
    }
    const provider = <Provider />;
    return (
      <>
        <Head>
          <title>ajyal.bh | {this.props.providerName}</title>
          <meta
            property="og:title"
            content={this.props.providerName}
            key="og:title"
          />
          <meta property="title" content={this.props.providerName} key="title" />
        </Head>
        <LocalizeProvider
          initialize={translationsPayload(
            mergeTranslations(HeaderTranslations, searchTranslations),
            this.props.lang
          )}
        >
          <Header
            data={this.props.data.header}
            lang={this.props.lang}
            curr={this.props.curr}
            isDesktop={this.props.ua.isDesktop}
          />
          {provider}
          <Footer isDesktop={this.props.ua.isDesktop} data={this.props.data.footer} lang={this.props.lang} cartCount ={this.props.data.header.cartCount}/>
        </LocalizeProvider>
      </>
    );
  }
}

export default connect()(ProviderPage);

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ params, store, query,req }) => {
  const ua = useUserAgent(req.headers["user-agent"]);
    // initialize page lang and currency
    const generatedFilters = providerQueryToFilters(query);
    const providerName = params.providerName[0];

    const Result = await Promise.all([
      server_fetchHeader(ua.isDesktop),
      server_fetchFooter(),
      server_fetchProvider(generatedFilters, providerName),
    ]);


    if (Result[2].status !== 200) {
      return {
        props: {
          ua,
          errorCode: Result[2].status,
        },
      };
    }

    store.dispatch(
      serverProviderUpdate({
        filters: generatedFilters,
        providerName: providerName,
        provider: Result[2].result,
      })
    );

    return {
      props: {
        errorCode: 200,
        ua,
        providerName: providerName,
        data: { header: Result[0]?.result, footer: Result[1]?.result },
      },
    };
  }
);
