import React from "react";
import { withRouter } from "next/router";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { updateCurrency } from "../../../appConfigSlice";
import { translationsPayload } from "../../../translations/payload";
import shopTranslations from "../../../translations/create-shop-translations.json";
import CreateShop from "../../../components/app/pages/CreateShop/CreateShop";
import Head from "next/head";
import { wrapper } from "../../../store";

class Shop extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <LocalizeProvider
          initialize={translationsPayload(shopTranslations, this.props.lang)}
        >
          <Translate>
            {({ translate: t }) => {
              return (
                <Head>
                  <title>{t("@sellerTitle")}</title>
                  <meta
                    property="og:title"
                    content={t("@sellerTitle")}
                    key="og:title"
                  />
                  <meta
                    property="title"
                    content={t("@sellerTitle")}
                    key="title"
                  />
                </Head>
              );
            }}
          </Translate>
          <CreateShop loc={this.props.router.asPath} />
        </LocalizeProvider>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    langs: state.appConfig.currency.name,
  };
};
export default connect(mapStateToProps, { updateCurrency })(withRouter(Shop));

export const getServerSideProps = wrapper.getServerSideProps(async () => {
  return {
    props: {},
  };
});
