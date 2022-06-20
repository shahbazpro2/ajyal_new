import React from "react";
import { CategoryBoxStyle } from "../../../common";

import { withLocalize } from "react-localize-redux";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { EmptySearch } from "../Search/SearchLayout";
import { selectCurr, selectLang } from "../../../../appConfigSlice";
import { connect } from "react-redux";
import CategoriesSlider from "./MobileCategoriesLayouts/CategoriesSlider";
import "./MobileCategories.scss";
import "./MobileCategories-rtl.scss";
import { client_getMobileCategory } from "../../../../lib/api/client/clientHome";
import { SEARCH_TYPE_CATEGORY } from "../../../../lib/querys";

class MobileCategories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      categories: [],
      vendorsLoading: false,
      countries: [],
      cities: [],
      selectedCity: { value: null, label: this.props.translate("all") },
    };

    this.filters = {
      StoreName: "",
      Sort: 0,
      CategoryId: 0,
      PageNumber: 1,
      PageSize: 9,
      CityId: null,
      CountryId: null,
    };

    this.PNF = PhoneNumberFormat;
    this.phoneUtil = PhoneNumberUtil.getInstance();
    this.phonenumber = null;

    this.timeout = null;
  }

  componentDidMount() {
    this.getVendors();
  }

  getVendors = async () => {
    if (this.state.vendorsLoading) return;
    this.setState({ vendorsLoading: true });
    try {
      const res = await client_getMobileCategory();
      if (res.status == 200) {
        console.log(res);
        this.setState({
          vendorsLoading: false,
          categories: res.result,
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

  render() {
    const count = this.state.categories?.length;
    const categories = this.state.categories;
    return (
      <div className="categories container siteWidthContainer">
        {!this.state.vendorsLoading ? (
          <section>
            <div className="row categories__row">
              {count <= 0 && <EmptySearch />}
              {categories?.map((vendor) => {

                let link = "#";
                if (vendor.haveWebPage) {
                  link = `/${this.props.curr}-${this.props.lang}/category/${vendor.categoryId}`;
                } else {
                  link = `/${this.props.curr}-${this.props.lang}/search?id=${vendor.categoryId}&type=${SEARCH_TYPE_CATEGORY}`;
                }

                return (
                  <CategoryBoxStyle
                    link={link}
                    headerContent={vendor.categoryTitle}
                    showViewAll={true}
                  >
                    <CategoriesSlider count={categories?.childs?.length} data={vendor} />
                  </CategoryBoxStyle>
                );
              })}
            </div>
          </section>
        ) : (
            // <VendorLoading />
            null
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
export default connect(mapStateToProps)(withLocalize(MobileCategories));
