export interface AddReviewResponse {
  status: string;
  message: string;
  data: {
    _id: string;
    review: string;
    rating: number;
    product: string;
    user: {
      _id: string;
      name: string;
    };
    createdAt: string;
  };
}
