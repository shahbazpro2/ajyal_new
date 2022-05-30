import React from "react";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { wrapper } from "../../../store";
import { translationsPayload} from "../../../translations/payload";
import authTranslations from "../../../translations/auth-translations.json";
import Auth from "../../../components/app/pages/Auth";
import { withRouter } from "next/router";
import Cookies from "js-cookie";
import { isServer } from "../../../lib/isServer";
import { client_authDetials } from "../../../lib/api/client/clientCustomer";
import Head from "next/head";
import {
  useUserAgent,
} from "next-useragent";
class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    if (!isServer()) {
      this.redirect = false;
      const token = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name);
      if (token) {
        this.props.router.push(
          `/${this.props.curr}-${this.props.lang}/panel/profile`
        );
        this.redirect = true;
      }
    }
  }

  render() {
    if (this.redirect) {
      return <p>Redirecting...</p>;
    }
    return (
      <>
        <LocalizeProvider
          initialize={translationsPayload(
            authTranslations , this.props.lang)}
        >
          <Translate>
            {({ translate: t }) => {
              return (
                <Head>
                  <title>{t("@authtitle")}</title>
                </Head>
              );
            }}
          </Translate>
          <Auth
            lang={this.props.lang}
            loc={this.props.router.asPath}
            data={this.props.data}
            isDesktop={this.props.ua.isDesktop}
          />
        </LocalizeProvider>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(withRouter(AuthPage));

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const Result = await Promise.all([client_authDetials()]);
  const ua = useUserAgent(context.req.headers["user-agent"]);

  return {
    props: {
      ua,
      data: Result[0].result,
    },
  };
});
// export const getStaticProps = wrapper.getStaticProps(
//   async ({ params, store }) => {
//     const lang = detectLang(params["lang-curr"]);
//     const curr = detectCurrency(params["lang-curr"]);
//     store.dispatch(updateLang(lang));
//     store.dispatch(updateCurrency(curr));
//     axiosClient.setLangAndCurrency(lang, curr);
//     return {
//       props: { lang, curr },
//     };
//   }
// );

// export async function getStaticPaths() {
//   return {
//     paths: [...langUsdParams],
//     fallback: false, // See the "fallback" section below
//   };
// }
