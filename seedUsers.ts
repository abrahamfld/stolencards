import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function seedUsers() {
  const payload = await getPayload({ config: configPromise });

  const seedUsersData = [
    {
      email: 'alice@example.com',
      username: 'alice',
      password: 'password123',
    },
    {
      email: 'bob@example.com',
      username: 'bob',
      password: 'password123',
    },
    {
      email: 'carol@example.com',
      username: 'carol',
      password: 'password123',
    },
    {
      email: 'dave@example.com',
      username: 'dave',
      password: 'password123',
    },
    {
      email: 'eve@example.com',
      username: 'eve',
      password: 'password123',
    },
  ];

  for (const userData of seedUsersData) {
    try {
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: userData.email } },
      });

      if (existing.totalDocs > 0) {
        console.log(`User ${userData.email} already exists.`);
        continue;
      }

      const created = await payload.create({
        collection: 'users',
        data: userData,
      });

      console.log(`✅ Created user: ${created.email}`);
    } catch (error) {
      console.error(`❌ Error creating ${userData.email}:`, error);
    }
  }

  console.log('✅ Seeding complete.');
}

seedUsers();
