import { z } from "zod";

import { http } from "@/shared/http";

export const usersSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.email(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({
      lat: z.string(),
      lng: z.string(),
    }),
  }),
  phone: z.string(),
  website: z.string(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

export type Users = z.infer<typeof usersSchema>;

export async function getUsers({ signal }: { signal?: AbortSignal }) {
  const { data } = await http.get<Users[]>("/users", { signal });
  return usersSchema.array().parse(data);
}
