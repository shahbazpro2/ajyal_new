import React from "react";
import { withRouter } from "next/router";
import { LocalizeProvider, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { updateCurrency } from "../../../appConfigSlice";
import Head from "next/head";
import { wrapper } from "../../../store";
import MobileHtmlDescComp from "../../../components/app/pages/MobileHtmlDescComp/MobileHtmlDescComp";
import { server_fetchGetMobileDescriptionPageData } from "../../../lib/api/client/serverHome";

class MobileHtmlDesc extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <LocalizeProvider
        >
          <Translate>
            {({ translate: t }) => {
              return (
                <Head>
                  <title>desc</title>
                </Head>
              );
            }}
          </Translate>
          <MobileHtmlDescComp
            htmlStr={this.props.data.htmlStr}
            lang={this.props.data.lang}
            curr={this.props.data.curr}
            type={this.props.data.type}
            goodsId={this.props.data.goodsId} />
          {/* <div dangerouslySetInnerHTML={ { __html: '<pre style="background-color: #23241f;color: #f8f8f2;overflow: visible;white-space: pre-wrap;margin-bottom: 5px;margin-top: 5px;padding: 5px 10px; " spellcheck="false">log atom hello</pre><blockquote><span style="color: rgb(34, 34, 34); "> To better introduce the product to customers, Enter a complete description about it </span></blockquote><p><span style="color: rgb(230, 0, 0); "> To better introduce the product to customers, Enter a complete description about it </span></p><p><span style="color: rgb(34, 34, 34); background-color: rgb(255, 255, 102); "> To better introduce the product to customers, Enter a complete description about it </span></p><p><strong style="color: rgb(34, 34, 34); "> To better introduce the product to customers, Enter a complete description about it </strong></p><p><em style="color: rgb(34, 34, 34); "> To better introduce the product to customers, Enter a complete description about it </em></p><p><u style="color: rgb(34, 34, 34); "> To better introduce the product to customers, Enter a complete description about it </u></p><p><span style="color: rgb(34, 34, 34); "> </span><s style="color: rgb(34, 34, 34); ">To better introduce the product to customers, Enter a complete description about it </s></p><h1><span style="color: rgb(34, 34, 34); ">To better introduce the product to customers, Enter a complete description about it </span></h1><p><span style="color: rgb(34, 34, 34); " class="ql-font-proximaNova-black">To better introduce the product to customers, Enter a complete description about it</span></p><p><span style="color: rgb(34, 34, 34); " class="ql-font-proximaNova-extrabld">To better introduce the product to customers, Enter a complete description about it</span></p><p><br></p><p><span style="color: rgb(34, 34, 34); " class="ql-font-proximaNovaA-bold">To better introduce the product to customers, Enter a complete description about it</span></p><h1><span style="color: rgb(34, 34, 34); ">To better introduce the product to customers, Enter a complete description about it</span></h1><p><a href="https://ajyal.bh/bhd-en/product/93/1090/starsat-32%22-hd-smart-led-tv" rel="noopener noreferrer" target="_blank">linkkkkkkkkkkkkkkkk</a></p><pre class="ql-syntax" spellcheck="false">fdfdfdff</pre><p><img src="http://192.168.1.5:6400/Uploads/CkEditorImages/N41247174A-1.jpg"></p>' }}></div> */}
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
export default connect(mapStateToProps, { updateCurrency })(withRouter(MobileHtmlDesc));

export const getServerSideProps = wrapper.getServerSideProps(async ({ req, store, query }) => {
  const goodsId = query['goodsId'];
  const articleId = query['articleId'];
  const type = query['type'];
  const lang = query['lang'];
  const curr = query['curr'];
  const storeName = query['storeName'];
  const contentType = query['contentType'];
  

  const model = {
    type: type,
    goodsId: goodsId,
    articleId: articleId,
    contentType: contentType,
    storeName: storeName,
    lang: lang,
    curr: curr,
  };

  const result = await server_fetchGetMobileDescriptionPageData(model);


  return {
    props: {
      data: { goodsId: goodsId, type: type, lang: lang, curr: curr, htmlStr: result === undefined ? null : result?.result }
    },
  };
});
