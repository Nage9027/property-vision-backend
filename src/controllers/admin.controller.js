import { getPropertyDashboardStats, listAllProperties } from '../services/property.service.js';
import { listLeads } from '../services/lead.service.js';
import { database } from '../config/database.js';

export async function dashboard(req, res, next) {
  try {
    let stats, leads;
    try {
      [stats, leads] = await Promise.all([getPropertyDashboardStats(), listLeads()]);
    } catch (err) {
      console.error('[ADMIN] Stats/leads query failed:', err instanceof Error ? err.message : String(err));
      const error = new Error(`Dashboard data query failed — ${err instanceof Error ? err.message : String(err)}`);
      error.status = 500;
      throw error;
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let visits30d = 0, connectedLeads = 0;
    try {
      const results = await Promise.all([
        database.pageVisit.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        database.lead.count({ where: { status: { in: ['CONTACTED', 'QUALIFIED'] } } }),
      ]);
      visits30d = results[0];
      connectedLeads = results[1];
    } catch (err) {
      console.warn('[ADMIN] Visit/lead count query failed (non-fatal):', err instanceof Error ? err.message : String(err));
    }

    res.json({
      success: true,
      data: {
        stats: {
          ...stats,
          visits30d,
          connectedLeads,
        },
        leads: leads ? leads.slice(0, 10) : [],
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
