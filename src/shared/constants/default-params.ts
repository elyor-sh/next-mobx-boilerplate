import {z} from "zod";

export const defaultListParams = {
  _page: z
    .transform((val) => {
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    })
    .optional()
    .default(0),
  _limit: z
    .transform((val) => {
      const n = Number(val);
      return isNaN(n) ? 20 : n;
    })
    .optional()
    .default(20),
};