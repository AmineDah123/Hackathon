require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 }, // 100 KB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  },
});

const MAX_GROUPS = 16;
const MAX_MEMBERS = 4;


// GET /api/status
app.get('/api/status', async (req, res) => {
  const [groups] = await db.query(`
    SELECT g.id, g.name, g.created_at, COUNT(m.id) AS member_count
    FROM \`groups\` g
    LEFT JOIN members m ON m.group_id = g.id
    GROUP BY g.id
  `);

  const totalGroups = groups.length;
  const closed = totalGroups >= MAX_GROUPS && groups.every(g => Number(g.member_count) >= MAX_MEMBERS);

  res.json({
    totalGroups,
    maxGroups: MAX_GROUPS,
    maxMembers: MAX_MEMBERS,
    closed,
    groups: groups.map(g => ({
      id: g.id,
      name: g.name,
      memberCount: Number(g.member_count),
      full: Number(g.member_count) >= MAX_MEMBERS,
    })),
  });
});


// GET /api/groups
app.get('/api/groups', async (req, res) => {
  const [groups] = await db.query('SELECT * FROM `groups`');
  for (const g of groups) {
    const [members] = await db.query('SELECT * FROM members WHERE group_id = ?', [g.id]);
    g.members = members;
  }
  res.json({ success: true, groups });
});

// POST /api/groups
app.post('/api/groups', async (req, res) => {
  const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM `groups`');
  if (total >= MAX_GROUPS) {
    return res.status(400).json({ success: false, message: 'Registration is closed. Maximum groups reached.' });
  }

  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Group name is required.' });
  }

  const [[existing]] = await db.query('SELECT id FROM `groups` WHERE LOWER(name) = LOWER(?)', [name.trim()]);
  if (existing) {
    return res.status(409).json({ success: false, message: 'A group with this name already exists.' });
  }

  const [result] = await db.query('INSERT INTO `groups` (name) VALUES (?)', [name.trim()]);
  res.status(201).json({
    success: true,
    message: 'Group created.',
    group: { id: result.insertId, name: name.trim(), members: [] },
  });
});

// GET /api/groups/:id
app.get('/api/groups/:id', async (req, res) => {
  const [[group]] = await db.query('SELECT * FROM `groups` WHERE id = ?', [req.params.id]);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });

  const [members] = await db.query('SELECT * FROM members WHERE group_id = ?', [req.params.id]);
  res.json({ success: true, group: { ...group, members } });
});

// DELETE /api/groups/:id
app.delete('/api/groups/:id', async (req, res) => {
  const [[group]] = await db.query('SELECT id FROM `groups` WHERE id = ?', [req.params.id]);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });

  await db.query('DELETE FROM `groups` WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Group deleted.' });
});


// POST /api/groups/:id/members
app.post('/api/groups/:id/members', upload.single('photo'), async (req, res) => {
  const [[group]] = await db.query('SELECT * FROM `groups` WHERE id = ?', [req.params.id]);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });

  const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM members WHERE group_id = ?', [req.params.id]);
  if (Number(count) >= MAX_MEMBERS) {
    return res.status(400).json({ success: false, message: 'This group is already full (4 members).' });
  }

  const { firstName, lastName, email, phone, school, idea } = req.body;
  const missing = ['firstName', 'lastName', 'email', 'phone', 'school', 'idea']
    .filter(f => !req.body[f] || !req.body[f].trim());

  if (missing.length) {
    return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Profile photo is required.' });
  }

  const [[emailExists]] = await db.query('SELECT id FROM members WHERE LOWER(email) = LOWER(?)', [email.trim()]);
  if (emailExists) {
    return res.status(409).json({ success: false, message: 'This email is already registered.' });
  }

  const photoPath = `/uploads/${req.file.filename}`;
  const [result] = await db.query(
    `INSERT INTO members (group_id, first_name, last_name, email, phone, school, idea, photo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.params.id, firstName.trim(), lastName.trim(), email.trim().toLowerCase(),
    phone.trim(), school.trim(), idea.trim(), photoPath]
  );

  const newCount = Number(count) + 1;
  const isFull = newCount >= MAX_MEMBERS;

  res.status(201).json({
    success: true,
    message: isFull
      ? `🎉 Group "${group.name}" is now FULL!`
      : `Member ${newCount} of ${MAX_MEMBERS} added to "${group.name}".`,
    member: { id: result.insertId, firstName, lastName, email, phone, school, idea, photo: photoPath },
    group: { id: group.id, name: group.name, memberCount: newCount, full: isFull },
  });
});

// DELETE /api/groups/:id/members/:memberId
app.delete('/api/groups/:id/members/:memberId', async (req, res) => {
  const [[member]] = await db.query(
    'SELECT id FROM members WHERE id = ? AND group_id = ?',
    [req.params.memberId, req.params.id]
  );
  if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });

  await db.query('DELETE FROM members WHERE id = ?', [req.params.memberId]);
  res.json({ success: true, message: 'Member removed.' });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Only image files are allowed.') {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Hackathon API running on http://localhost:${PORT}`);
});