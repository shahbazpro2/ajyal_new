import Link from "next/link";
import React from "react";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { selectCurr, selectLang } from "../../../../../../appConfigSlice";
import {
  SEARCH_TYPE_CATEGORY,
  SEARCH_TYPE_SEARCH,
  SEARCH_TYPE_SLIDER,
} from "../../../../../../lib/querys";
import { Loading } from "./../../../../../common";

class SearchSugestion extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header-top__search-sugestion">
        <div className="header-top__search-sugestion__triangle"></div>
        <div className="header-top__search-sugestion__body">
          {this.props.showLoader ? (
            <Loading type="gray" width="11%" height="70%" />
          ) : (
            <div className="w-100 d-flex flex-wrap">
              <div className="col-md-8 col-sm-6 col-12 header-top__search-sugestion__body__goods p-0">
                {this.props.data.goods.map((item) => {
                  return (
                    <div
                      className=" header-top__search-sugestion__body__goods__items"
                      key={item.goodsId}
                    >
                      <Link
                        href={`/${this.props.curr}-${this.props.lang}/search?search=${item.title}`}
                      >
                        <a>
                          <span className="good">{item.title}</span>
                          <span className="category ml-2 mr-2">
                            {item.categoryTitle}
                          </span>
                        </a>
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="col-md-4 col-sm-6 col-12 header-top__search-sugestion__body__matches">
                <div className="mt-sm-0 mt-3 header-top__search-sugestion__body__matches__items">
                  {this.props.data.brand.length != 0 && (
                    <div className="header">
                      <Translate id="nav.matching-brand" />
                    </div>
                  )}
                  {this.props.data.brand.map((item) => {
                    return (
                      <div className="items" key={item.brandId}>
                        <Link
                          href={`/${this.props.curr}-${this.props.lang}/search?brandId=${item.brandId}&type=${SEARCH_TYPE_SEARCH}`}
                        >
                          <a>{item.brandTitle}</a>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-sm-0 mt-3 header-top__search-sugestion__body__matches__items">
                  <div className="header-top__search-sugestion__body__matches__items">
                    {this.props.data.category.length != 0 && (
                      <div className="header">
                        <Translate id="nav.matching-category" />
                      </div>
                    )}
                    {this.props.data.category.map((cat) => {
                      let allLink;
                      if (cat.haveWebPage) {
                        allLink = `/${this.props.curr}-${this.props.lang}/category/${cat.categoryId}`;
                      } else {
                        allLink = `/${this.props.curr}-${this.props.lang}/search?id=${cat.categoryId}&type=${SEARCH_TYPE_CATEGORY}`;
                      }
                      return (
                        <div className="items" key={cat.categoryId}>
                          <Link href={allLink}>
                            <a>{cat.categoryTitle}</a>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
  };
};

export default connect(mapDispatchToProps)(SearchSugestion);
