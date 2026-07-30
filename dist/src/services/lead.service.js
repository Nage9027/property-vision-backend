import { database } from '../config/database.js';
export async function createLead(input) {
    return database.lead.create({
        data: {
            name: input.name.trim(),
            phone: input.phone.trim(),
            email: input.email.trim().toLowerCase(),
            requirement: input.requirement?.trim() || null,
            budget: input.budget?.trim() || null,
            whatsappOptIn: Boolean(input.whatsappOptIn),
            sourcePage: input.sourcePage?.trim() || null,
        },
    });
}
export async function listLeads() {
    return database.lead.findMany({ orderBy: { createdAt: 'desc' } });
}
