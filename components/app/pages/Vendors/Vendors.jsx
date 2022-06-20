import React, { useCallback, useState } from "react";
import { BoxStyle2 } from "../../../common";
import VendorSearchIcon, {
} from "../../../../assets/icons/vendor-search-icon.svg";
import { Translate, withLocalize } from "react-localize-redux";
import vendorPhoneIcon from "../../../../assets/icons/img-vendor-phonecall.svg";
import vendorLocation from "../../../../assets/icons/img-location.svg";
import VendorBtnArrow from "../../../../assets/icons/vendor-down-arrow.svg";
import Pagination from "react-js-pagination";
import { client_fetchVendors } from "../../../../lib/api/client/clientVendors";
import VendorLoading from "./VendorLoading";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { EmptySearch } from "../Search/SearchLayout";
import { selectCurr, selectLang } from "../../../../appConfigSlice";
import { connect } from "react-redux";
import Link from "next/link";
import Select from "react-select";
import { client__fetchCountries } from "../../../../lib/api/client/clientCommon";
import { client_getActiveCities , client_getActiveProvince } from "../../../../lib/api/client/clientShop";

class Vendors extends React.Component {
  constructor(props) {
    super(props);

    const catsOptions = [
      { value: 0, label: this.props.translate("cats.allCats") },
    ];

    for (let cat of this.props.cats) {
      catsOptions.push({
        value: cat.categoryId,
        label: cat.categoryTitle,
      });
    }

    this.catsOptions = catsOptions;
    this.sortOptions = [
      { value: 0, label: this.props.translate("sort.MostPopular") },
      { value: 1, label: this.props.translate("sort.MostRecent") },
      { value: 2, label: this.props.translate("sort.MostReviewed") },
    ];

    this.filters = {
      StoreName: "",
      Sort: 0,
      CategoryId: 0,
      PageNumber: 1,
      PageSize: 9,
      CityId: null,
      ProvinceId: null,
      CountryId: null,
    };

    this.state = {
      search: "",
      vendors: { count: 0, data: [] },
      vendorsLoading: false,
      countries: [],
      provinces: [],
      cities: [],
      selectedCity: { value: null, label: this.props.translate("all") },
      selectedProvince: { value: null, label: this.props.translate("all") },
    };

    this.PNF = PhoneNumberFormat;
    this.phoneUtil = PhoneNumberUtil.getInstance();
    this.phonenumber = null;

    this.timeout = null;
  }

  componentDidMount() {
    this.getVendors();

    client__fetchCountries()
      .then((res) => {
        const country = [];
        country.push({ value: null, label: this.props.translate("all") });
        for (let item of res.result) {
          country.push({ value: item.countryId, label: item.countryTitle });
        }

        this.setState({ countries: country });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleCatChange = (selected) => {
    this.filters.CategoryId = selected.value;
    this.getVendors();
  };

  handleSortChange = (selected) => {
    this.filters.Sort = selected.value;
    this.getVendors();
  };

  handleSearchChange = (e) => {
    this.filters.StoreName = e.target.value;
    this.setState({ search: e.target.value }, () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.timeout = setTimeout(() => {
        this.getVendors();
      }, 300);
    });
  };

  getVendors = async () => {
    if (this.state.vendorsLoading) return;
    this.setState({ vendorsLoading: true });
    try {
      const res = await client_fetchVendors(this.filters);
      if (res.status == 200) {
        this.setState({
          vendorsLoading: false,
          vendors: res.result,
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({ vendorsLoading: false });
    }
  };

  printPhone = (phone, iso) => {
    try {
      const number = this.phoneUtil.parseAndKeepRawInput(phone, iso);
      return this.phoneUtil.format(number, this.PNF.INTERNATIONAL);
    } catch (err) {
      return phone;
    }
  };

  handleChangePageNumber = (number) => {
    this.filters.PageNumber = number;
    this.getVendors();
  };

  handleCountryClick = async (item) => {
    this.filters.CountryId = item.value;
    this.filters.CityId = null;
    this.filters.ProvinceId = null;
    this.setState({
      selectedCity: { value: null, label: this.props.translate("all") },
      selectedProvince: { value: null, label: this.props.translate("all") },
    });
    this.getVendors();

    if (item.value == null) {
      return;
    }

    const result = await client_getActiveProvince(item.value);
    let provinces = [];
    provinces.push({ value: null, label: this.props.translate("all") });
    result.result.forEach((item) => {
      provinces.push({ value: item.provinceId, label: item.provinceName });
    });
    this.setState({ provinces });

  };

  handleProvinceClick = async (item) => {
    this.filters.ProvinceId = item.value;
    this.filters.CityId = null;
    this.setState({
      selectedCity: { value: null, label: this.props.translate("all") },
    });
    this.getVendors();

    if (item.value == null) {
      return;
    }

    const result = await client_getActiveCities(item.value);
    let cities = [];
    cities.push({ value: null, label: this.props.translate("all") });
    result.result.forEach((item) => {
      cities.push({ value: item.cityId, label: item.cityTitle });
    });
    this.setState({ cities });

  };


  handleCityClick = async (item) => {
    this.setState({ selectedCity: item });
    this.filters.CityId = item.value;
    this.getVendors();
  };

  render() {
    const count = this.state.vendors.count;
    const vendors = this.state.vendors.data;
    const itemCount = this.state.vendors.data.length;
    return (
      <div className="vendors container siteWidthContainer">
        {/* <BreadCrump className="col-12 p-0 mt-2" data={[]} /> */}
        <BoxStyle2>
          <header className="filters-header">
            <div className="row no-gutters align-items-center justify-content-between">
              <div className="col-12 mb-lg-0 mb-3 col-lg-2">
                <div className="search-input">
                  <VendorSearchIcon className="search-input__icon" />
                  <Translate>
                    {({ translate: t }) => {
                      return (
                        <input
                          type="text"
                          placeholder={t("search-placeholder")}
                          className="search-input__input"
                          value={this.state.search}
                          onChange={this.handleSearchChange}
                        />
                      );
                    }}
                  </Translate>
                </div>
                <div className="filters-header__count-text mt-3">
                  <Translate id="total-store" />
                  <span className="filters-header__count">{itemCount}</span>
                </div>
              </div>
              <div className="mb-3 mb-lg-0 col-12 col-xl-10">
                <div className="filters-header__right-cnt d-flex flex-wrap">
                  <div className="filters-header__dropdown-cnt">
                    <span className="searchBoxHeader__header-text align-center">
                      <Translate id="country" />
                    </span>
                    <Select
                      className="filters-header__dropdown"
                      classNamePrefix="vendor"
                      options={this.state.countries}
                      onChange={this.handleCountryClick}
                      placeholder={this.props.translate("all")}
                    />
                  </div>
                      <div className="filters-header__dropdown-cnt">
                    <span className="searchBoxHeader__header-text align-center">
                      <Translate id="province" />
                    </span>
                    <Select
                      className="filters-header__dropdown"
                      classNamePrefix="vendor"
                      options={this.state.provinces}
                      onChange={this.handleProvinceClick}
                      placeholder={this.props.translate("all")}
                    />
                  </div>

                  <div className="filters-header__dropdown-cnt">
                    <span className="searchBoxHeader__header-text align-center">
                      <Translate id="city" />
                    </span>
                    <Select
                      className="filters-header__dropdown"
                      classNamePrefix="vendor"
                      options={this.state.cities}
                      value={this.state.selectedCity}
                      placeholder={this.props.translate("all")}
                      onChange={this.handleCityClick}
                    />
                  </div>
                  <div className="filters-header__dropdown-cnt cats">
                    <span className="searchBoxHeader__header-text align-center">
                      <Translate id="category2" />
                    </span>
                    <Select
                      className="filters-header__dropdown filters-header__dropdown--big"
                      classNamePrefix="vendor"
                      onChange={this.handleCatChange}
                      options={this.catsOptions}
                      placeholder={this.catsOptions[0].label}
                    />
                  </div>
                  <div className="filters-header__dropdown-cnt">
                    <span className="searchBoxHeader__header-text align-center">
                      <Translate id="sortby" />
                    </span>
                    <Select
                      className="filters-header__dropdown"
                      classNamePrefix="vendor"
                      onChange={this.handleSortChange}
                      options={this.sortOptions}
                      placeholder={this.sortOptions[0].label}
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>
        </BoxStyle2>
        {!this.state.vendorsLoading ? (
          <section>
            <div className="row no-gutters vendor__row">
              {count <= 0 && <EmptySearch />}
              {vendors.map((vendor) => {
                return (
                  <div className="col-12 col-sm-6 col-lg-4 mt-4 pl-4">
                    <article className="vendor">
                      <div className="vendor__img-cnt">
                        {vendor.profileImage && (
                          <img
                            className="vendor__img"
                            src={`${process.env.NEXT_PUBLIC_Shop_PREFIX}/${vendor.shopId}/${vendor.profileImage}`}
                            alt="profile logo"
                          />
                        )}
                        <div className="vendor__cover"></div>
                      </div>
                      <div className="vendor__contents">
                        <h2 className="vendor__name">{vendor.storeName}</h2>
                        <div className="vendor__texts-cnt">
                          {vendor.address && (
                            <p className="vendor__address">
                              <img src={vendorLocation} />
                              {vendor.address}
                            </p>
                          )}
                          {vendor.phone && (
                            <p className="vendor__phone">
                              <img src={vendorPhoneIcon} />
                              {this.printPhone(vendor.phone, vendor.iso)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/${this.props.curr}-${this.props.lang}/${vendor.vendorUrlid}`}
                      >
                        <a className="vendor__btn">
                          <Translate id="visit-store" />
                          <VendorBtnArrow className="vendor__btn-icon" />
                        </a>
                      </Link>
                    </article>
                  </div>
                );
              })}
            </div>
            <div className="vendor__pagination-cnt">
              <Pagination
                activePage={this.filters.PageNumber}
                itemsCountPerPage={9}
                totalItemsCount={count}
                itemClass="pager__item"
                innerClass="pager"
                linkClass="pager__link"
                activeLinkClass="active"
                hideFirstLastPages
                pageRangeDisplayed={4}
                onChange={(pageNumber) => {
                  this.handleChangePageNumber(pageNumber);
                }}
              />
            </div>
          </section>
        ) : (
          <VendorLoading />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: selectLang(state),
    curr: selectCurr(state),
  };
};
export default connect(mapStateToProps)(withLocalize(Vendors));
