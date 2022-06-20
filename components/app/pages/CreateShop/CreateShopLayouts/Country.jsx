import React from "react";
import { NEXT, COMPLETE_AND_NEXT } from "../CreateShopConstant";
import { CreateShopContext } from "../CreateShopContext";
import { Translate } from "react-localize-redux";
import { SelectBox2 as SelectBox, Loading } from "../../../../common";
import { Scrollbars } from "react-custom-scrollbars";

import SearchIcon from "./../../../../../assets/icons/search-gray.svg";
import {
  client_getActiveCities,
  client_getActiveProvince
} from "./../../../../../lib/api/client/clientShop";

class Country extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryId: null,
      provinceId: 0,
      cityId: 0,
      cityName: "",
      phoneCode: "",
      provinceItems: [],
      cityItems: [],
      countrySelectError: false,
      citySelectError: false,
      showLoader: false,
      clearAddress: false
    };
    this.getActiveCities = this.getActiveCities.bind(this);
    this.setCityId = this.setCityId.bind(this);
  }

  static contextType = CreateShopContext;

  async componentDidMount() {
    const result = await client_getActiveProvince(this.context.formData.fkCountryId);
    this.setState({
      provinceItems: result.result,
      countryId: this.context.formData.fkCountryId,
      cityId: this.context.formData.fkCityId,
      provinceId: this.context.formData.fkProvinceId,
      showLoader: false,
    });
    if (this.state.provinceId != 0) {
      this.getActiveCities(this.state.provinceId);
    }
  }

  async getActiveCities(cntId) {
    this.setState({ showLoader: true });
    const result = await client_getActiveCities(cntId);
    this.setState({
      cityItems: result.result,
      isCitySelected: true,
      showLoader: false,
      clearAddress : true,
      provinceId:cntId
    });
  }

  setCityId(cityId) {
    const cityName = this.state.cityItems.find(x=>x.cityId == cityId).cityTitle ;
    this.setState({ cityId: cityId , cityName : cityName , clearAddress : true});
  }

  handleSubmit = () => {
    if (this.state.cityId == 0 || this.state.cityId == undefined) {
      this.setState({ citySelectError: true });
      return;
    }
   debugger;
    this.setState({ countrySelectError: false, citySelectError: false });
    this.context.handleCountry(this.state.cityId ,this.state.cityName ,this.state.clearAddress , this.state.provinceId);
    this.context.handleStep(COMPLETE_AND_NEXT);
  };

  render() {
    return (
      <div className="createshop__transition-cnt">
        {this.state.showLoader && (
          <Loading type="gray" width="11%" height="70%" />
        )}

        <div className={this.state.showLoader ? "d-none" : ""}>
          <div className="mt-5">
            <h3 className="createshop__header-text">
              <Translate id="country.country-msg1" />
            </h3>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="createshop__header-text mt-5">
                    <Translate id="country.province-choose" />
                  </h3>
                  <SelectBox className="createshop__country-cnt createshop__form--country">
                    {this.state.provinceItems.map((item) => {
                      return (
                        <SelectBox.SelectItem
                          isCountry={false}
                          handleSelect={this.getActiveCities}
                          name={item.provinceId}
                          value={item.provinceId}
                          key={item.provinceId}
                          selectedId={this.state.provinceId}
                        >
                          <span className="createshop__text1rem">
                            {item.provinceName}
                          </span>
                        </SelectBox.SelectItem>
                      );
                    })}
                  </SelectBox>
                </div>
                <div className="col-md-6">
                  <h3 className="createshop__header-text mt-5">
                    <Translate id="country.city-choose" />
                  </h3>
                  {this.state.cityItems.length > 10 && (
                    <div className="checklist__search">
                      <SearchIcon className="checklist__search-input-icon" />
                      <input
                        onChange={(e) => {
                          this.setState({ search: e.target.value });
                        }}
                        type="text"
                        value={this.state.search}
                        className="checklist__search-input"
                        placeholder={"search"}
                      />
                    </div>
                  )}
                  <Scrollbars
                    renderView={(props) => (
                      <div {...props} className="deliveryPanel__scrol-view" />
                    )}
                    renderTrackVertical={(props) => (
                      <div
                        {...props}
                        className="deliveryPanel__track-vertical"
                      />
                    )}
                    // Duration for hide animation in ms. autoHideDuration={200}
                    style={{ height: "400px" }}
                  >
                    <SelectBox className="createshop__country-cnt createshop__form--country">
                      {this.state.cityItems.map((item) => {
                        if (
                          (this.state.search &&
                            item.cityTitle?.includes(this.state.search)) ||
                          !this.state.search
                        )
                          return (
                            <SelectBox.SelectItem
                              isCountry={false}
                              handleSelect={this.setCityId}
                              name={item.cityId}
                              value={item.cityId}
                              key={item.cityId}
                              selectedId={this.state.cityId}
                            >
                              <span className="createshop__text1rem">
                                {item.cityTitle}
                              </span>
                            </SelectBox.SelectItem>
                          );
                      })}
                    </SelectBox>
                  </Scrollbars>
                </div>
                <div className="col-12 text-center">
                  {this.state.countrySelectError && (
                    <span className="country-error">
                      <Translate id="country.select-cntry" />
                    </span>
                  )}
                  {this.state.citySelectError && (
                    <span className="country-error">
                      <Translate id="country.select-city" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="createshop__btm text-align-center-ltr mb-5">
            <div className="auth__btn">
              <button
                onClick={this.handleSubmit}
                className="createshop__primary-btn primary-btn"
              >
                <Translate id="country.next" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Country;
