import { PrismaClient, Role, PropertyStatus } from '@prisma/client';
import { hashPassword } from '../src/utils/password.utils.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@propertyvision.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@propertyvision.com',
      passwordHash: hashPassword('Admin@12345'),
      role: Role.ADMIN,
    },
  });

  await prisma.property.upsert({
    where: { slug: 'lucky-garden-edara' },
    update: {},
    create: {
      title: 'Lucky Garden Edara',
      slug: 'lucky-garden-edara',
      city: 'Edara',
      locality: 'NTR District',
      address: 'Edara, NTR District, Andhra Pradesh',
      price: 4200,
      propertyType: 'Plotted Development',
      status: PropertyStatus.PUBLISHED,
      featured: true,
      description:
        'Premium plotted development project in Edara, NTR District, Andhra Pradesh. CRDA approved layout with 97 units across 4 acres. 33 ft wide internal roads with four clearly planned blocks. Clear title with legal and clean documents.',
      bedrooms: 97,
      area: 4,
      possessionStatus: 'Under Construction',
      media: {
        create: [
          { type: 'video', url: '/assets/images/property%20videos-1.MP4', caption: 'Project walkthrough', sortOrder: 0 },
          { type: 'image', url: '/assets/images/materplan%201.jpeg', caption: 'Master Plan', sortOrder: 1 },
          { type: 'image', url: '/assets/property1.jpg', caption: 'Front elevation', sortOrder: 2 },
          { type: 'master-plan', url: '/assets/images/materplan%201.jpeg', caption: 'Site Layout', sortOrder: 3 },
        ],
      },
      amenities: {
        create: [
          { name: 'CRDA Approved' }, { name: '24/7 Electricity' }, { name: 'Clear Title' },
          { name: '33 ft Wide Roads' }, { name: 'Planned Blocks' }, { name: 'Investment Potential' },
          { name: 'Site-ready Development' }, { name: 'Green Surroundings' },
        ],
      },
      isHomepageHero: true,
      homepageStatus: 'PUBLISHED',
      heroTitle: 'Edara Lucky Gardens Phase 2',
      heroSubtitle: 'Premium Plots Near ORR',
      heroDescription: 'Invest in a high-growth location with verified layout guidance, wide internal roads, and excellent access to key city corridors.',
      heroVideoUrl: '/assets/Video%20Project%202.mp4',
      heroImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
      startingPrice: '₹4,200',
      priceUnit: '/ Sq.Yd',
      offerBadge: 'Limited Period Offer',
      priceHighlight: 'STARTING PRICE',
      district: 'NTR',
      state: 'Andhra Pradesh',
      googleMapUrl: 'https://maps.google.com/?q=Vijayawada+ORR',
      landmark: 'Near ORR',
      totalPlots: '125',
      availableUnits: '35',
      distanceToORR: '2 KM',
      internalRoadWidth: '33 FT',
      btn1Label: 'View Full Property',
      btn1Type: 'internal',
      btn1Url: '/properties/lucky-garden-edara',
      btn2Label: 'Call Now',
      btn2Type: 'phone',
      btn2Url: '+917659926345',
      btn3Label: 'View Location',
      btn3Type: 'external',
      btn3Url: 'https://maps.google.com/?q=Vijayawada+ORR',
      whatsappNumber: '+917659926345',
      phoneNumber: '+917659926345',
      metaTitle: 'Lucky Garden Edara — Premium Plots Near ORR | Property Vision',
      metaDescription: 'Premium plotted development in Edara, NTR District. CRDA approved with 97 units, 33ft wide roads. Starting at ₹4,200/sq.yd.',
      keywords: 'Edara plots, NTR district real estate, CRDA approved layouts, Vijayawada plots, ORR property',
    },
  });

  await prisma.property.upsert({
    where: { slug: 'hyderabad-luxury-3bhk' },
    update: {},
    create: {
      title: 'Luxury 3BHK Apartment',
      slug: 'hyderabad-luxury-3bhk',
      city: 'Hyderabad',
      locality: 'Hitech City',
      status: PropertyStatus.PUBLISHED,
      featured: false,
      price: 8500000,
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      area: 1850,
      possessionStatus: 'Ready to Move',
      description: 'Premium apartment with modern amenities in the heart of Hitech City.',
      media: {
        create: [
          { type: 'image', url: '/assets/property1.jpg', caption: 'Front elevation', sortOrder: 0 },
        ],
      },
      amenities: {
        create: [
          { name: 'Swimming Pool' }, { name: 'Club House' }, { name: '24x7 Security' },
        ],
      },
    },
  });

  const hero = await prisma.propertyPageHero.findFirst();
  if (!hero) {
    await prisma.propertyPageHero.create({
      data: {
        headline: 'Discover verified properties',
        subheadline: 'Browse published listings, hero media, and master plans from Property Vision.',
        videoUrl: '/assets/images/property%20videos-1.MP4',
        bannerImageUrl: '/assets/banner.PNG',
        ctaLabel: 'Browse Properties',
        ctaHref: '/properties',
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
