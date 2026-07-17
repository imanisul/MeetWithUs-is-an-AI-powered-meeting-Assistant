import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import Organization from './src/models/Organization.model.js';

async function run() {
  await mongoose.connect('mongodb://localhost:27017/meetwithus-auth');
  
  const orgs = await Organization.find({});
  const validAdminIds = new Set();
  
  for (const org of orgs) {
    for (const member of org.members) {
      if (member.role === 'ORG_ADMIN') {
        validAdminIds.add(member.userId.toString());
      }
    }
    if (org.ownerId) {
      validAdminIds.add(org.ownerId.toString());
    }
  }

  const users = await User.find({ role: 'ORG_ADMIN' });
  console.log(`Found ${users.length} users with ORG_ADMIN role.`);
  
  let updatedCount = 0;
  for (const user of users) {
    if (!validAdminIds.has(user._id.toString())) {
      user.role = 'GUEST';
      await user.save();
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} users to GUEST.`);
  process.exit(0);
}

run().catch(console.error);
