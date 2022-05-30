export const dataVar = [
  {
    tGoodsVariety: [
      {
        varietyId: 0,
        parameterTitle: "Color",
        valueTitle: "Red",
      },
      {
        varietyId: 1,
        parameterTitle: "Ram",
        valueTitle: "12gb",
      },
      {
        varietyId: 15,
        parameterTitle: "Version",
        valueTitle: "1.2",
      },
    ],
  },
  {
    tGoodsVariety: [
      {
        varietyId: 20,
        parameterTitle: "Color",
        valueTitle: "Blue",
      },
      {
        varietyId: 1,
        parameterTitle: "Ram",
        valueTitle: "12gb",
      },
      {
        varietyId: 15,
        parameterTitle: "Version",
        valueTitle: "1.2",
      },
    ],
  },
  {
    tGoodsVariety: [
      {
        varietyId: 0,
        parameterTitle: "Color",
        valueTitle: "Red",
      },
      {
        varietyId: 5,
        parameterTitle: "Ram",
        valueTitle: "16gb",
      },
      {
        varietyId: 15,
        parameterTitle: "Version",
        valueTitle: "1.2",
      },
    ],
  },

  {
    tGoodsVariety: [
      {
        varietyId: 10,
        parameterTitle: "Color",
        valueTitle: "Green",
      },
      {
        varietyId: 5,
        parameterTitle: "Ram",
        valueTitle: "16gb",
      },
      {
        varietyId: 15,
        parameterTitle: "Version",
        valueTitle: "1.2",
      },
    ],
  },
  {
    tGoodsVariety: [
      {
        varietyId: 10,
        parameterTitle: "Color",
        valueTitle: "Green",
      },
      {
        varietyId: 5,
        parameterTitle: "Ram",
        valueTitle: "16gb",
      },
      {
        varietyId: 19,
        parameterTitle: "Version",
        valueTitle: "1.6",
      },
    ],
  },
];

export const varitySort = (arr) => {
  arr.sort((a, b) => {
    return a - b;
  });
  return arr;
};

export const generatetGoodsVarietyExistencePossibilityAndPrintStructure = (
  goodsProviderVarity
) => {
  const printStructure = [];
  const VarietyExistencePossibility = {};

  const AddedVarietyIdsForPrintStruc = [];
  goodsProviderVarity.forEach((Provider, index) => {
    const varietyIds = [];
    Provider.tGoodsVariety.forEach((GoodVariety) => {
      varietyIds.push(GoodVariety.fkVariationParameterValueId);

      /// create print structure
      printStructure[GoodVariety.parameterTitle] =
        printStructure[GoodVariety.parameterTitle] || [];
      if (!AddedVarietyIdsForPrintStruc.includes(GoodVariety.fkVariationParameterValueId)) {
        printStructure[GoodVariety.parameterTitle].push(GoodVariety);
        AddedVarietyIdsForPrintStruc.push(GoodVariety.fkVariationParameterValueId);
      }

      
    });
    VarietyExistencePossibility[varitySort(varietyIds).toString()] = index;
  });

  return [printStructure, VarietyExistencePossibility];
};

//   const [printStructure, VarietyExistencePossibility] = generatetGoodsVarietyExistencePossibilityAndPrintStructure(data);
