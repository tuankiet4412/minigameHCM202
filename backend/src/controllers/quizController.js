import pool from '../config/db.js';

export const getRandomQuestions = async (req, res, next) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 10, 20);
    const result = await pool.query(
      `SELECT id, question, options, category, difficulty
       FROM quiz_questions ORDER BY RANDOM() LIMIT $1`,
      [count]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { answers, time_taken } = req.body;
    const questionIds = answers.map((a) => a.questionId);

    const result = await pool.query(
      'SELECT id, correct_answer FROM quiz_questions WHERE id = ANY($1)',
      [questionIds]
    );

    const correctMap = Object.fromEntries(
      result.rows.map((q) => [q.id, q.correct_answer])
    );

    let score = 0;
    answers.forEach((a) => {
      if (correctMap[a.questionId] === a.selectedAnswer) score++;
    });

    const insert = await pool.query(
      `INSERT INTO quiz_results (user_id, score, total_questions, time_taken, answers)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, score, answers.length, time_taken, JSON.stringify(answers)]
    );

    res.json({
      score,
      total: answers.length,
      percentage: Math.round((score / answers.length) * 100),
      result: insert.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const result = await pool.query(
      `SELECT u.username, u.display_name, qr.score, qr.total_questions,
              qr.time_taken, qr.created_at,
              ROUND((qr.score::decimal / qr.total_questions) * 100) as percentage
       FROM quiz_results qr
       JOIN users u ON qr.user_id = u.id
       ORDER BY percentage DESC, qr.time_taken ASC
       LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getUserQuizHistory = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT score, total_questions, time_taken, created_at,
              ROUND((score::decimal / total_questions) * 100) as percentage
       FROM quiz_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
