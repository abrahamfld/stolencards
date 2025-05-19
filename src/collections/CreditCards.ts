import { CollectionConfig } from "payload";

export const CreditCards: CollectionConfig = {
  slug: "credit-cards",
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: "type",
    group: "Card Marketplace",
  },
  fields: [
    {
      name: "type",
      type: "select",
      options: ["VISA", "MasterCard", "AMEX", "Discover"],
      required: true,
    },
    {
      name: "number",
      type: "text",
      label: "Card Number",
      required: true,
    },
    {
      name: "expiry",
      type: "text",
      label: "Expiry (MM/YY)",
      required: true,
    },
    {
      name: "cvv",
      type: "number",
      label: "CVV",
      required: true,
      min: 100,
      max: 999,
    },
    {
      name: "balance",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "country",
      type: "text",
      required: true,
    },
    {
      name: "ownerName",
      type: "text",
      label: "Cardholder Name",
      required: true,
    },
  ],
};
