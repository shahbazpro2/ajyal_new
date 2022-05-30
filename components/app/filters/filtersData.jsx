class FiltersData {
  constructor(translate) {
    this.translate = translate;
  }

  get arrivals() {
    return [
      {
        title: this.translate("arrivals.30"),
        value: 30,
      },
      {
        title: this.translate("arrivals.50"),
        value: 50,
      },
    ];
  }

  get sortedBy() {
    return [
      { value: 1, label: this.translate("sortedBy.mostView") },
      { value: 2, label: this.translate("sortedBy.mostLiked") },
      { value: 3, label: this.translate("sortedBy.expensive") },
      { value: 4, label: this.translate("sortedBy.cheapest") },
      { value: 5, label: this.translate("sortedBy.mostSeller") },
      { value: 6, label: this.translate("sortedBy.new") },
      { value: 7, label: this.translate("sortedBy.mostDiscountPrice") }
    ];
  }

  get perPage() {
    return [
      { value: 50, label: `50 ${this.translate("perPage")}` },
      { value: 70, label: `70 ${this.translate("perPage")}` },
    ];
  }
}

export default FiltersData;
