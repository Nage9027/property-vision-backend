import { database } from '../config/database.js';

/* ── Serializer ── */
function serializePlot(plot) {
  return {
    id: plot.id,
    propertyId: plot.propertyId,
    plotNumber: plot.plotNumber,
    facing: plot.facing,
    sizeSqYds: plot.sizeSqYds,
    roadWidth: plot.roadWidth,
    status: plot.status,
    pricePerSqYd: plot.pricePerSqYd == null ? null : plot.pricePerSqYd.toString(),
    isCorner: plot.isCorner,
    isCommercialFacing: plot.isCommercialFacing,
    isParkFacing: plot.isParkFacing,
    features: plot.features,
    createdAt: plot.createdAt,
    updatedAt: plot.updatedAt,
  };
}

/* ── Build update data ── */
function buildUpdateData(input) {
  const data = {};
  const fields = [
    'plotNumber', 'facing', 'sizeSqYds', 'roadWidth', 'status',
    'pricePerSqYd', 'isCorner', 'isCommercialFacing', 'isParkFacing', 'features',
  ];
  for (const field of fields) {
    if (input[field] !== undefined) {
      data[field] = input[field];
    }
  }
  return data;
}

/* ── List plots for a property ── */
export async function listPlotsByProperty(propertyId) {
  const property = await database.property.findFirst({
    where: { OR: [{ id: propertyId }, { slug: propertyId }] },
    select: { id: true },
  });
  if (!property) return [];
  const plots = await database.plot.findMany({
    where: { propertyId: property.id },
    orderBy: { plotNumber: 'asc' },
  });
  return plots.map(serializePlot);
}

/* ── Get single plot ── */
export async function getPlotById(id) {
  const plot = await database.plot.findUnique({ where: { id } });
  return plot ? serializePlot(plot) : null;
}

/* ── Create plot ── */
export async function createPlot(propertyId, input) {
  const exists = await database.plot.findFirst({
    where: { propertyId, plotNumber: input.plotNumber },
  });
  if (exists) {
    const error = new Error(`Plot number "${input.plotNumber}" already exists for this property.`);
    error.status = 409;
    throw error;
  }
  const plot = await database.plot.create({
    data: { propertyId, ...buildUpdateData(input) },
  });
  return serializePlot(plot);
}

/* ── Bulk create plots ── */
export async function bulkCreatePlots(propertyId, plotsInput) {
  const existing = await database.plot.findMany({
    where: { propertyId },
    select: { plotNumber: true },
  });
  const existingNumbers = new Set(existing.map((p) => p.plotNumber));
  const duplicates = plotsInput.filter((p) => existingNumbers.has(p.plotNumber));
  if (duplicates.length > 0) {
    const error = new Error(`Plot numbers already exist: ${duplicates.map((d) => d.plotNumber).join(', ')}`);
    error.status = 409;
    throw error;
  }
  const plots = await database.plot.createMany({
    data: plotsInput.map((p) => ({ propertyId, ...buildUpdateData(p) })),
  });
  return { count: plots.count };
}

/* ── Update plot ── */
export async function updatePlot(id, input) {
  const existing = await database.plot.findUnique({ where: { id } });
  if (!existing) return null;
  const plot = await database.plot.update({
    where: { id },
    data: buildUpdateData(input),
  });
  return serializePlot(plot);
}

/* ── Delete plot ── */
export async function deletePlot(id) {
  const existing = await database.plot.findUnique({ where: { id } });
  if (!existing) return null;
  await database.plot.delete({ where: { id } });
  return { id };
}

/* ── Plot summary stats for a property ── */
export async function getPlotSummary(propertyId) {
  const property = await database.property.findFirst({
    where: { OR: [{ id: propertyId }, { slug: propertyId }] },
    select: { id: true },
  });
  if (!property) {
    return {
      total: 0, available: 0, sold: 0, reserved: 0,
      facingDistribution: { EAST: 0, WEST: 0, NORTH: 0, SOUTH: 0 },
      cornerPlots: 0, commercialFacingPlots: 0, parkFacingPlots: 0,
      plotSizeRange: { min: 0, max: 0 }, lastUpdated: null,
    };
  }
  const plots = await database.plot.findMany({ where: { propertyId: property.id } });
  const total = plots.length;
  const available = plots.filter((p) => p.status === 'AVAILABLE').length;
  const sold = plots.filter((p) => p.status === 'SOLD').length;
  const reserved = plots.filter((p) => p.status === 'RESERVED').length;
  const facingCount = { EAST: 0, WEST: 0, NORTH: 0, SOUTH: 0 };
  for (const p of plots) {
    facingCount[p.facing] = (facingCount[p.facing] || 0) + 1;
  }
  const corner = plots.filter((p) => p.isCorner).length;
  const commercialFacing = plots.filter((p) => p.isCommercialFacing).length;
  const parkFacing = plots.filter((p) => p.isParkFacing).length;

  const sizeRanges = plots.map((p) => p.sizeSqYds);
  const minSize = sizeRanges.length ? Math.min(...sizeRanges) : 0;
  const maxSize = sizeRanges.length ? Math.max(...sizeRanges) : 0;

  return {
    total,
    available,
    sold,
    reserved,
    facingDistribution: facingCount,
    cornerPlots: corner,
    commercialFacingPlots: commercialFacing,
    parkFacingPlots: parkFacing,
    plotSizeRange: { min: minSize, max: maxSize },
    lastUpdated: plots.length ? plots.reduce((latest, p) => p.updatedAt > latest ? p.updatedAt : latest, plots[0].updatedAt) : null,
  };
}
