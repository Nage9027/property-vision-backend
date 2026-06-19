export interface PropertyMedia {
  id?: string;
  type: string;
  url: string;
  caption?: string | null;
  sortOrder?: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  city: string;
  locality?: string | null;
  address?: string | null;
  price?: string | number | null;
  propertyType?: string | null;
  status?: string;
  description?: string | null;
  featured?: boolean;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  possessionStatus?: string | null;
  createdAt?: string;
  updatedAt?: string;
  amenities?: string[];
  media?: PropertyMedia[];

  // Homepage hero fields
  isHomepageHero?: boolean;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  heroVideoUrl?: string | null;
  heroImageUrl?: string | null;
  startingPrice?: string | null;
  priceUnit?: string | null;
  offerBadge?: string | null;
  priceHighlight?: string | null;
  district?: string | null;
  state?: string | null;
  googleMapUrl?: string | null;
  landmark?: string | null;
  totalPlots?: string | null;
  availableUnits?: string | null;
  distanceToORR?: string | null;
  internalRoadWidth?: string | null;
  btn1Label?: string | null;
  btn1Type?: string | null;
  btn1Url?: string | null;
  btn2Label?: string | null;
  btn2Type?: string | null;
  btn2Url?: string | null;
  btn3Label?: string | null;
  btn3Type?: string | null;
  btn3Url?: string | null;
  email?: string | null;
  whatsappNumber?: string | null;
  phoneNumber?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  keywords?: string | null;
  homepageStatus?: string | null;

  // Dynamic page content
  investmentOverview?: Record<string, unknown> | null;
  expectedROI?: string | null;
  investmentBenefits?: Record<string, unknown>[] | null;
  locationAdvantages?: Record<string, unknown>[] | null;
  testimonials?: Record<string, unknown>[] | null;
  faqs?: Record<string, unknown>[] | null;
  siteVisitBenefits?: Record<string, unknown>[] | null;
  contactInformation?: Record<string, unknown> | null;
  footerInformation?: Record<string, unknown> | null;
  customSections?: Record<string, unknown>[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export type PlotStatus = 'AVAILABLE' | 'SOLD' | 'RESERVED';
export type Facing = 'EAST' | 'WEST' | 'NORTH' | 'SOUTH';

export interface Plot {
  id: string;
  propertyId: string;
  plotNumber: string;
  facing: Facing;
  sizeSqYds: number;
  roadWidth: string | null;
  status: PlotStatus;
  pricePerSqYd: string | null;
  isCorner: boolean;
  isCommercialFacing: boolean;
  isParkFacing: boolean;
  features: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlotSummary {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  facingDistribution: Record<string, number>;
  cornerPlots: number;
  commercialFacingPlots: number;
  parkFacingPlots: number;
  plotSizeRange: { min: number; max: number };
  lastUpdated: string | null;
}

export interface PropertyPageHero {
  id: string;
  headline: string;
  subheadline: string;
  videoUrl?: string | null;
  bannerImageUrl?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  featuredPropertyId?: string | null;
  featuredProperty?: Property | null;
}
