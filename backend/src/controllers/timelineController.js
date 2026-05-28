import pool from '../config/db.js';

export const getTimelineEvents = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM timeline_events ORDER BY sort_order ASC, year ASC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getTimelineEvent = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM timeline_events WHERE id = $1', [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
