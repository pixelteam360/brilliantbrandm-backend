import { MaritalStatus } from "@prisma/client";

export type TProfile = {
  id?: string;
  fullName: string;
  image?: string;
  maritalStatus: MaritalStatus;
  location: string;
  maritalVerifyCount: number;
  redFlag: number;
  yellowFlag: number;
  greenFlag: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string
};

export type TProfileFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  searchTerm?: string | undefined;
};
