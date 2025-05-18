import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      options: ['user', 'admin'],
      defaultValue: 'user',
      required: true,
    },
    {
      name: 'walletBalance',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'btcWalletAddress',
      type: 'text',
    },
    {
      name: 'xmrWalletAddress',
      type: 'text',
    },
    
  ],
};
