import pool from '../config/db.js';

export const getRandomQuestion = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, question, options, category, difficulty
       FROM quiz_questions ORDER BY RANDOM() LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No questions available' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const verifyAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedAnswer } = req.body;

    if (typeof questionId !== 'number' || typeof selectedAnswer !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const result = await pool.query(
      'SELECT correct_answer FROM quiz_questions WHERE id = $1',
      [questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const correct = result.rows[0].correct_answer === selectedAnswer;
    res.json({ correct });
  } catch (err) {
    next(err);
  }
};

export const createMatch = async (req, res, next) => {
  try {
    const { result, duration_seconds } = req.body;

    if (!['win', 'lose', 'draw'].includes(result)) {
      return res.status(400).json({ error: 'Invalid result' });
    }

    const duration = Number(duration_seconds);
    if (!Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({ error: 'Invalid duration' });
    }

    const insert = await pool.query(
      `INSERT INTO caro_matches (user_id, result, duration_seconds)
       VALUES ($1, $2, $3) RETURNING id, result, duration_seconds, created_at`,
      [req.user.id, result, Math.round(duration)]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getUserMatches = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const result = await pool.query(
      `SELECT result, duration_seconds, created_at
       FROM caro_matches WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2`,
      [req.user.id, limit]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const result = await pool.query(
      `SELECT u.username, u.display_name, cm.duration_seconds, cm.created_at
       FROM caro_matches cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.result = 'win'
       ORDER BY cm.duration_seconds ASC, cm.created_at ASC
       LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
