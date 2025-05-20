import axios from "axios";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import { Dispatch } from "redux";
import {
  toggleAddImage,
  toggleProductFields,
  toggleProductVaraintId,
  toggleSearchKeyWordAdd,
} from "../../../../../redux/toogleSlice";

// Interface for ProductFields (aligned with MongoDB schema, mapping Redux fields)
export interface ProductFields {
  skuId: string;
  fulfilmentBy: string;
  localDeliveryCharge: string;
  zonalDeliveryCharge: string;
  mrp: string;
  sellingPrice: string;
  stock: string;
  shippingProvider: string;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  hsnCode: string;
  taxCode: string;
  countryOfOrigin: string;
  manufacturerDetails: string;
  packerDetails: string;
  productTitle: string;
  productDescription: string;
  inTheBox: string;
  minimumOrderQty: string;
  color: string;
  warrantySummary: string;
  warrantyPeriod: string;
  procurementType: string;
  procurementSLA: string;
  sizeBody: string;
  sizeHeadId: string;
}

// Interface for FetchedData (aligned with MongoDB schema)
export interface FetchedData {
  _id: string;
  ProductVariantId: string;
  productId: string;
  stockqty: string;
  mrp: string;
  sellingPrice: string;
  shippingProvider: string;
  Length: string;
  breadth: string;
  height: string;
  weight: string;
  hsnCode: string;
  taxCode: string;
  countryOfOrgin: string;
  manufactureDetails: string;
  packerDetails: string;
  productTitle: string;
  productDiscription: string;
  intheBox: string;
  minimumOrderQty: string;
  colorId: string;
  warrantySummary: string;
  warrantyPeriod: string;
  procurementType: string;
  procurementSLA: string;
  size: { size: string; sizeHeadNameId: string }[];
  photos: string[];
  searchKeyWord: string[];
  featureTitle: string[];
  featureContent: string[];
}

// Map Redux fields to MongoDB schema
const mapReduxToApiPayload = (fields: any) => ({
  skuId: Number(fields.skuId) || null,
  fulfilmentBy: fields.fullfilementBy || null,
  localDeliveryCharge: fields.localDeliveryCharge || null,
  zonalDeliveryCharge: fields.zonalDeliveryCharge || null,
  mrp: Number(fields.mrp) || null,
  sellingPrice: Number(fields.sellingPrice) || null,
  stock: Number(fields.stock) || null,
  shippingProvider: fields.shippingProvider || null,
  Length: Number(fields.length) || null,
  breadth: Number(fields.breadth) || null,
  height: Number(fields.height) || null,
  weight: Number(fields.weight) || null,
  hsnCode: fields.HSN || null,
  taxCode: fields.taxCode || null,
  countryOfOrgin: fields.countryOfOrigin || null,
  manufactureDetails: fields.manufacturerDetails || null,
  packerDetails: fields.packerDetails || null,
  productTitle: fields.productTitle || null,
  productDiscription: fields.productDiscription || null,
  intheBox: fields.intheBox || null,
  minimumOrderQty: Number(fields.minimumOrderQty) || null,
  colorId: fields.color || null,
  warantySummary: fields.warantySummary || null,
  warrantyPeriod: fields.warrantyPeriod || null,
  procurementType: fields.ProcurementType || null,
  procurementSLA: fields.ProcurementSLA || null,
  size: fields.sizebody || null,
  sizeHeadNameId: fields.sizeHeadId || null,
});

// Required fields for validation
const requiredFields: (keyof ProductFields)[] = [
  "skuId",
  "mrp",
  "sellingPrice",
  "stock",
  "shippingProvider",
  "localDeliveryCharge",
  "zonalDeliveryCharge",
  "weight",
  "hsnCode",
  "taxCode",
  "fulfilmentBy",
  "procurementType",
  "productTitle",
  "productDescription",
  "inTheBox",
  "minimumOrderQty",
  "manufacturerDetails",
  "packerDetails",
];

// Validate required fields
export const validateRequiredFields = (
  productFields: ProductFields,
  requireAll: boolean,
): boolean => {
  if (requireAll) {
    for (const key of requiredFields) {
      if (!productFields[key]) {
        toast.error(`Please fill in the ${key} field.`);
        return false;
      }
    }
  }
  return true;
};

// Validate images
export const validateImages = (productImages: File[]): boolean => {
  if (!productImages || productImages.length === 0) {
    toast.error("Please upload at least one image.");
    return false;
  }
  for (const file of productImages) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`Image ${file.name} exceeds 5MB.`);
      return false;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error(`Image ${file.name} must be JPEG or PNG.`);
      return false;
    }
  }
  return true;
};

// API call with retry logic
export const apiCallWithRetry = async (
  method: string,
  url: string,
  data: any,
  headers = {},
  retries = 3,
) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios({
        method,
        url,
        data,
        headers: { ...headers, "x-auth-token": localStorage.getItem("token") },
      });
      return response.data;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Fetch product data
export const fetchProductData = async (
  productId: string,
  dispatch: Dispatch,
  setFetchedData: (data: FetchedData[]) => void,
) => {
  const abortController = new AbortController();
  const fetchData = debounce(async () => {
    if (!productId) return;
    try {
      const [productResponse, variantResponse] = await Promise.all([
        apiCallWithRetry(
          "get",
          `http://localhost:5000/api/productUpload/product/fetchProductData/${productId}`,
          null,
          {
            signal: abortController.signal,
          },
        ),
        apiCallWithRetry(
          "get",
          `http://localhost:5000/api/productUpload/productvaraint/fetchVaraintByProductId/${productId}`,
          null,
          {
            signal: abortController.signal,
          },
        ),
      ]);
      const productData = productResponse.data;
      const variants = variantResponse.data;

      dispatch(
        toggleProductFields({
          field: "skuId",
          value: String(productData.skuId || ""),
        }),
      );
      dispatch(
        toggleProductFields({
          field: "fullfilementBy",
          value: productData.fulfilmentBy || "",
        }),
      );
      dispatch(
        toggleProductFields({
          field: "localDeliveryCharge",
          value: productData.localDeliveryCharge || "",
        }),
      );
      dispatch(
        toggleProductFields({
          field: "ZonalDeliveryCharge",
          value: productData.zonalDeliveryCharge || "",
        }),
      );

      setFetchedData(variants);

      if (variants.length > 0) {
        const firstVariant = variants[0];
        dispatch(
          toggleProductFields({
            field: "length",
            value: String(firstVariant.Length || ""),
          }),
        );
        dispatch(
          toggleProductFields({
            field: "breadth",
            value: String(firstVariant.breadth || ""),
          }),
        );
        dispatch(
          toggleProductFields({
            field: "height",
            value: String(firstVariant.height || ""),
          }),
        );
        dispatch(
          toggleProductFields({
            field: "weight",
            value: String(firstVariant.weight || ""),
          }),
        );
        dispatch(
          toggleProductFields({
            field: "countryOfOrigin",
            value: firstVariant.countryOfOrgin || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "HSN",
            value: firstVariant.hsnCode || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "intheBox",
            value: firstVariant.intheBox || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "manufacturerDetails",
            value: firstVariant.manufactureDetails || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "minimumOrderQty",
            value: String(firstVariant.minimumOrderQty || ""),
          }),
        );
        dispatch(
          toggleProductFields({
            field: "mrp",
            value: String(firstVariant.mrp || ""),
          }),
        );
        dispatch(
          toggleProductFields({
            field: "packerDetails",
            value: firstVariant.packerDetails || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "productDiscription",
            value: firstVariant.productDiscription || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "ProcurementType",
            value: firstVariant.procurementType || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "ProcurementSLA",
            value: firstVariant.procurementSLA || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "color",
            value: firstVariant.colorId || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "productTitle",
            value: firstVariant.productTitle || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "sellingPrice",
            value: String(firstVariant.sellingPrice || ""),
          }),
        );
        dispatch(
          toggleProductFields({
            field: "shippingProvider",
            value: firstVariant.shippingProvider || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "taxCode",
            value: firstVariant.taxCode || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "warantySummary",
            value: firstVariant.warantySummary || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "warrantyPeriod",
            value: firstVariant.warrantyPeriod || "",
          }),
        );
        dispatch(toggleAddImage(firstVariant.photos || []));
        dispatch(
          toggleProductFields({
            field: "stock",
            value: String(firstVariant.stockqty || ""),
          }),
        );
        dispatch(
          toggleProductFields({
            field: "sizebody",
            value: firstVariant.size?.[0]?.size || "",
          }),
        );
        dispatch(
          toggleProductFields({
            field: "sizeHeadId",
            value: firstVariant.size?.[0]?.sizeHeadNameId || "",
          }),
        );
        firstVariant.searchKeyWord?.forEach((keyword: string) => {
          dispatch(toggleSearchKeyWordAdd({ searchKeyWord: keyword }));
        });
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      toast.error("Failed to fetch product data");
    }
  }, 300);

  fetchData();

  return () => {
    abortController.abort();
    fetchData.cancel();
  };
};

// Update product
export const updateProduct = async (
  productId: string,
  productFields: Partial<ProductFields>,
  listingStatus: number,
) => {
  try {
    const mappedFields = mapReduxToApiPayload(productFields);
    const response = await apiCallWithRetry(
      "put",
      `http://localhost:5000/api/productUpload/product/skuidUpdate/${productId}`,
      {
        skuId: mappedFields.skuId,
        fulfilmentBy: mappedFields.fulfilmentBy,
        localDeliveryCharge: mappedFields.localDeliveryCharge,
        zonalDeliveryCharge: mappedFields.zonalDeliveryCharge,
        ListingStatus: listingStatus,
      },
    );
    toast.success("Product updated successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to update product: ${error.message}`);
    throw error;
  }
};

// Create product variant
export const createProductVariant = async (productId: string) => {
  try {
    const response = await apiCallWithRetry(
      "post",
      "http://localhost:5000/api/productUpload/productvaraint",
      { productId },
    );
    toast.success("Product variant created successfully");
    return response.data._id;
  } catch (error: any) {
    toast.error(`Failed to create product variant: ${error.message}`);
    throw error;
  }
};

// Update product variant
export const updateProductVariant = async (
  variantId: string | null,
  productId: string,
  productFields: Partial<ProductFields>,
) => {
  try {
    const mappedFields = mapReduxToApiPayload(productFields);
    const response = await apiCallWithRetry(
      "put",
      `http://localhost:5000/api/productUpload/productvaraint/updateVaraint/${variantId}`,
      {
        productId,
        mrp: mappedFields.mrp,
        sellingPrice: mappedFields.sellingPrice,
        minimumOrderQty: mappedFields.minimumOrderQty,
        shippingProvider: mappedFields.shippingProvider,
        Length: mappedFields.Length,
        breadth: mappedFields.breadth,
        weight: mappedFields.weight,
        height: mappedFields.height,
        hsnCode: mappedFields.hsnCode,
        taxCode: mappedFields.taxCode,
        countryOfOrgin: mappedFields.countryOfOrgin,
        manufactureDetails: mappedFields.manufactureDetails,
        packerDetails: mappedFields.packerDetails,
        productDiscription: mappedFields.productDiscription,
        productTitle: mappedFields.productTitle,
        procurementType: mappedFields.procurementType,
        procurementSLA: mappedFields.procurementSLA,
        colorId: mappedFields.colorId,
        intheBox: mappedFields.intheBox,
        warrantyPeriod: mappedFields.warrantyPeriod,
        warantySummary: mappedFields.warantySummary,
      },
    );
    toast.success("Product variant updated successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to update product variant: ${error.message}`);
    throw error;
  }
};

// Create key features
export const createKeyFeatures = async (
  variantId: string | null,
  keyFeatures: { title: string; content: string }[],
) => {
  try {
    if (
      !keyFeatures ||
      keyFeatures.every(
        (feature) => !feature.title.trim() || !feature.content.trim(),
      )
    ) {
      return;
    }
    const response = await apiCallWithRetry(
      "post",
      "http://localhost:5000/api/productUpload/keyfeatures",
      {
        productVariantId: variantId,
        features: keyFeatures,
      },
    );
    toast.success("Key features saved successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to save key features: ${error.message}`);
    throw error;
  }
};

// Create search keywords
export const createSearchKeywords = async (
  variantId: string | null,
  searchKeywords: { searchKeyWord: string }[],
) => {
  try {
    if (
      !searchKeywords ||
      searchKeywords.every((keyword) => !keyword.searchKeyWord.trim())
    ) {
      return;
    }
    const response = await apiCallWithRetry(
      "post",
      "http://localhost:5000/api/productUpload/searchkeyword",
      {
        productVariantId: variantId,
        searchKeyWords: searchKeywords,
      },
    );
    toast.success("Search keywords saved successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to save search keywords: ${error.message}`);
    throw error;
  }
};

// Create specifications
export const createSpecifications = async (
  variantId: string | null,
  specifications: { specification: string }[],
) => {
  try {
    if (
      !specifications ||
      specifications.every((spec) => !spec.specification.trim())
    ) {
      return;
    }
    const response = await apiCallWithRetry(
      "post",
      "http://localhost:5000/api/productUpload/specification",
      {
        productVariantId: variantId,
        specification: specifications,
      },
    );
    toast.success("Specifications saved successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to save specifications: ${error.message}`);
    throw error;
  }
};

// Upload images
export const uploadImages = async (
  variantId: string | null,
  productImages: File[],
) => {
  try {
    if (!validateImages(productImages)) {
      throw new Error("Image validation failed");
    }
    const formData = new FormData();
    productImages.forEach((file) => formData.append("photos", file));
    formData.append("productVariantId", variantId || "default-variant-id");

    const response = await apiCallWithRetry(
      "post",
      "http://localhost:5000/api/productUpload/gallery/gallery",
      formData,
      {
        "Content-Type": "multipart/form-data",
      },
    );
    toast.success("Images uploaded successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to upload images: ${error.message}`);
    throw error;
  }
};

// Create stock
export const createStock = async (variantId: string | null, stock: string) => {
  try {
    if (!stock) {
      return;
    }
    const response = await apiCallWithRetry(
      "post",
      "http://localhost:5000/api/productUpload/productstock",
      {
        productvariantId: variantId,
        stockqty: stock,
      },
    );
    toast.success("Stock created successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to create stock: ${error.message}`);
    throw error;
  }
};

// Update stock
export const updateStock = async (variantId: string | null, stock: string) => {
  try {
    if (!stock) {
      return;
    }
    const response = await apiCallWithRetry(
      "put",
      `http://localhost:5000/api/productUpload/productstock/updateStock/${variantId}`,
      {
        stockqty: stock,
      },
    );
    toast.success("Stock updated successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to update stock: ${error.message}`);
    throw error;
  }
};

// Create size
export const createSize = async (
  variantId: string | null,
  size: string,
  sizeHeadNameId: string,
) => {
  try {
    if (!size || !sizeHeadNameId) {
      return;
    }
    const response = await apiCallWithRetry(
      "post",
      "http://localhost:5000/api/productUpload/sizebody",
      {
        productvariantId: variantId,
        size,
        sizeHeadNameId,
      },
    );
    toast.success("Size created successfully");
    return response.data;
  } catch (error: any) {
    toast.error(`Failed to create size: ${error.message}`);
    throw error;
  }
};

// Delete variant
export const deleteVariant = async (variantId: string) => {
  try {
    const response = await apiCallWithRetry(
      "delete",
      `http://localhost:5000/api/productUpload/product/deleteVariant/${variantId}`,
      null,
    );
    toast.success("Variant deleted successfully");
    return response;
  } catch (error: any) {
    toast.error(`Failed to delete variant: ${error.message}`);
    throw error;
  }
};

// Save all data (replacing saveAllData)
export const saveAllData = async (
  productId: string,
  variantId: string | null,
  productFields: ProductFields,
  productImages: File[],
  keyFeatures: { title: string; content: string }[],
  searchKeywords: { searchKeyWord: string }[],
  specifications: { specification: string }[],
  listingStatus: number,
  requireAllFields: boolean,
  setIsLoading: (loading: boolean) => void,
) => {
  if (!validateRequiredFields(productFields, requireAllFields)) {
    throw new Error("Validation failed");
  }
  setIsLoading(true);
  try {
    toast.info("Processing...");

    // Update product
    await updateProduct(productId, productFields, listingStatus);

    // Create or use variant
    let finalVariantId = variantId;
    if (!finalVariantId) {
      finalVariantId = await createProductVariant(productId);
    }

    // Update variant
    await updateProductVariant(finalVariantId, productId, productFields);

    // Save key features
    await createKeyFeatures(finalVariantId, keyFeatures);

    // Save search keywords
    await createSearchKeywords(finalVariantId, searchKeywords);

    // Save specifications
    await createSpecifications(finalVariantId, specifications);

    // Upload images
    await uploadImages(finalVariantId, productImages);

    // Create or update stock
    if (productFields.stock) {
      const stockExists = await apiCallWithRetry(
        "get",
        `http://localhost:5000/api/productUpload/productstock/${finalVariantId}`,
        null,
      );
      if (stockExists.data) {
        await updateStock(finalVariantId, productFields.stock);
      } else {
        await createStock(finalVariantId, productFields.stock);
      }
    }

    // Create size
    if (productFields.sizeBody && productFields.sizeHeadId) {
      await createSize(
        finalVariantId,
        productFields.sizeBody,
        productFields.sizeHeadId,
      );
    }

    toast.success("Product data saved successfully!");
    return finalVariantId;
  } catch (error: any) {
    toast.error(`Failed to save product data: ${error.message}`);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

// Handle variant selection
export const handleSelectVariant = (
  variant: FetchedData,
  dispatch: Dispatch,
) => {
  dispatch(
    toggleProductFields({
      field: "length",
      value: String(variant.Length || ""),
    }),
  );
  dispatch(
    toggleProductFields({
      field: "breadth",
      value: String(variant.breadth || ""),
    }),
  );
  dispatch(
    toggleProductFields({
      field: "height",
      value: String(variant.height || ""),
    }),
  );
  dispatch(
    toggleProductFields({
      field: "weight",
      value: String(variant.weight || ""),
    }),
  );
  dispatch(
    toggleProductFields({
      field: "countryOfOrigin",
      value: variant.countryOfOrgin || "",
    }),
  );
  dispatch(toggleProductFields({ field: "HSN", value: variant.hsnCode || "" }));
  dispatch(
    toggleProductFields({ field: "intheBox", value: variant.intheBox || "" }),
  );
  dispatch(
    toggleProductFields({
      field: "manufacturerDetails",
      value: variant.manufactureDetails || "",
    }),
  );
  dispatch(
    toggleProductFields({
      field: "minimumOrderQty",
      value: String(variant.minimumOrderQty || ""),
    }),
  );
  dispatch(
    toggleProductFields({ field: "mrp", value: String(variant.mrp || "") }),
  );
  dispatch(
    toggleProductFields({
      field: "packerDetails",
      value: variant.packerDetails || "",
    }),
  );
  dispatch(
    toggleProductFields({
      field: "productDiscription",
      value: variant.productDiscription || "",
    }),
  );
  dispatch(
    toggleProductFields({
      field: "ProcurementType",
      value: variant.procurementType || "",
    }),
  );
  dispatch(
    toggleProductFields({
      field: "ProcurementSLA",
      value: variant.procurementSLA || "",
    }),
  );
  dispatch(
    toggleProductFields({ field: "color", value: variant.colorId || "" }),
  );
  dispatch(
    toggleProductFields({
      field: "productTitle",
      value: variant.productTitle || "",
    }),
  );
  dispatch(
    toggleProductFields({
      field: "sellingPrice",
      value: String(variant.sellingPrice || ""),
    }),
  );
  dispatch(
    toggleProductFields({
      field: "shippingProvider",
      value: variant.shippingProvider || "",
    }),
  );
  dispatch(
    toggleProductFields({ field: "taxCode", value: variant.taxCode || "" }),
  );
  dispatch(
    toggleProductFields({
      field: "warantySummary",
      value: variant.warrantySummary || "",
    }),
  );
  dispatch(
    toggleProductFields({
      field: "warrantyPeriod",
      value: variant.warrantyPeriod || "",
    }),
  );
  dispatch(toggleAddImage(variant.photos || []));
  dispatch(
    toggleProductFields({
      field: "stock",
      value: String(variant.stockqty || ""),
    }),
  );
  dispatch(
    toggleProductFields({
      field: "sizebody",
      value: variant.size?.[0]?.size || "",
    }),
  );
  dispatch(
    toggleProductFields({
      field: "sizeHeadId",
      value: variant.size?.[0]?.sizeHeadNameId || "",
    }),
  );
  variant.searchKeyWord?.forEach((keyword: string) => {
    dispatch(toggleSearchKeyWordAdd({ searchKeyWord: keyword }));
  });
  dispatch(toggleProductVaraintId(variant._id));
};
