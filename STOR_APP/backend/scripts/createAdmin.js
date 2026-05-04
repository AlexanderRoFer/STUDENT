require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function main() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/citas';
  await mongoose.connect(MONGO_URI);

  const username = process.env.ADMIN_USER || process.argv[2];
  const password = process.env.ADMIN_PASS || process.argv[3];
  if (!username || !password) {
    console.error('Usage: set ADMIN_USER and ADMIN_PASS env vars or pass username password as args');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  const doc = await Admin.findOneAndUpdate(
    { username },
    { $set: { passwordHash: hash, role: 'admin' } },
    { upsert: true, new: true }
  );
  console.log('Admin created/updated:', doc.username);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
