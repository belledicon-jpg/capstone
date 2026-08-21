const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'data.sqlite');
const needInit = !fs.existsSync(DB_PATH);
const db = new Database(DB_PATH);

if (needInit) {
  db.exec(`
    CREATE TABLE users (
      email TEXT PRIMARY KEY,
      name TEXT,
      passwordHash TEXT,
      verified INTEGER DEFAULT 0,
      avatar TEXT,
      active INTEGER DEFAULT 1,
      createdAt TEXT
    );

    CREATE TABLE otps (
      email TEXT PRIMARY KEY,
      code TEXT,
      expiresAt INTEGER
    );
  `);
}

module.exports = {
  getUser(email) {
    if (!email) return null;
    const row = db.prepare('SELECT email, name, passwordHash, verified, avatar, active, createdAt FROM users WHERE email = ?').get(email);
    return row || null;
  },
  createUser({ email, name, passwordHash }) {
    const createdAt = new Date().toISOString();
    db.prepare('INSERT INTO users (email, name, passwordHash, verified, avatar, active, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(email, name, passwordHash, 1, null, 1, createdAt);
    return this.getUser(email);
  },
  updateUser(email, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return this.getUser(email);
    const sets = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => fields[k]);
    values.push(email);
    db.prepare(`UPDATE users SET ${sets} WHERE email = ?`).run(values);
    return this.getUser(email);
  },
  deleteUser(email) {
    db.prepare('DELETE FROM users WHERE email = ?').run(email);
    db.prepare('DELETE FROM otps WHERE email = ?').run(email);
  },
  setOTP(email, code, expiresAt) {
    db.prepare('INSERT OR REPLACE INTO otps (email, code, expiresAt) VALUES (?, ?, ?)').run(email, code, expiresAt);
  },
  getOTP(email) {
    return db.prepare('SELECT email, code, expiresAt FROM otps WHERE email = ?').get(email) || null;
  },
  deleteOTP(email) {
    db.prepare('DELETE FROM otps WHERE email = ?').run(email);
  },
  changePassword(email, newHash) {
    db.prepare('UPDATE users SET passwordHash = ? WHERE email = ?').run(newHash, email);
    return this.getUser(email);
  },
  deactivateUser(email) {
    db.prepare('UPDATE users SET active = 0 WHERE email = ?').run(email);
    return this.getUser(email);
  }
};
