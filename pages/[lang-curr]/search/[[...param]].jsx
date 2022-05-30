import React from "react";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import {
  translationsPayload,
  mergeTranslations,
} from "../../../translations/payload";
import searchTranslations from "../../../translations/search-translations.json";
import HeaderTranslations from "../../../translations/header-translations.json";
import Footer from "../../../components/app/footer";
import { Header } from "../../../components/app/header";
import { Search } from "../../../components/app/pages/Search";
import {
  server_fetchHeader,
  server_fetchFooter,
  server_categoryBrands,
} from "../../../lib/api/client/serverCommon";
import { server_fetchSearch } from "../../../lib/api/client/serverSearch";
import { serverSearchUpdate } from "../../../components/app/pages/Search/searchSlice";
import { searchQueryToFilters } from "../../../lib/QueryToFilters";
import Head from "next/head";
import {
  WithUserAgentProps,
  withUserAgent,
  useUserAgent,
} from "next-useragent";
class SearchPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const search = <Search />;
    return (
      <LocalizeProvider
        initialize={translationsPayload(
          mergeTranslations(searchTranslations, HeaderTranslations),
          this.props.lang
        )}
      >
        <Translate>
          {({ translate: t }) => {
            return (
              <Head>
                <title>{t("@searchTitle")}</title>
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
        {search}
        <Footer lang={this.props.lang} isDesktop={this.props.ua.isDesktop} data={this.props.data.footer} cartCount ={this.props.data.header.cartCount}/>
      </LocalizeProvider>
    );
  }
}

export default connect()(SearchPage);

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ req, store, query }) => {
    const generatedFilters = searchQueryToFilters(query);
    const ua = useUserAgent(req.headers["user-agent"]);

    const Result = await Promise.all([
      server_fetchHeader(ua.isDesktop),
      server_fetchFooter(),
      server_fetchSearch(generatedFilters),
      server_categoryBrands({
        pageSize: generatedFilters.brandId.length,
        pageNumber: 0,
        BrandIds: generatedFilters.brandId,
        catId: generatedFilters.id,
        search: "",
      }),
    ]);

    store.dispatch(
      serverSearchUpdate({
        search: Result[2].result,
        // search: data.result,
        filters: generatedFilters,
        brands: Result[3].result || [],
      })
    );

    return {
      props: {
        ua,
        data: { header: Result[0].result, footer: Result[1].result },
      },
    };
  }
);
