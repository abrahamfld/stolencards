// src/collections/PurchasedCards.ts
import type { CollectionConfig, CollectionAfterChangeHook } from "payload";

const removeMatchingCreditCard: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== "create") return;

  const cardNumber = doc.number;

  try {
    // Find the matching credit card by number
    const matching = await req.payload.find({
      collection: "credit-cards",
      where: {
        number: {
          equals: cardNumber,
        },
      },
    });

    if (matching.docs.length > 0) {
      const cardToDelete = matching.docs[0];

      // Delete it
      await req.payload.delete({
        collection: "credit-cards",
        id: cardToDelete.id,
      });

      console.log(`Deleted credit-card with number: ${cardNumber}`);
    }
  } catch (error) {
    console.error("Failed to delete credit-card after purchase:", error);
  }
};

export const PurchasedCards: CollectionConfig = {
  slug: "purchased-cards",
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
  hooks: {
    afterChange: [removeMatchingCreditCard],
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
    {
      name: "purchasedBy",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        description: "The user who purchased this card (selected by email)",
      },
    },
  ],
};
