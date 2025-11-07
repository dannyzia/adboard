const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Generate a unique slug in the form:
 *   {slugified-title}-by-{slugified-username}
 * If that exact slug exists, append -2, -3, etc. (note: first duplicate gets -2).
 *
 * @param {import('mongoose').Model<any>} Model
 * @param {string} title
 * @param {string} username
 * @returns {Promise<string>} unique slug
 */
async function generateUniqueSlug(Model, title, username) {
  const base = slugify(`${title} by ${username}`);
  // Use an atomic SlugCounter to reserve sequential ordinals.
  // This avoids race conditions under high concurrency.
  const SlugCounter = require('../models/Slug.model');

  // Regex to match base and base-N where N is a number
  const matchRegex = new RegExp(`^${base}(?:-(\\d+))?$`);
  const searchRegex = new RegExp(`^${base}(?:-\\d+)?$`);

  // First, compute current max ordinal from existing Ad slugs (handles legacy ads)
  const matches = await Model.find({ slug: { $regex: searchRegex } }).select('slug').lean();
  const ordinals = (matches || []).map(m => {
    const s = m.slug || '';
    const mres = s.match(matchRegex);
    if (!mres) return 0;
    const num = mres[1] ? parseInt(mres[1], 10) : null;
    return num ? num : (s === base ? 1 : 0);
  }).filter(n => n > 0);
  const maxExisting = ordinals.length ? Math.max(...ordinals) : 0;

  // Try to ensure a SlugCounter row exists with seq = maxExisting (the highest allocated so far).
  // We'll then atomically increment seq and consume the next ordinal.
  // Atomically ensure a counter row exists with seq = maxExisting using upsert.
  // $setOnInsert guarantees we don't overwrite an existing seq.
  await SlugCounter.findOneAndUpdate(
    { base },
    { $setOnInsert: { seq: maxExisting } },
    { upsert: true }
  );

  // Atomically increment and obtain the next ordinal
  const updated = await SlugCounter.findOneAndUpdate(
    { base },
    { $inc: { seq: 1 } },
    { new: true }
  ).lean();

  const seq = (updated && updated.seq) ? updated.seq : (maxExisting + 1);
  if (seq === 1) return base;
  return `${base}-${seq}`;
}

module.exports = {
  slugify,
  generateUniqueSlug,
};
