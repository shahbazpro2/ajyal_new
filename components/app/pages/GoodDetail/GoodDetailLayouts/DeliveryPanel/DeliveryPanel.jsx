import React from "react";
// import "./DeliveryPanel.scss";
// import "./DeliveryPanel-rtl.scss";
import { Translate } from "react-localize-redux";
import DropDown from "react-dropdown";
import { ReactComponent as SearchIcon } from "./../../../../../../assets/icons/search-gray.svg";
import { Loading, SelectBox3 as SelectBox } from "../../../../../common";
import { Scrollbars } from "react-custom-scrollbars";
import { GoodDetailContext } from "../../GoodDetailContext";
import {
  fetchCities,
  fetchCountry,
  fetchProvinces,
  getPostMethod,
} from "../../GoodDetailSlice";
import { withRouter } from "next/router";
class DeliveryPanel extends React.Component {
  static contextType = GoodDetailContext;
  constructor(props) {
    super(props);
    // this.options = ["bahrain", "ardabil", "mesr", "goonbad"];
    this.state = {
      search: "",
      countryLoading: false,
      cityLoading: false,
      cityList: [],
      provinceList: [],
      countryList: [],
      SelectedCountryId: null,
      SelectedProvinceId: null,
      SelectedCityId: null,
    };

    this.providerCountryIndex = 0;
    this.providerProvinceIndex = 0;
  }
  async componentDidMount() {
    this.setState((state) => {
      return {
        ...state,
        countryLoading: true,
        cityLoading: true,
        SelectedCountryId: this.context.providerCountryId,
        SelectedProvinceId: this.context.providerProvinceId,
      };
    });

    const result = await Promise.all([
      fetchCountry(),
      fetchProvinces(this.context.providerCountryId),
      fetchCities(this.context.providerProvinceId),
    ]);

    const countryList = result[0]?.map((country, index) => {
      if (country.countryId === this.context.providerCountryId)
        this.providerCountryIndex = index;
      return { value: country.countryId, label: 
        (
          <div>
            <img
              src={`/assets/flags/${country.flagUrl}`}
              height="15px"
              width="15px"
            />{" "}
             {country.iso}
          </div>
        ) };
    });

    const provinceList = result[1]?.map((province, index) => {
      if (province.provinceId === this.context.providerProvinceId)
        this.providerProvinceIndex = index;
      return { value: province.provinceId, label: province.provinceName };
    });

    this.setState(
      {
        countryLoading: false,
        cityLoading: false,
        cityList: result[2],
        countryList: countryList,
        provinceList: provinceList,
      }
      // () => {
      //   ////////////////
      //   this.handleCityClick({ value: "goorgran", name: 2 });
      // }
    );
  }

  handleProvinceChange = async ({ value }) => {
    this.setState({
      cityLoading: true,
    });

    const result = await fetchCities(value);
    this.setState({
      cityLoading: false,
      cityList: result || [],
      SelectedProvinceId: value,
    });
  };

  handleCountryChange = async ({ value }) => {
    this.setState({
      cityLoading: true,
    });
    this.providerProvinceIndex = 0 ;
    const result = await fetchProvinces(value);
    
    const provinceList = result?.map((province, index) => {
      if (province.provinceId === this.context.providerProvinceId)
      this.providerProvinceIndex = index;
      return { value: province.provinceId, label: province.provinceName };
    });

    let cities = [] ;

    if(provinceList.length > 0) {
      cities = await fetchCities(provinceList[this.providerProvinceIndex].value);
    }

    const SelectedProvinceId = provinceList.length > 0 ? provinceList[this.providerProvinceIndex].value : null


    this.setState({
      cityLoading: false,
      provinceList: provinceList || [],
      cityList: cities || [],
      SelectedCountryId: value,
      SelectedProvinceId: SelectedProvinceId
    });
  };

  handleCityClick = async ({ value, name }) => {
    const shopId = this.context.providerShopId;
    const countryId = this.state.SelectedCountryId;
    const provinceId = this.state.SelectedProvinceId;
    const cityId = name;

    this.context.handleDeliveryBoxLoading(true);

    this.props.closePanel();
    try {
      const result = await getPostMethod({
        shopId: shopId,
        countryId: countryId,
        cityId: cityId,
        provinceId: provinceId
      });
      this.context.handleCityClick(
        result.postMethodType,
        result.shippingMethodImage,
        result.shippingMethodDesc,
        result.postTimeoutDay,
        value,
        countryId,
        cityId,
        provinceId
      );
    } catch (err) {
      // this.context.handleCityClick(3, "ardabil");
    }
  };

  render() {
    return (
      <div className="deliveryPanel">
        <div className="deliveryPanel__cnt">
          <aside className="deliveryPanel__panel" ref={this.props.panelRef}>
            <header className="deliveryPanel__header">
              <h2 className="deliveryPanel__header-text">
                <Translate id="panel.del-lo" />
              </h2>
              {this.state.countryLoading ? (
                <Loading type="gray" width="30px" />
              ) : (
                <div className="deliveryPanel__location">
                  <div className="deliveryPanel__location-country">
                    <DropDown
                      disabled={this.state.cityLoading}
                      onChange={this.handleCountryChange}
                      classname="gray__dropdown"
                      options={this.state.countryList}
                      value={this.state.countryList[this.providerCountryIndex]}
                    />
                  </div>
                  <div className="deliveryPanel__location-province">
                    <DropDown
                      disabled={this.state.cityLoading}
                      onChange={this.handleProvinceChange}
                      classname="gray__dropdown"
                      options={this.state.provinceList}
                      value={
                        this.state.provinceList[this.providerProvinceIndex]
                      }
                    />
                  </div>
                </div>
              )}

              <div className="deliveryPanel__search-input-cnt">
                <SearchIcon className="deliveryPanel__search-icon" />
                <Translate>
                  {({ translate: t }) => {
                    return (
                      <input
                        type="text"
                        className="gray__input deliveryPanel__search-input"
                        placeholder={t("panel.src-city")}
                        value={this.state.search}
                        onChange={(e) => {
                          this.setState({ search: e.target.value });
                        }}
                      />
                    );
                  }}
                </Translate>
              </div>
            </header>
            <div className="deliveryPanel__content-cnt">
              {this.state.cityLoading ? (
                <Loading type="gray" width="50px" />
              ) : (
                <Scrollbars
                  renderView={(props) => (
                    <div {...props} className="deliveryPanel__scrol-view" />
                  )}
                  renderTrackVertical={(props) => (
                    <div {...props} className="deliveryPanel__track-vertical" />
                  )}
                  autoHide // Hide delay in ms autoHideTimeout={1000}
                  // Duration for hide animation in ms. autoHideDuration={200}
                  style={{ height: "100%" }}
                >
                  <SelectBox
                    onChange={(items) => {
                      this.handleCityClick(items[0]);
                    }}
                  >
                    {this.state.cityList.map((city) => {
                      if (!this.state.search)
                        return (
                          <SelectBox.SelectItem
                            key={city.cityId}
                            name={city.cityId}
                            value={city.cityTitle}
                          >
                            {city.cityTitle}
                          </SelectBox.SelectItem>
                        );
                      else if (city.cityTitle.includes(this.state.search)) {
                        return (
                          <SelectBox.SelectItem
                            key={city.cityId}
                            name={city.cityId}
                            value={city.cityTitle}
                          >
                            {city.cityTitle}
                          </SelectBox.SelectItem>
                        );
                      }
                    })}
                  </SelectBox>
                </Scrollbars>
              )}
            </div>
          </aside>
          <div
            className="deliveryPanel__cover"
            onClick={this.props.closePanel}
          ></div>
        </div>
      </div>
    );
  }
}

export default withRouter(DeliveryPanel);
