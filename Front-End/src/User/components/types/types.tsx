export interface ProductVariant {
  variantId: string;
  mrp: number;
  sellingPrice: number;
  productDescription?: string;
  productTitle: string;
  minimumOrderQty?: number;
  shippingProvider?: string;
  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
  hsnCode?: string;
  taxCode?: string;
  countryOfOrigin?: string;
  manufactureDetails?: string;
  packerDetails?: string;
  procurementSLA?: string;
  procurementType?: string;
  inTheBox?: string;
  warrantyPeriod?: string;
  warrantySummary?: string;
  colorId?: string;
  colorName?: string;
  brandName?: string;
  categoryName?: string;
  productId: string;
  stockQty?: number;
  images: string[];
  specifications?: string[];
  sizes?: { size: string; sizeHeadId: string }[];
  searchKeywords?: string[];
  features?: { title: string; content: string }[];
  averageRating?: number; // Average rating across feedback
  totalFeedback?: number; // Total number of feedback entries
  feedbackDetails?: {
    user: any; // Individual feedback entries
    rating: number;
    title?: string;
    description?: string;
    media?: { url: string; type: "image" | "video" }[];
    userId: string;
    userName?: string;
    createdAt: string;
  }[];
}

export interface existingUserData {
  userEmail: string;
  userMobileNumber: string;
  userName: string;
  _id: string;
}

// types/category.ts
export interface Category {
  _id: string;
  categoryName: string;
  mainCategory: string | null;
  subcategories: Category[]; // Non-optional, always an array
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
