import { FlagType, MaritalStatus } from "@prisma/client";

export type TProfile = {
  id?: string;
  fullName: string;
  image?: string;
  maritalStatus: MaritalStatus;
  location: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  flagType: FlagType;
};

export type TProfileReport = {
  id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  profileId: string;
  reporterId: string;
};

export type TProfileFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  searchTerm?: string | undefined;
};
