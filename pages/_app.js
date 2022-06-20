import { wrapper } from "../store";
import "./../node_modules/react-toastify/dist/ReactToastify.min.css";
import "../styles/react-dropdown/style.css";
import "../styles/skeleton.min.css";
import "../styles/react-input-range/index.css";
import "../styles.scss";
import "../assets/scss/base/_utilities.scss";
// import './../styles/globals.css';
import "./../styles/owl.carousel.min.css";
import "./../styles/quill.snow.css";
import "../styles/globals.js";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/dist/client/router";
import { detectLang, detectCurrency } from "../lib/analyser";
import { isRtl } from "../lib/isRtl";
import { isServer } from "../lib/isServer";
import axiosClient from "./../lib/api/axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { SUCCE_LOGIN, updateLang, updateCurrency } from "../appConfigSlice";
import App from "next/app";
import cookieparser from "cookieparser";
import { checkValidCurr, checkValidLand } from "../lib/langRoutes";
import Router from "next/router";
import { PageLoading } from "../components/common";
import "react-virtualized/styles.css";
import { registerServiceWorker } from '../serviceWorker.js'

if (!isServer()) {
  const token = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name);
  const cartId = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name_cart);
  if (cartId) axiosClient.setCartId(cartId);
  if (token) axiosClient.setToken(token);
}

const MyApp = ({ Component, pageProps }) => {
  const vari = useRouter().query["lang-curr"];
  let lang, curr;

  const [navigation, setNavigation] = useState(false);

  if (vari) {
    lang = detectLang(vari);
    curr = detectCurrency(vari);
    axiosClient.setLangAndCurrency(lang, curr);
  }

  if (isRtl(lang) && !isServer()) {
    document.body.classList.add("rtl");
  }

  const dis = useDispatch();

  useEffect(() => {
    //// disable mobile menu overflow result after each closed menu
    document.body.style.overflowY = "auto";
  });

  useEffect(() => {
    registerServiceWorker();
    const token = Cookies.get(process.env.NEXT_PUBLIC_Token_Cookie_name);
    if (token) {
      dis({
        type: SUCCE_LOGIN,
        payload: {
          token: token,
        },
      });
    }

    //// loading
    Router.events.on("routeChangeStart", (url) => {
      setNavigation(true);
    });
    Router.events.on("routeChangeComplete", () => setNavigation(false));
    Router.events.on("routeChangeError", () => setNavigation(false));
  }, []);

  return (
    <div className={isRtl(lang) ? "rtl" : ""}>
      <Component {...pageProps} />
      {navigation && <PageLoading />}
    </div>
  );
};

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const { ctx, router } = appContext;
  const { req, res, store } = ctx;
  const lang = detectLang(router.query["lang-curr"]);
  const curr = detectCurrency(router.query["lang-curr"]);

  if (req && res && isServer()) {
    if (!checkValidLand(lang) || !checkValidCurr(curr)) {
       res.writeHead(302, { Location: "/bhd-en" });
       res.end();
       return {};
    }
  }

  if (req && lang && curr) {
    axiosClient.setToken(null);
    axiosClient.setCartId(null);
    store.dispatch(updateLang(lang));
    store.dispatch(updateCurrency(curr));
    axiosClient.setLangAndCurrency(lang, curr);

    const cookies = req.headers.cookie;
    if (cookies) {
      const cookiesParsed = cookieparser.parse(cookies);
      const token = cookiesParsed[process.env.NEXT_PUBLIC_Token_Cookie_name];
      const cartId =
        cookiesParsed[process.env.NEXT_PUBLIC_Token_Cookie_name_cart];
      if (token) {
        axiosClient.setToken(token);
      }
      if (cartId) {
        axiosClient.setCartId(cartId);
      }
    }
  }
  const appProps = await App.getInitialProps(appContext);
  return {
    pageProps: {
      ...appProps.pageProps,
      lang,
      curr,
    },
  };
};

export default wrapper.withRedux(MyApp);
