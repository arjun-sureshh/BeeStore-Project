import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface for the product Price and Stock page
interface productFields {
  brandId: undefined;
  categoryId: undefined;
  skuId: string;
  mrp: string;
  fullfilementBy: string;
  ProcurementType: string;
  ProcurementSLA: string;
  sellingPrice: string;
  stock: string;
  shippingProvider: string;
  localDeliveryCharge: string;
  ZonalDeliveryCharge: string;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  HSN: string;
  taxCode: string;
  countryOfOrigin: string;
  manufacturerDetails: string;
  packerDetails: string;
  productTitle: string;
  productDiscription: string;
  intheBox: string;
  minimumOrderQty: string;
  color: string;
  warantySummary: string;
  warrantyPeriod: string;
  searchKeyword: string;
  featureTitle: string;
  featureContent: string;
  sizebody: string;
  sizeHeadId: string;
}

// interface for features
interface Feature {
  title: string;
  content: string;
}

// interface for search keywords
interface searchKeyWords {
  searchKeyWord: string;
}

// interface for specifications
interface specification {
  specification: string;
}

// interface for the fields inside of initial state
interface ToggleState {
  reduxStateName: any;
  menuOpen: boolean;
  openPage: { [key: string]: boolean };
  openPageinUser: { [key: string]: boolean };
  productAdddingState: number | null;
  sellerRegistrationStage: number;
  productId: string;
  sellerId: string;
  productVaraintId: string;
  productFields: productFields;
  features: Feature[];
  searchKeyWords: searchKeyWords[];
  productSpecification: specification[];
  images: (File | string)[];
  clickedForproductListing: string;
  singleProductId: string;
  searchTerm: string; // ✅ Added for search functionality
}

// initialState
const initialState: ToggleState = {
  menuOpen: false,
  openPage: {},
  openPageinUser: {},
  productAdddingState: 1,
  sellerRegistrationStage: 1,
  clickedForproductListing: "",
  singleProductId: "",
  productId: "",
  sellerId: "",
  productVaraintId: "",
  productFields: {
    skuId: "",
    mrp: "",
    fullfilementBy: "",
    ProcurementType: "",
    ProcurementSLA: "",
    sellingPrice: "",
    stock: "",
    shippingProvider: "",
    localDeliveryCharge: "",
    ZonalDeliveryCharge: "",
    length: "",
    breadth: "",
    height: "",
    weight: "",
    HSN: "",
    taxCode: "",
    countryOfOrigin: "",
    manufacturerDetails: "",
    packerDetails: "",
    productTitle: "",
    productDiscription: "",
    intheBox: "",
    minimumOrderQty: "",
    color: "",
    warantySummary: "",
    warrantyPeriod: "",
    searchKeyword: "",
    featureTitle: "",
    featureContent: "",
    sizebody: "",
    sizeHeadId: "",
    brandId: undefined,
    categoryId: undefined,
  },
  features: [],
  searchKeyWords: [],
  productSpecification: [],
  images: [],
  reduxStateName: undefined,
  searchTerm: "", // ✅ Initialize searchTerm
};

const toggleSlice = createSlice({
  name: "toogle",
  initialState,
  reducers: {
    toggleMenuOpen: (state) => {
      state.menuOpen = !state.menuOpen;
    },
    togglePageControl: (state, action: PayloadAction<string>) => {
      const title = action.payload;
      state.openPage = {};
      state.openPage[title] = true;
    },
    toggleResetPage: (state) => {
      state.openPage = {};
    },
    togglePageControlInUser: (state, action: PayloadAction<string>) => {
      const title = action.payload;
      state.openPageinUser = {};
      state.openPageinUser[title] = true;
    },
    toggleResetPageInUser: (state) => {
      state.openPageinUser = {};
    },
    toggleProductAddingState: (state, action: PayloadAction<number>) => {
      state.productAdddingState = action.payload;
    },
    toggleSellerRegistrationStage: (state, action: PayloadAction<number>) => {
      state.sellerRegistrationStage = action.payload;
    },
    toggleProductId: (state, action: PayloadAction<string>) => {
      state.productId = action.payload;
    },
    toggleSellerId: (state, action: PayloadAction<string>) => {
      state.sellerId = action.payload;
    },
    toggleProductVaraintId: (state, action: PayloadAction<string>) => {
      state.productVaraintId = action.payload;
    },
    toggleClickedForproductListing: (state, action: PayloadAction<string>) => {
      state.clickedForproductListing = action.payload;
    },
    toggleSingleProductId: (state, action: PayloadAction<string>) => {
      state.singleProductId = action.payload;
    },
    toggleProductFields: <T extends keyof productFields>(
      state: ToggleState,
      action: PayloadAction<{ field: T; value: productFields[T] }>,
    ) => {
      (state.productFields as Record<keyof productFields, any>)[
        action.payload.field
      ] = action.payload.value;
    },
    toggleFeatureAdd: (state, action: PayloadAction<Feature>) => {
      state.features.push(action.payload);
    },
    removeFeatureField: (state, action: PayloadAction<number>) => {
      state.features = state.features.filter((_, i) => i !== action.payload);
    },
    updateFeatureField: (
      state,
      action: PayloadAction<{
        index: number;
        key: "title" | "content";
        value: string;
      }>,
    ) => {
      state.features[action.payload.index][action.payload.key] =
        action.payload.value;
    },
    toggleAddImage: (state, action: PayloadAction<File | string[]>) => {
      if (Array.isArray(action.payload)) {
        state.images = action.payload; // Replace with fetched URLs
      } else {
        state.images.push(action.payload); // Append new File
      }
    },
    // Update toggleSearchKeyWordAdd to accept single searchKeyWords or array
    toggleSearchKeyWordAdd: (
      state,
      action: PayloadAction<searchKeyWords | searchKeyWords[]>,
    ) => {
      if (Array.isArray(action.payload)) {
        state.searchKeyWords = action.payload; // Replace with fetched keywords
      } else {
        state.searchKeyWords.push(action.payload); // Append new keyword
      }
    },
    toggleSearchKeyWordFieldRemove: (state, action: PayloadAction<number>) => {
      state.searchKeyWords = state.searchKeyWords.filter(
        (_, i) => i !== action.payload,
      );
    },
    toggleSearchKeyWordsUpdate: (
      state,
      action: PayloadAction<{ index: number; value: string }>,
    ) => {
      if (state.searchKeyWords[action.payload.index]) {
        state.searchKeyWords[action.payload.index].searchKeyWord =
          action.payload.value;
      }
    },
    toggleSpecificationAdd: (state, action: PayloadAction<specification>) => {
      state.productSpecification.push(action.payload);
    },
    toggleSpecificationRemove: (state, action: PayloadAction<number>) => {
      state.productSpecification = state.productSpecification.filter(
        (_, i) => i !== action.payload,
      );
    },
    toggleSpecificationUpdate: (
      state,
      action: PayloadAction<{ index: number; value: string }>,
    ) => {
      if (state.productSpecification[action.payload.index]) {
        state.productSpecification[action.payload.index].specification =
          action.payload.value;
      }
    },
    // toggleAddImage: (state, action: PayloadAction<File>) => {
    //     state.images.push(action.payload);
    // },
    toggleRemoveImage: (state, action: PayloadAction<number>) => {
      state.images = state.images.filter((_, i) => i !== action.payload);
    },
    toggleResetProductData: (state) => {
      state.productFields = { ...initialState.productFields };
      state.features = [];
      state.searchKeyWords = [];
      state.productSpecification = [];
      state.images = [];
      state.productVaraintId = "";
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload; // ✅ Add search term reducer
    },
  },
});

export const {
  toggleMenuOpen,
  toggleResetPage,
  togglePageControl,
  toggleProductAddingState,
  toggleProductId,
  toggleProductFields,
  toggleResetProductData,
  toggleFeatureAdd,
  removeFeatureField,
  updateFeatureField,
  toggleSellerRegistrationStage,
  toggleSellerId,
  toggleProductVaraintId,
  toggleSearchKeyWordAdd,
  toggleSearchKeyWordFieldRemove,
  toggleSearchKeyWordsUpdate,
  toggleAddImage,
  toggleRemoveImage,
  togglePageControlInUser,
  toggleResetPageInUser,
  toggleSpecificationAdd,
  toggleSpecificationRemove,
  toggleSpecificationUpdate,
  toggleClickedForproductListing,
  toggleSingleProductId,
  setSearchTerm, // ✅ Export new action
} = toggleSlice.actions;

export default toggleSlice.reducer;
