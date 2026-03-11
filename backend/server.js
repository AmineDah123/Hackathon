require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Custom error handler for rate limits
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  });
};

// Global rate limiter - applies to all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: (req) => {
    const whitelist = process.env.RATE_LIMIT_WHITELIST ? process.env.RATE_LIMIT_WHITELIST.split(',') : [];
    return whitelist.includes(req.ip || '');
  },
});

// Strict limiter for creation operations (groups/members)
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Let's allow 15 attempts per hour for team creation
  skipSuccessfulRequests: false,
  message: 'Too many registration attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Apply global limiter to ALL routes
app.use(globalLimiter);

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

const MAX_MEMBERS = 4;


// GET /api/status - Uses globalLimiter automatically
app.get('/api/status', catchAsync(async (req, res) => {
  const [groups] = await db.query(`
    SELECT g.id, g.name, g.created_at, COUNT(m.id) AS member_count
    FROM \`groups\` g
    LEFT JOIN members m ON m.group_id = g.id
    GROUP BY g.id
  `);

  const totalGroups = groups.length;
  // We no longer have a maxGroups limit.
  // Registration is only closed if you want to manually toggle it later,
  // For now, we'll keep it open.
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
}));


// GET /api/groups - Uses globalLimiter automatically
app.get('/api/groups', catchAsync(async (req, res) => {
  const [groups] = await db.query('SELECT * FROM `groups`');
  const [allMembers] = await db.query('SELECT * FROM members');
  
  for (const g of groups) {
    g.members = allMembers.filter(m => m.group_id === g.id);
  }
  
  res.json({ success: true, groups });
}));

// POST /api/groups
app.post('/api/groups', strictLimiter, catchAsync(async (req, res) => {
  const { name } = req.body;
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Group name is required.' });
  }

  const [[existing]] = await db.query('SELECT id FROM `groups` WHERE LOWER(name) = LOWER(?)', [name.trim()]);
  if (existing) {
    return res.status(409).json({ success: false, message: 'Ce nom d\'équipe est déjà pris. Veuillez en choisir un autre.' });
  }

  const [result] = await db.query('INSERT INTO `groups` (name) VALUES (?)', [name.trim()]);
  res.status(201).json({
    success: true,
    message: 'Group created.',
    group: { id: result.insertId, name: name.trim(), members: [] },
  });
}));

// GET /api/groups/:id - Uses globalLimiter
app.get('/api/groups/:id', catchAsync(async (req, res) => {
  const [[group]] = await db.query('SELECT * FROM `groups` WHERE id = ?', [req.params.id]);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });

  const [members] = await db.query('SELECT * FROM members WHERE group_id = ?', [req.params.id]);
  res.json({ success: true, group: { ...group, members } });
}));

// DELETE /api/groups/:id - Uses globalLimiter
app.delete('/api/groups/:id', catchAsync(async (req, res) => {
  const [[group]] = await db.query('SELECT id FROM `groups` WHERE id = ?', [req.params.id]);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });

  const [members] = await db.query('SELECT photo FROM members WHERE group_id = ?', [req.params.id]);

  await db.query('DELETE FROM members WHERE group_id = ?', [req.params.id]);
  await db.query('DELETE FROM `groups` WHERE id = ?', [req.params.id]);

  for (const member of members) {
    if (member.photo) {
      const photoPath = path.join(__dirname, 'uploads', path.basename(member.photo));
      fs.unlink(photoPath, () => {});
    }
  }

  res.json({ success: true, message: 'Group deleted.' });
}));


// POST /api/groups/:id/members
app.post('/api/groups/:id/members', strictLimiter, upload.single('photo'), catchAsync(async (req, res) => {
  const cleanupUpload = () => {
    if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
  };

  const [[group]] = await db.query('SELECT * FROM `groups` WHERE id = ?', [req.params.id]);
  if (!group) {
    cleanupUpload();
    return res.status(404).json({ success: false, message: 'Group not found.' });
  }

  const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM members WHERE group_id = ?', [req.params.id]);
  if (Number(count) >= MAX_MEMBERS) {
    cleanupUpload();
    return res.status(400).json({ success: false, message: 'This group is already full (4 members).' });
  }

  const { firstName, lastName, email, phone, school, idea } = req.body;
  const missing = ['firstName', 'lastName', 'email', 'phone', 'school', 'idea']
    .filter(f => typeof req.body[f] !== 'string' || !req.body[f].trim());

  if (missing.length) {
    cleanupUpload();
    return res.status(400).json({ success: false, message: `Missing fields or invalid format: ${missing.join(', ')}` });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Profile photo is required.' });
  }

  // ── Duplicate Check ────────────────────────────────────────────────────────
  // Check if someone with the same email, phone, OR same first+last name already exists
  const [[existingMember]] = await db.query(
    `SELECT id, email, phone, first_name, last_name 
     FROM members 
     WHERE LOWER(email) = LOWER(?) 
        OR phone = ? 
        OR (LOWER(first_name) = LOWER(?) AND LOWER(last_name) = LOWER(?))`,
    [email.trim(), phone.trim(), firstName.trim(), lastName.trim()]
  );

  if (existingMember) {
    cleanupUpload();
    let reason = 'sont déjà inscrits';
    if (existingMember.email.toLowerCase() === email.trim().toLowerCase()) {
      reason = 'Cette adresse e-mail est déjà inscrite';
    } else if (existingMember.phone === phone.trim()) {
      reason = 'Ce numéro de téléphone est déjà utilisé';
    } else {
      reason = 'Une personne avec ce prénom et ce nom est déjà inscrite';
    }
    return res.status(409).json({ success: false, message: reason });
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
}));

// DELETE /api/groups/:id/members/:memberId
app.delete('/api/groups/:id/members/:memberId', catchAsync(async (req, res) => {
  const [[member]] = await db.query(
    'SELECT id, photo FROM members WHERE id = ? AND group_id = ?',
    [req.params.memberId, req.params.id]
  );
  if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });

  await db.query('DELETE FROM members WHERE id = ?', [req.params.memberId]);

  if (member.photo) {
    const photoPath = path.join(__dirname, 'uploads', path.basename(member.photo));
    fs.unlink(photoPath, () => {});
  }

  res.json({ success: true, message: 'Member removed.' });
}));

app.use((err, req, res, next) => {
  if (req.file && req.file.path) {
    fs.unlink(req.file.path, () => {});
  }
  if (err instanceof multer.MulterError || err.message === 'Only image files are allowed.') {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Hackathon API running on http://localhost:${PORT}`);
});