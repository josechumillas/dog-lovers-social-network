class UserRepository {
  constructor(db) {
    this.db = db;
  }

  create(username, email, password, language, latitude, longitude) {
    return this.db.run(
      'INSERT INTO users(username, email, password, language, latitude, longitude) VALUES(?, ?, ?, ?, ?, ?)',
      [username, email, password, language, latitude, longitude]
    );
  }

  update(userId, userData) {
    let sql = 'UPDATE users SET ';
    const params = [];

    Object.keys(userData).forEach((key) => {
      if (userData[key]) {
        if (params.length === 0) sql += `${key} = ?`;
        else sql += `, ${key} = ?`;
        params.push(userData[key]);
      }
    });
    sql += ` WHERE id = ${userId}`;
    if (params.length > 0) return this.db.run(sql, params);
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  findAll() {
    return this.db.all('SELECT * FROM users LIMIT 50');
  }

  findByUsername(username) {
    return this.db.get('SELECT * FROM users WHERE username = ?', [username]);
  }

  findByUsernameOrEmail(username, email) {
    return this.db.get('SELECT * FROM users WHERE username = ? OR email = ?', [
      username,
      email
    ]);
  }

  findById(id) {
    return this.db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  deleteById(id) {
    return this.db.run('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = UserRepository;
