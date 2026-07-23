const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

exports.getUser = async (username) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );
    return result[0];
  } catch (error) {
    console.error("Error:", error);
  } finally {
    connection.release();
  }
};

exports.createUser = async (username, password) => {
  const connection = await pool.getConnection();

  try {
    const result = await connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?);",
      [username, password]
    );
    return result;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    connection.release();
  }
};

exports.setSession = async (userId, token, expiration) => {
  const connection = await pool.getConnection();

  try {
    const result = await connection.query(
      "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?);",
      [userId, token, expiration]
    );
    return result;
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    connection.release();
  }
};

exports.getSession = async (userId) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      "SELECT * FROM sessions WHERE user_id = ?;",
      [userId]
    );
    return result;
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    connection.release();
  }
};

exports.getNotes = async (userId) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      "SELECT id, title, DATE_FORMAT(date, '%d/%m/%y') as date FROM notes WHERE user_id = ?;",
      [userId]
    );
    return result;
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    connection.release();
  }
};

exports.getNote = async (noteId) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      "SELECT id, title, DATE_FORMAT(date, '%d/%m/%y') as date, content FROM notes WHERE id = ?;",
      [noteId]
    );
    return result[0];
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    connection.release();
  }
};

exports.newNote = async (user_id, title, content) => {
  const date = new Date();

  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      "INSERT INTO notes (user_id, title, date, content) VALUES (?, ?, ?, ?);",
      [user_id, title, date, content]
    );
    return result;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    connection.release();
  }
};

exports.updateNote = async (noteId, title, content) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ?;",
      [title, content, noteId]
    );
    return result;
  } catch(error) {
    console.log("Error: ", error);
  } finally {
    connection.release();
  }
};
