import { insertUserSchema, selectUserSchema } from "@/schemas/user.schema";
import type { NewUser, User } from "@/schemas/user.schema";

export const validateNewUser = (data: unknown): NewUser => {
  return insertUserSchema.parse(data);
};

export const validateUser = (data: unknown): User => {
  return selectUserSchema.parse(data) as User;
};


export const isValidNewUser = (data: unknown): data is NewUser => {
  return insertUserSchema.safeParse(data).success;
};

export const isValidUser = (data: unknown): data is User => {
  return selectUserSchema.safeParse(data).success;
};