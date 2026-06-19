export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          role: 'GUEST' | 'USER' | 'ADMIN';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          role?: 'GUEST' | 'USER' | 'ADMIN';
        };
        Update: {
          name?: string;
          phone?: string | null;
          role?: 'GUEST' | 'USER' | 'ADMIN';
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          slug: string;
          city: string;
          locality: string | null;
          address: string | null;
          price: number | null;
          propertyType: string | null;
          status: string;
          description: string | null;
          featured: boolean;
          bedrooms: number | null;
          bathrooms: number | null;
          area: number | null;
          possessionStatus: string | null;
          createdAt: string;
          updatedAt: string;
          isHomepageHero: boolean;
          heroTitle: string | null;
          heroSubtitle: string | null;
          heroDescription: string | null;
          heroVideoUrl: string | null;
          heroImageUrl: string | null;
          startingPrice: string | null;
          priceUnit: string | null;
          offerBadge: string | null;
          priceHighlight: string | null;
          district: string | null;
          state: string | null;
          googleMapUrl: string | null;
          landmark: string | null;
          totalPlots: string | null;
          availableUnits: string | null;
          distanceToORR: string | null;
          internalRoadWidth: string | null;
          btn1Label: string | null;
          btn1Type: string | null;
          btn1Url: string | null;
          btn2Label: string | null;
          btn2Type: string | null;
          btn2Url: string | null;
          btn3Label: string | null;
          btn3Type: string | null;
          btn3Url: string | null;
          whatsappNumber: string | null;
          phoneNumber: string | null;
          metaTitle: string | null;
          metaDescription: string | null;
          ogImageUrl: string | null;
          keywords: string | null;
          homepageStatus: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      property_media: {
        Row: {
          id: string;
          propertyId: string;
          type: string;
          url: string;
          caption: string | null;
          sortOrder: number;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      amenities: {
        Row: {
          id: string;
          propertyId: string;
          name: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      property_page_hero: {
        Row: {
          id: string;
          headline: string;
          subheadline: string;
          videoUrl: string | null;
          bannerImageUrl: string | null;
          ctaLabel: string | null;
          ctaHref: string | null;
          featuredPropertyId: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      leads: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          requirement: string | null;
          budget: string | null;
          whatsappOptIn: boolean;
          sourcePage: string | null;
          status: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      promotional_banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          offerText: string | null;
          price: string | null;
          location: string | null;
          phone: string | null;
          whatsapp: string | null;
          ctaText: string | null;
          ctaUrl: string | null;
          propertyUrl: string | null;
          bannerImage: string | null;
          bannerVideo: string | null;
          popupType: string;
          animationType: string;
          position: string;
          enableBlur: boolean;
          autoOpen: boolean;
          delayMs: number;
          isActive: boolean;
          priority: number;
          startDate: string | null;
          endDate: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      page_visits: {
        Row: {
          id: string;
          path: string;
          userId: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          path: string;
          userId?: string | null;
          referrer?: string | null;
        };
        Update: Record<string, never>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          propertyInterest: string | null;
          userId: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone: string;
          message?: string;
          propertyInterest?: string | null;
          userId?: string | null;
        };
        Update: Record<string, never>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
