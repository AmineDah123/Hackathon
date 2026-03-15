const db = require('../config/db');
const MAX_MEMBERS = 4;

const getStatus = async (req, res) => {
  const [groups] = await db.query(`
    SELECT g.id, g.name, g.created_at, COUNT(m.id) AS member_count
    FROM \`groups\` g
    LEFT JOIN members m ON m.group_id = g.id
    GROUP BY g.id
  `);

  const totalGroups = groups.length;
  const closed = false;

  res.json({
    totalGroups,
    maxMembers: MAX_MEMBERS,
    closed,
    groups: groups.map(g => ({
      id: g.id,
      name: g.name,
      memberCount: Number(g.member_count),
      full: Number(g.member_count) >= MAX_MEMBERS,
    })),
  });
};

module.exports = { getStatus };
