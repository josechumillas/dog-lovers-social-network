class FriendRepository {
  constructor(db) {
    this.db = db;
  }

  create(userId1, userId2, confirmed) {
    return this.db.run(
      'INSERT INTO friendships(user_id1, user_id2, confirmed) VALUES(?, ?, ?)',
      [userId1, userId2, confirmed]
    );
  }

  update(userId1, userId2, confirmed) {
    return this.db.run(
      'UPDATE friendships SET confirmed = ? WHERE user_id1 = ? AND user_id2 = ?',
      [confirmed, userId1, userId2]
    );
  }

  findAllByUserId(userId) {
    return this.db.all(
      'SELECT * FROM friendships INNER JOIN users ON users.id = friendships.user_id2 WHERE confirmed = 1 AND user_id1 = ?',
      [userId]
    );
  }

  getCountByUserId(userId) {
    return this.db.get(
      'SELECT COUNT(*) as count FROM friendships WHERE confirmed = 1 AND user_id1 = ?',
      [userId]
    );
  }
}

module.exports = FriendRepository;
