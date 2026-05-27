export type TCertification = {
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  badgeImage?: string;
  certificateFile?: string;
  order?: number;
};
