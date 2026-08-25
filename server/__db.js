const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data.sqlite');
const needInit = !fs.existsSync(DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('DB Error:', err);
});

// Helper to run queries with promises
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Initialize tables if DB is new
if (needInit) {
  db.serialize(() => {
    db.run(`
      CREATE TABLE users (
        email TEXT PRIMARY KEY,
        name TEXT,
        passwordHash TEXT,
        verified INTEGER DEFAULT 0,
        avatar TEXT,
        active INTEGER DEFAULT 1,
        createdAt TEXT
      )
    `);
    db.run(`
      CREATE TABLE otps (
        email TEXT PRIMARY KEY,
        code TEXT,
        expiresAt INTEGER
      )
    `);
    db.run(`
      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        email TEXT,
        expiresAt INTEGER,
        createdAt TEXT
      )
    `);
  });
}

module.exports = {
  async getUser(email) {
    if (!email) return null;
    return get('SELECT email, name, passwordHash, verified, avatar, active, createdAt FROM users WHERE email = ?', [email]);
  },

  async createUser({ email, name, passwordHash }) {
    const createdAt = new Date().toISOString();
    await run('INSERT INTO users (email, name, passwordHash, verified, avatar, active, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [email, name, passwordHash, 1, null, 1, createdAt]);
    return this.getUser(email);
  },

  async updateUser(email, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return this.getUser(email);
    const sets = keys.map(k => `${k} = ?`).join(', ');
    const values = [...keys.map(k => fields[k]), email];
    await run(`UPDATE users SET ${sets} WHERE email = ?`, values);
    return this.getUser(email);
  },

  async deleteUser(email) {
    await run('DELETE FROM users WHERE email = ?', [email]);
    await run('DELETE FROM otps WHERE email = ?', [email]);
    await run('DELETE FROM sessions WHERE email = ?', [email]);
  },

  async setOTP(email, code, expiresAt) {
    await run('INSERT OR REPLACE INTO otps (email, code, expiresAt) VALUES (?, ?, ?)', [email, code, expiresAt]);
  },

  async getOTP(email) {
    return get('SELECT email, code, expires_at as expiresAt FROM otps WHERE email = ?', [email]);
  },

  async deleteOTP(email) {
    await run('DELETE FROM otps WHERE email = ?', [email]);
  },

  async changePassword(email, newHash) {
    await run('UPDATE users SET passwordHash = ? WHERE email = ?', [newHash, email]);
    return this.getUser(email);
  },

  async deactivateUser(email) {
    await run('UPDATE users SET active = 0 WHERE email = ?', [email]);
    return this.getUser(email);
  },

  async createSession(id, email, expiresAt) {
    const createdAt = new Date().toISOString();
    await run('INSERT INTO sessions (id, email, expiresAt, createdAt) VALUES (?, ?, ?, ?)', [id, email, expiresAt, createdAt]);
  },

  async getSession(id) {
    if (!id) return null;
    const row = await get('SELECT id, email, expiresAt, createdAt FROM sessions WHERE id = ?', [id]);
    if (!row) return null;
    if (Date.now() > row.expiresAt) {
      await run('DELETE FROM sessions WHERE id = ?', [id]);
      return null;
    }
    return row;
  },

  async deleteSession(id) {
    await run('DELETE FROM sessions WHERE id = ?', [id]);
  }
};
