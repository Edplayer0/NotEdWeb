const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "users",
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

exports.setSession = async (username, token, expiration) => {
  const connection = await pool.getConnection();

  try {
    const userId = (await connection.query("SELECT * FROM users WHERE username = ?;", [username]))[0][0].id;
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

exports.getSession = async (username) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(
      "SELECT s.id, s.token, s.expires_at FROM sessions as s JOIN users as u ON s.user_id = u.id WHERE u.username = ? ORDER BY s.id DESC;",
      [username]
    );
    return result;
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    connection.release();
  }
};
