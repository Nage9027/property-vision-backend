import * as plotService from '../services/plot.service.js';

function asString(value) {
  return Array.isArray(value) ? value[0] : value ?? '';
}

export async function listByProperty(req, res, next) {
  try {
    const data = await plotService.listPlotsByProperty(asString(req.params.propertyId));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function summary(req, res, next) {
  try {
    const data = await plotService.getPlotSummary(asString(req.params.propertyId));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await plotService.getPlotById(asString(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Plot not found.' });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = await plotService.createPlot(asString(req.params.propertyId), req.body);
    res.status(201).json({ success: true, data, message: 'Plot created successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function bulkCreate(req, res, next) {
  try {
    const data = await plotService.bulkCreatePlots(asString(req.params.propertyId), req.body.plots);
    res.status(201).json({ success: true, data, message: `${data.count} plots created successfully.` });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const data = await plotService.updatePlot(asString(req.params.id), req.body);
    if (!data) return res.status(404).json({ success: false, message: 'Plot not found.' });
    res.json({ success: true, data, message: 'Plot updated successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const data = await plotService.deletePlot(asString(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Plot not found.' });
    res.json({ success: true, data, message: 'Plot deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
