// scripts/seed.ts
import payload from 'payload';
import config from "@payload-config";

(async () => {
  await payload.init({
    config,

  });

  await payload.create({
    collection: 'credit-cards',
    data: {
      type: 'VISA',
      number: '4111111111111111',
      expiry: '12/25',
      cvv: 123,
      balance: 1000,
      price: 9.99,
      country: 'USA',
      ownerName: 'Seeded User',
    },
  });

  console.log('Seeded!');
  process.exit(0);
})();
