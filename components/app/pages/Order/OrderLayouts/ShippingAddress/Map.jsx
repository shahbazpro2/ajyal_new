import React from "react";
import { Translate } from "react-localize-redux";
import { ReactComponent as BackIcon } from "./../../../../../../assets/icons/back.svg";
import GoogleMapReact from "google-map-react";
import PlaceHolderIcon from "./../../../../../../assets/icons/placeholder.svg";
import LoadingGif from "./../../../../../../assets/icons/5.gif";
import Geocode from "react-geocode";
import { ReactComponent as TargetIcon } from "./../../../../../../assets/icons/target.svg";
import { client_areaCheck } from "../../../../../../lib/api/client/clientMap";
import { Loading } from "../../../../../common";

// const AnyReactComponent = ({ text }) => <div>{text}</div>;
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
    this.targetBtn = React.createRef();
    this.markers = [];
    this.selectedMarker = null;
    this.API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    this.infowindow = null;
    this.map = null;
    this.maps = null;

    this.setCurLocation.bind(this);

    this.state = {
      showSubmitLoading: false,
    };

    this.center = {
      lat: this.props.lat
        ? this.props.lat
        : parseInt(process.env.NEXT_PUBLIC_GOOGLE_MAP_Default_lat),
      lng: this.props.lng
        ? this.props.lng
        : parseInt(process.env.NEXT_PUBLIC_GOOGLE_MAP_Default_lng),
    };

    this.zoom = this.props.zoom ? this.props.zoom : 9;
  }

  addressWindowContent = () => {
    return `<div class="map__add-cnt">
    <h3 class="map__header"></h3>
    <div class="map__content">
    <img class="map__loading-icon" src="${LoadingGif}" />
    </div>
    </div>`;
  };

  handleBackClick = () => {
    this.props.back();
  };

  setAddressInWindowContent = (response) => {
    const name = response.cityName;
    const addr = response.address;
    this.infowindow.setContent(`<div class="map__add-cnt">
    <h3 class="map__header">${name}</h3>
    <div class="map__content">
    ${addr}
    </div>
    </div>`);
  };

  getAddress = async (lat, lng, cb) => {
    try {
      const results = await client_areaCheck(lat, lng);
      if (results.status === 200) {
        // console.log(results.results)
        cb(results.result);
      }
    } catch (err) {
      this.props.areaError(err);
      this.setState({
        showSubmitLoading: false,
      });
      this.infowindow.close();
    }

    // Geocode.setApiKey(this.API_KEY);

    // Geocode.fromLatLng(lat, lng).then(
    //   (response) => {
    //     console.log(response);
    //     const address = response.results[0].formatted_address;
    //     // console.log(address);
    //     cb(response);
    //     // this.setAddressInWindowContent(response.results[1].formatted_address,address);
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  };

  setCurLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map.setCenter(pos);

          this.markers.forEach((marker) => {
            marker.setMap(null);
          });

          this.markers = [];

          this.markers.push(
            new this.maps.Marker({
              position: pos,
              map: this.map,
              icon: PlaceHolderIcon,
            })
          );

          this.selectedMarker = this.markers[0];
          this.infowindow.setContent(this.addressWindowContent());
          this.infowindow.open(this.map, this.selectedMarker);
          this.getAddress(
            this.selectedMarker.position.lat(),
            this.selectedMarker.position.lng(),
            this.setAddressInWindowContent
          );
        },
        function () {
          // handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      // handleLocationError(false, infoWindow, map.getCenter());
    }
  };

  handleSearchBox = (map, maps) => {
    const searchBox = new maps.places.SearchBox(this.searchInput.current);
    map.controls[maps.ControlPosition.TOP_CENTER].push(
      this.searchInput.current
    );
    map.controls[maps.ControlPosition.TOP_LEFT].push(this.targetBtn.current);
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    this.markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
      // console.log(places);
      // Clear out the old markers.
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });
      this.markers = [];
      // For each place, get the icon, name and location.
      const bounds = new maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const icon = {
          url: PlaceHolderIcon,
          size: new maps.Size(71, 71),
          origin: new maps.Point(0, 0),
          anchor: new maps.Point(17, 34),
          scaledSize: new maps.Size(25, 25),
        };
        // Create a marker for each place.
        this.markers.push(
          new maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  };

  handleApiLoaded = (map, maps) => {
    this.map = map;
    this.maps = maps;
    this.handleSearchBox(map, maps);

    this.infowindow = new maps.InfoWindow({
      content: this.addressWindowContent(),
    });

    if (this.props.lat && this.props.lng) {
      this.markers = [];
      this.markers.push(
        new maps.Marker({
          position: { lat: this.props.lat, lng: this.props.lng },
          map,
          icon: PlaceHolderIcon,
        })
      );

      this.selectedMarker = this.markers[0];
    }

    map.addListener("click", (e) => {
      this.markers.forEach((marker) => {
        marker.setMap(null);
      });

      this.markers = [];

      this.markers.push(
        new maps.Marker({
          position: e.latLng,
          map,
          icon: PlaceHolderIcon,
        })
      );

      this.selectedMarker = this.markers[0];
      this.infowindow.setContent(this.addressWindowContent());
      this.infowindow.open(map, this.selectedMarker);
      this.getAddress(
        this.selectedMarker.position.lat(),
        this.selectedMarker.position.lng(),
        this.setAddressInWindowContent
      );
    });
  };

  handleSubmit = () => {
    if (!this.selectedMarker) {
      alert("you should select your location first");
      return;
    }
    this.setState(
      {
        showSubmitLoading: true,
      },
      () => {
        this.getAddress(
          this.selectedMarker.position.lat(),
          this.selectedMarker.position.lng(),
          (response) => {
            // this.props.setData({
            //   address: response.results[0].formatted_address,
            // });
            // this.handleBackClick();

            this.props.handleSubmit({
              address: response.address,
              lat: response.locationX,
              lng: response.locationY,
              phoneCode: response.phoneCode,
              iso: response.iso,
            });
          }
        );
      }
    );
  };

  render() {
    return (
      <Translate>
        {({ translate: t }) => {
          return (
            <>
              <section className="mapAddress">
                <header className="mapAddress__header mapAddress__header--order">
                  <a onClick={this.handleBackClick}>
                    <BackIcon className="mapAddress__back-icon" />
                    <span className="mapAddress__header-text">
                      <Translate id="addresses.addresses" />
                    </span>
                  </a>
                </header>
                <div id="map" className="mapAddress__map-cnt">
                  <input
                    placeholder={t("addresses.search-loc-placeholder")}
                    type="text"
                    className="gray__input mapAddress__searchInput"
                    ref={this.searchInput}
                  />
                  <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) =>
                      this.handleApiLoaded(map, maps)
                    }
                    bootstrapURLKeys={{
                      key: this.API_KEY,
                      libraries: "places",
                    }}
                    defaultCenter={this.center}
                    defaultZoom={this.zoom}
                  ></GoogleMapReact>
                  <button
                    onClick={($event) => this.setCurLocation($event)}
                    className="mapAddress__curr-btn"
                    ref={this.targetBtn}
                    type="button"
                  >
                    <TargetIcon className="mapAddress__target-icon" />
                  </button>
                </div>
                <div className="mapAddress__btn-cnt">
                  <button
                    onClick={this.handleSubmit}
                    className="primary-btn add-address-step1__btn"
                    type="button"
                  >
                    {this.state.showSubmitLoading ? (
                      <Loading type="white" width="20px" height="20px" />
                    ) : (
                      t("addresses.confirm-loc")
                    )}
                  </button>
                </div>
              </section>
            </>
          );
        }}
      </Translate>
    );
  }
}
