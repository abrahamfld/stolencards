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
      defaultValue: "17qwZv2NxL9QU6YVr3Tgye8kk5NQ6GkVkU", // Default BTC address
      admin: {
        description: "User's Bitcoin wallet address",
      },
    },
    {
      name: "xmrWalletAddress",
      type: "text",
      defaultValue:
        "89bD8vcByqYGgTb83Z4UT2dTegWqL2VDQHP3qUuLVSqXabGJzdYdumb1bDXKgouCFD1aTnLUQt1uqFgdmbrqgSf9VkA65YW", // Default Monero address
      admin: {
        description: "User's Monero wallet address",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Only set default addresses on user creation
        if (operation === "create") {
          return {
            ...data,
            btcWalletAddress:
              data.btcWalletAddress || "17qwZv2NxL9QU6YVr3Tgye8kk5NQ6GkVkU",
            xmrWalletAddress:
              data.xmrWalletAddress ||
              "89bD8vcByqYGgTb83Z4UT2dTegWqL2VDQHP3qUuLVSqXabGJzdYdumb1bDXKgouCFD1aTnLUQt1uqFgdmbrqgSf9VkA65YW",
          };
        }
        return data;
      },
    ],
  },
};
