import pool from '../config/db.js';

export const getArticles = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT id, slug, title, summary, image_url, category, created_at FROM articles WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR summary ILIKE $${params.length})`;
    }
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    query += ' ORDER BY id ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getArticleBySlug = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM articles WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const existing = await pool.query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND article_id = $2',
      [req.user.id, articleId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM bookmarks WHERE id = $1', [existing.rows[0].id]);
      return res.json({ bookmarked: false });
    }

    await pool.query(
      'INSERT INTO bookmarks (user_id, article_id) VALUES ($1, $2)',
      [req.user.id, articleId]
    );
    res.json({ bookmarked: true });
  } catch (err) {
    next(err);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.slug, a.title, a.summary, a.image_url, b.created_at as bookmarked_at
       FROM bookmarks b JOIN articles a ON b.article_id = a.id
       WHERE b.user_id = $1 ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getBookmarkStatus = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT article_id FROM bookmarks WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows.map((r) => r.article_id));
  } catch (err) {
    next(err);
  }
};
