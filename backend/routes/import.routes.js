const express = require('express');
const router = express.Router();
const { getCategoryValues } = require('../config/categories.config');
const { generateUniqueSlug } = require('../utils/slug.util');
const Ad = require('../models/Ad.model');
const User = require('../models/User.model');

/**
 * Validates the provided API key against the LISTYNEST_API_KEY env variable.
 */
function validateApiKey(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token || token !== process.env.LISTYNEST_API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing API key',
    });
  }

  return next();
}

/**
 * Utility that normalizes an incoming ad payload and performs basic validation.
 */
function normalizeIncomingAd(adPayload = {}) {
  const errors = [];

  if (!adPayload.title) errors.push('title is required');
  if (!adPayload.description) errors.push('description is required');
  if (!adPayload.category) errors.push('category is required');

  const location = adPayload.location || {};
  if (!location.country) errors.push('location.country is required');
  if (!location.state) errors.push('location.state is required');
  if (!location.city) errors.push('location.city is required');

  const images = Array.isArray(adPayload.images) ? adPayload.images : [];
  if (!images.length) errors.push('at least one image URL is required');

  return {
    errors,
    normalized: {
      title: adPayload.title,
      description: adPayload.description,
      category: adPayload.category,
      price: adPayload.price,
      currency: adPayload.currency || 'USD',
      priceType: adPayload.priceType || 'Fixed',
      brandModel: adPayload.brandModel,
      condition: adPayload.condition,
      location: {
        country: location.country,
        state: location.state,
        city: location.city,
      },
      contact: {
        phone: adPayload.contact_info?.phone || '',
        email: adPayload.contact_info?.email || '',
      },
      images,
      source: adPayload.source || '',
      sourceUrl: adPayload.source_url || '',
      postedDate: adPayload.posted_date || null,
    },
  };
}

/**
 * Creates an import response skeleton.
 */
function createImportResult() {
  return {
    success: true,
    imported_count: 0,
    duplicates: 0,
    errors: [],
    import_id: `imp_${Date.now()}`,
    message: 'Import processed',
  };
}

router.post('/import', validateApiKey, async (req, res) => {
  const result = createImportResult();

  try {
    const { ads = [], import_options = {} } = req.body || {};
    const autoApprove = Boolean(import_options.auto_approve);
    const duplicateCheck = import_options.duplicate_check !== false;

    if (!Array.isArray(ads) || !ads.length) {
      return res.status(400).json({
        success: false,
        message: 'Request body must include a non-empty "ads" array',
      });
    }

    const importUserId = process.env.LISTYNEST_IMPORT_USER_ID;
    if (!importUserId) {
      return res.status(500).json({
        success: false,
        message: 'LISTYNEST_IMPORT_USER_ID environment variable is not configured',
      });
    }

    const importUser = await User.findById(importUserId);
    if (!importUser) {
      return res.status(500).json({
        success: false,
        message: 'Import user not found for LISTYNEST_IMPORT_USER_ID',
      });
    }

    const allowedCategories = new Set(getCategoryValues());

    for (let index = 0; index < ads.length; index += 1) {
      const rawAd = ads[index];
      const { errors, normalized } = normalizeIncomingAd(rawAd);

      if (errors.length) {
        result.errors.push({
          index,
          title: rawAd?.title || '',
          reason: errors.join(', '),
        });
        continue;
      }

      if (!allowedCategories.has(normalized.category)) {
        result.errors.push({
          index,
          title: normalized.title,
          reason: `category "${normalized.category}" is not supported`,
        });
        continue;
      }

      try {
        // Duplicate detection based on source URL (preferred) or title + city/state/country
        if (duplicateCheck) {
          let duplicateFilter = null;

          if (normalized.sourceUrl) {
            duplicateFilter = { 'details.sourceUrl': normalized.sourceUrl };
          } else {
            duplicateFilter = {
              title: normalized.title,
              'location.city': normalized.location.city,
              'location.state': normalized.location.state,
              'location.country': normalized.location.country,
            };
          }

          if (duplicateFilter) {
            const existing = await Ad.findOne(duplicateFilter).lean();
            if (existing) {
              result.duplicates += 1;
              continue;
            }
          }
        }

        const expiresAt = (() => {
          const baseDate = normalized.postedDate ? new Date(normalized.postedDate) : new Date();
          if (Number.isNaN(baseDate.getTime())) {
            baseDate.setTime(Date.now());
          }
          const expiry = new Date(baseDate);
          expiry.setDate(expiry.getDate() + 30);
          return expiry;
        })();

        const slug = await generateUniqueSlug(
          Ad,
          normalized.title,
          importUser.name || 'system'
        );

        const adDoc = new Ad({
          title: normalized.title,
          description: normalized.description,
          category: normalized.category,
          price: normalized.price,
          currency: normalized.currency,
          contactEmail: normalized.contact.email,
          contactPhone: normalized.contact.phone,
          location: normalized.location,
          user: importUser._id,
          status: autoApprove ? 'active' : 'pending',
          expiresAt,
          slug,
          images: normalized.images.map((url, order) => ({
            url,
            order,
          })),
          links: {
            link1: normalized.sourceUrl,
            link2: normalized.source,
          },
          details: {
            brandModel: normalized.brandModel,
            condition: normalized.condition,
            source: normalized.source,
            sourceUrl: normalized.sourceUrl,
            postedDate: normalized.postedDate,
            importedVia: 'ListyNest API',
          },
        });

        await adDoc.save();
        result.imported_count += 1;
      } catch (err) {
        result.errors.push({
          index,
          title: normalized.title,
          reason: err.message || 'Failed to import ad',
        });
      }
    }

    result.message = `Successfully imported ${result.imported_count} ads`;
    return res.status(201).json(result);
  } catch (err) {
    console.error('ListyNest import error:', err);
    return res.status(500).json({
      success: false,
      message: 'Unexpected error while processing import',
    });
  }
});

module.exports = router;

