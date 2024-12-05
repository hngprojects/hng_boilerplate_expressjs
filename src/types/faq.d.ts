export type FAQResponse = {
  id: string;
  question: string;
  answer: string;
  category: string;
  created_at: Date;
  updated_at: Date;
};

export type FAQType = {
  question: string;
  answer: string;
  category: string;
  createdBy: string;
};
