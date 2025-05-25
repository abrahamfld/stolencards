import type { CollectionConfig } from "payload";

export const PasswordProtectedPages: CollectionConfig = {
  slug: "passwordProtectedPages",
  admin: {
    useAsTitle: "page",
    defaultColumns: ["page", "createdAt"],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "page", // e.g., "/special-registration"
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "password",
      type: "text",
      required: true,
      defaultValue: "Master@123456", // 👈 Default value
      admin: {
        description: "Password required to access this page",
      },
    },
  ],
};
