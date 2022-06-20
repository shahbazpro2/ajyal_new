import React from "react";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import {
  translationsPayload,
  mergeTranslations,
} from "../../../translations/payload";
import verndorsTranslations from "../../../translations/vendors-translations.json";
import HeaderTranslations from "../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import {
  server_fetchHeader,
  server_fetchFooter,
} from "../../../lib/api/client/serverCommon";
import Head from "next/head";
import { Vendors } from "../../../components/app/pages/Vendors";
import { server_vendorCategoies } from "../../../lib/api/client/serverVendors";
import {
  WithUserAgentProps,
  withUserAgent,
  useUserAgent,
} from "next-useragent";
class VerndorsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const vendors = <Vendors cats={this.props.data.categories} />;
    return (
      <LocalizeProvider
        initialize={translationsPayload(
          mergeTranslations(verndorsTranslations, HeaderTranslations),
          this.props.lang
        )}
      >
        <Translate>
          {({ translate: t }) => {
            return (
              <Head>
                <title>{t("@VendorTitle")}</title>
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
        {vendors}
        <Footer lang={this.props.lang} isDesktop={this.props.ua.isDesktop} data={this.props.data.footer} cartCount ={this.props.data.header.cartCount}/>
      </LocalizeProvider>
    );
  }
}

export default connect()(VerndorsPage);

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // const generatedFilters = searchQueryToFilters(query);
    const ua = useUserAgent(context.req.headers["user-agent"]);

    const Result = await Promise.all([
      server_fetchHeader(ua.isDesktop),
      server_fetchFooter(),
      server_vendorCategoies(),
      // server_fetchSearch(generatedFilters),
    ]);

    return {
      props: {
        ua,
        data: {
          header: Result[0].result,
          footer: Result[1].result,
          categories: Result[2].result,
        },
      },
    };
  }
);
