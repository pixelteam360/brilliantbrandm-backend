export type TCommunityPost = {
  id?: string;
  message: string;
  images: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCommunityPosttFilterRequest = {
  searchTerm?: string | undefined;
};
