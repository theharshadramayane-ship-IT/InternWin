import Admin from '../models/Admin.js';
import { hashPassword } from './password.js';

const seedDefaultAdmin = async () => {
  const userId = process.env.ADMIN_USER_ID || 'admin@1111';
  const plainPassword = process.env.ADMIN_PASSWORD || 'password@001122';

  const existing = await Admin.findOne({ userId });
  if (existing) {
    return;
  }

  const password = await hashPassword(plainPassword);
  await Admin.create({
    userId,
    password,
    name: 'System Admin',
    role: 'admin'
  });

  console.log(`Default admin account ready (userId: ${userId}).`);
};

export default seedDefaultAdmin;
