const path = require('path');
const fs = require('fs');
const db = require('../config/db');

const MAX_MEMBERS = 4;

const getGroups = async (req, res) => {
  const [groups] = await db.query('SELECT * FROM `groups`');
  const [allMembers] = await db.query('SELECT * FROM members');
  
  for (const g of groups) {
    g.members = allMembers.filter(m => m.group_id === g.id);
  }
  
  res.json({ success: true, groups });
};

const createGroup = async (req, res) => {
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
};

const getGroupById = async (req, res) => {
  const [[group]] = await db.query('SELECT * FROM `groups` WHERE id = ?', [req.params.id]);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });

  const [members] = await db.query('SELECT * FROM members WHERE group_id = ?', [req.params.id]);
  res.json({ success: true, group: { ...group, members } });
};

const deleteGroup = async (req, res) => {
  const [[group]] = await db.query('SELECT id FROM `groups` WHERE id = ?', [req.params.id]);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });

  const [members] = await db.query('SELECT photo FROM members WHERE group_id = ?', [req.params.id]);

  await db.query('DELETE FROM members WHERE group_id = ?', [req.params.id]);
  await db.query('DELETE FROM `groups` WHERE id = ?', [req.params.id]);

  for (const member of members) {
    if (member.photo) {
      const photoPath = path.join(__dirname, '..', 'uploads', path.basename(member.photo));
      fs.unlink(photoPath, () => {});
    }
  }

  res.json({ success: true, message: 'Group deleted.' });
};

const addMember = async (req, res) => {
  const cleanupUpload = () => {
    if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
  };

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

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // ── Group and Capacity Check ───────────────────────────────────────────────
    // Using FOR UPDATE to lock the group row to prevent race conditions
    const [[group]] = await connection.query('SELECT * FROM `groups` WHERE id = ? FOR UPDATE', [req.params.id]);
    if (!group) {
      await connection.rollback();
      cleanupUpload();
      return res.status(404).json({ success: false, message: 'Group not found.' });
    }

    const [[{ count }]] = await connection.query('SELECT COUNT(*) AS count FROM members WHERE group_id = ?', [req.params.id]);
    if (Number(count) >= MAX_MEMBERS) {
      await connection.rollback();
      cleanupUpload();
      return res.status(400).json({ success: false, message: 'This group is already full (4 members).' });
    }

    // ── Duplicate Check ────────────────────────────────────────────────────────
    const [[existingMember]] = await connection.query(
      `SELECT id, email, phone, first_name, last_name 
       FROM members 
       WHERE LOWER(email) = LOWER(?) 
          OR phone = ? 
          OR (LOWER(first_name) = LOWER(?) AND LOWER(last_name) = LOWER(?))`,
      [email.trim(), phone.trim(), firstName.trim(), lastName.trim()]
    );

    if (existingMember) {
      await connection.rollback();
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

    // ── Insertion ──────────────────────────────────────────────────────────────
    const photoPath = `/uploads/${req.file.filename}`;
    const [result] = await connection.query(
      `INSERT INTO members (group_id, first_name, last_name, email, phone, school, idea, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, firstName.trim(), lastName.trim(), email.trim().toLowerCase(),
      phone.trim(), school.trim(), idea.trim(), photoPath]
    );

    const newCount = Number(count) + 1;
    const isFull = newCount >= MAX_MEMBERS;

    await connection.query(
      'UPDATE `groups` SET status = ? WHERE id = ?',
      [isFull ? 'completed' : 'in progress', req.params.id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: isFull
        ? `Group "${group.name}" is now FULL!`
        : `Member ${newCount} of ${MAX_MEMBERS} added to "${group.name}".`,
      member: { id: result.insertId, firstName, lastName, email, phone, school, idea, photo: photoPath },
      group: { id: group.id, name: group.name, memberCount: newCount, full: isFull },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    cleanupUpload();
    throw error; // Will be caught by catchAsync
  } finally {
    if (connection) connection.release();
  }
};

const removeMember = async (req, res) => {
  const [[member]] = await db.query(
    'SELECT id, photo FROM members WHERE id = ? AND group_id = ?',
    [req.params.memberId, req.params.id]
  );
  if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });

  await db.query('DELETE FROM members WHERE id = ?', [req.params.memberId]);

  if (member.photo) {
    const photoPath = path.join(__dirname, '..', 'uploads', path.basename(member.photo));
    fs.unlink(photoPath, () => {});
  }

  res.json({ success: true, message: 'Member removed.' });
};

module.exports = {
  getGroups,
  createGroup,
  getGroupById,
  deleteGroup,
  addMember,
  removeMember
};
