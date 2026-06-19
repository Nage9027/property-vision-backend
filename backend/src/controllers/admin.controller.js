import { getPropertyDashboardStats, listAllProperties } from '../services/property.service.js';
import { listLeads } from '../services/lead.service.js';
import { database } from '../config/database.js';

export async function dashboard(req, res, next) {
  try {
    const [stats, leads] = await Promise.all([getPropertyDashboardStats(), listLeads()]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [visits30d, connectedLeads] = await Promise.all([
      database.pageVisit.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      database.lead.count({ where: { status: { in: ['CONTACTED', 'QUALIFIED'] } } }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          ...stats,
          visits30d,
          connectedLeads,
        },
        leads: leads.slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function listProperties(req, res, next) {
  try {
    const data = await listAllProperties();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
