const express = require('express');
const router = express.Router();
const locationService = require('../services/location.service');

/**
 * @route   GET /api/locations/countries
 * @desc    Get all countries
 * @access  Public
 */
router.get('/countries', (req, res) => {
  try {
    const countries = locationService.getCountries();
    res.json({
      success: true,
      data: countries,
      count: countries.length,
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching countries',
    });
  }
});

/**
 * @route   GET /api/locations/states/:country
 * @desc    Get states/provinces for a specific country
 * @access  Public
 */
router.get('/states/:country', (req, res) => {
  try {
    const { country } = req.params;
    const states = locationService.getStates(country);

    if (states.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Country not found or no states available',
      });
    }

    res.json({
      success: true,
      data: states,
      count: states.length,
      country,
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching states',
    });
  }
});

/**
 * @route   GET /api/locations/cities/:state
 * @desc    Get cities for a specific state/province
 * @access  Public
 */
router.get('/cities/:state', (req, res) => {
  try {
    const { state } = req.params;
    const cities = locationService.getCities(state);

    if (cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'State not found or no cities available',
      });
    }

    res.json({
      success: true,
      data: cities,
      count: cities.length,
      state,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cities',
    });
  }
});

/**
 * @route   GET /api/locations
 * @desc    Get all location data (countries, states, cities)
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const locations = locationService.getAllLocations();
    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching locations',
    });
  }
});

/**
 * @route   POST /api/locations/validate
 * @desc    Validate a location (country, state, city)
 * @access  Public
 * @body    { country: string, state: string, city: string }
 */
router.post('/validate', (req, res) => {
  try {
    const { country, state, city } = req.body;

    if (!country || !state || !city) {
      return res.status(400).json({
        success: false,
        message: 'Country, state, and city are required',
      });
    }

    const validation = locationService.validateLocation(country, state, city);

    res.json({
      success: validation.isValid,
      ...validation,
    });
  } catch (error) {
    console.error('Error validating location:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating location',
    });
  }
});

module.exports = router;