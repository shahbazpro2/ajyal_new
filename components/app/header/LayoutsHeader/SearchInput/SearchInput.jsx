import React from "react";
import SearchIcon from "./../../../../../assets/icons/img-search.svg";
import SearchIconLeft from "./../../../../../assets/icons/img-header-search-left.svg";
import Link from "next/link";
import SearchSugestion from "./SearchSugestion/SearchSugestion";
import { client_getHomeSerachAutoComplete } from "./../../../../../lib/api/client/clientHome";
import { connect } from "react-redux";
import { selectLang, selectCurr } from "../../../../../appConfigSlice";
class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSuggestion: false,
      autoData: {},
      showLoader: false,
      searchQuery: "",
    };
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  changeSearchInput = async (e) => {
    this.setState({
      searchQuery: e.target.value,
    });

    if (e.target.value != "") {
      this.setState({ showSuggestion: true, showLoader: true });
      const result = await client_getHomeSerachAutoComplete(e.target.value);
      if (result.result.goods.length != 0) {
        this.setState({ showLoader: false, autoData: result.result });
      } else {
        this.setState({ showLoader: false, showSuggestion: false });
      }
    } else {
      this.setState({ showSuggestion: false });
    }
  };

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current?.contains(event.target)) {
      this.setState({ showSuggestion: false });
    }
  }

  handRedirectSearch=(e) => {
    if (e.which === 13 && this.state.searchQuery != null && this.state.searchQuery != undefined && this.state.searchQuery != "") {
      this.props.history.push(`/${this.props.curr}-${this.props.lang}/search?search=${this.state.searchQuery}`)
     }
  }

  render() {
    return (
      <div className="header-top__search-box" ref={this.wrapperRef}>
        <input
          type="text"
          className="header-top__search-input"
          placeholder={this.props.placeholder}
          onChange={this.changeSearchInput}
          value={this.state.searchQuery}
          onKeyPress={this.handRedirectSearch}
        />
        <Link href={`/${this.props.curr}-${this.props.lang}/search?search=${this.state.searchQuery}`}>
          <a className="header-top__search-btn">
            {this.props.lang === "en" ? (
              <img src={SearchIcon} className="header-top__search-icon" />
            ) : (
              <img src={SearchIconLeft} className="header-top__search-icon" />
            )}
            {/* <span className="header-top__search-btn-text">
              {this.props.search}
            </span> */}
          </a>
        </Link>
        {this.state.showSuggestion && (
          <SearchSugestion
            showLoader={this.state.showLoader}
            data={this.state.autoData}
          />
        )}
      </div>
    );
  }
}

export default SearchInput;
