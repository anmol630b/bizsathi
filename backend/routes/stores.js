const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const axios = require('axios');

// @route GET /api/stores/nearby
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50, category, city, search } = req.query;

    let query = { isPublished: true, isActive: true };
    let businesses;

    if (lat && lng) {
      // Geolocation based search
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000
        }
      };
      if (category && category !== 'all') query.category = category;
      if (search) query.name = { $regex: search, $options: 'i' };
      businesses = await Business.find(query).populate('owner', 'name').limit(50);

      // Add distance
      businesses = businesses.map(b => {
        const R = 6371;
        const dLat = (b.location.coordinates[1] - parseFloat(lat)) * Math.PI / 180;
        const dLon = (b.location.coordinates[0] - parseFloat(lng)) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(parseFloat(lat) * Math.PI / 180) * Math.cos(b.location.coordinates[1] * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return { ...b.toObject(), distance: Math.round(distance * 10) / 10 };
      });

    } else if (city) {
      // City based search
      query['address.city'] = { $regex: city, $options: 'i' };
      if (category && category !== 'all') query.category = category;
      if (search) query.name = { $regex: search, $options: 'i' };
      businesses = await Business.find(query).populate('owner', 'name').limit(50);
      businesses = businesses.map(b => ({ ...b.toObject(), distance: null }));
    } else {
      // Get all stores
      if (category && category !== 'all') query.category = category;
      if (search) query.name = { $regex: search, $options: 'i' };
      businesses = await Business.find(query).populate('owner', 'name').sort({ totalOrders: -1 }).limit(50);
      businesses = businesses.map(b => ({ ...b.toObject(), distance: null }));
    }

    res.json({ success: true, businesses, total: businesses.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/stores/cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await Business.distinct('address.city', { isPublished: true, isActive: true });
    const filtered = cities.filter(c => c && c.trim()).sort();
    res.json({ success: true, cities: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/stores/geocode
router.post('/geocode', async (req, res) => {
  try {
    const { address } = req.body;
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&country=India&format=json&limit=1`,
      { headers: { 'User-Agent': 'BizSathi/1.0' } }
    );
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      res.json({ success: true, lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      res.json({ success: false, message: 'Location not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
