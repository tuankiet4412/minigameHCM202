import pool from '../config/db.js';

export const getGalleryImages = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM gallery_images';
    const params = [];

    if (category) {
      params.push(category);
      query += ` WHERE category = $1`;
    }
    query += ' ORDER BY sort_order ASC, year ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
