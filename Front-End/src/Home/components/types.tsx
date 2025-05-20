// src/types.ts
export interface Product {
  image: string | undefined;
  productTitle: any;
  sellingPrice: any;
  _id: string;
  productId: string;
  sellerId: string;
  skuId: string;
  ListingStatus: string;
  fulfilmentBy: string;
  qcStatus: string;
  createdAt: string;
  updatedAt: string;
  localDeliveryCharge: string;
  zonalDeliveryCharge: string;
  categoryName: string;
  brandName: string;
  sellerName: string;
  topcategoryId?: string;
  variantId?: string; // Optional
  imageUrl?: string; // Optional
}

export interface CategoryGroup {
  categoryId: string;
  categoryName: any;
  topParentCategoryId: string;
  topParentCategoryName: string;
  productCount: number;
  products: Product[];
}

export interface Variant {
  _id: string;
  productId: string;
  imageUrl?: string; // Adjust based on your API response
  // Add other variant fields as needed
}
