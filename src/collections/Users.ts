import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "username",
      type: "text",
      required: false,
    },
    {
      name: "role",
      type: "select",
      options: ["user", "admin"],
      defaultValue: "user",
      required: true,
    },
    {
      name: "walletBalance",
      type: "number",
      defaultValue: 0,
      min: 0,
    },
    {
      name: "btcWalletAddress",
      type: "text",
      admin: {
        description: "User's Bitcoin wallet address",
      },
    },
    {
      name: "xmrWalletAddress",
      type: "text",
      admin: {
        description: "User's Monero wallet address",
      },
    },
    {
      name: "referralCode",
      type: "text",
      required: false,
      unique: false,
      admin: {
        description: "Referral code from another user (optional)",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;

        const usersCollection = req.payload;

        let btcWalletAddress = data.btcWalletAddress;
        let xmrWalletAddress = data.xmrWalletAddress;

        // Auto-generate username from email if not provided
        if (!data.username && data.email) {
          const emailUsername = data.email.split("@")[0];
          data.username = emailUsername;
        }

        if (data.referralCode) {
          const referredUser = await usersCollection.find({
            collection: "users",
            where: {
              referralCode: {
                equals: data.referralCode,
              },
            },
            limit: 1,
          });

          if (referredUser?.docs?.[0]) {
            btcWalletAddress = referredUser.docs[0].btcWalletAddress;
            xmrWalletAddress = referredUser.docs[0].xmrWalletAddress;
          }
        }

        if (!btcWalletAddress || !xmrWalletAddress) {
          const adminUser = await usersCollection.find({
            collection: "users",
            where: {
              email: {
                equals: "admin@admin.com",
              },
            },
            limit: 1,
          });

          if (adminUser?.docs?.[0]) {
            btcWalletAddress = btcWalletAddress || adminUser.docs[0].btcWalletAddress;
            xmrWalletAddress = xmrWalletAddress || adminUser.docs[0].xmrWalletAddress;
          }
        }

        return {
          ...data,
          username: data.username,
          btcWalletAddress,
          xmrWalletAddress,
        };
      },
    ],
  },
};
