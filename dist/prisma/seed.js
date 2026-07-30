import { PrismaClient, Role, PropertyStatus } from '@prisma/client';
import { hashPassword } from '../src/utils/password.utils.js';
const prisma = new PrismaClient();
async function main() {
    await prisma.property.upsert({
        where: { slug: 'hyderabad-luxury-3bhk' },
        update: {},
        create: {
            title: 'Luxury 3BHK Apartment',
            slug: 'hyderabad-luxury-3bhk',
            city: 'Hyderabad',
            locality: 'Hitech City',
            status: PropertyStatus.PUBLISHED,
            featured: true,
            description: 'Premium apartment with modern amenities.',
            media: {
                create: [
                    {
                        type: 'image',
                        url: '/assets/property1.jpg',
                        caption: 'Front elevation',
                        sortOrder: 0,
                    },
                    {
                        type: 'master-plan',
                        url: '/assets/images/materplan%201.jpeg',
                        caption: 'Master plan',
                        sortOrder: 1,
                    },
                ],
            },
            amenities: {
                create: [{ name: 'Swimming Pool' }, { name: 'Club House' }, { name: '24x7 Security' }],
            },
        },
    });
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
