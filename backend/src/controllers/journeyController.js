import pool from '../config/db.js';

export const getJourneyLocations = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM journey_locations ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
