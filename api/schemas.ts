import { z } from 'zod';

// The agreed shape of the product list. Extra fields in the response are allowed;
// missing fields or wrong types are not.
export const productListSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      handle: z.string(),
    }),
  ),
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});