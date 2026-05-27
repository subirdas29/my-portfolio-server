export type TSettings = {
  ownerName?: string;
  ownerEmail?: string;
  ownerTitle?: string;
  ownerBio?: string;
  ownerAvatar?: string;
  githubUsername?: string;
  socialLinks?: { github?: string; linkedin?: string; twitter?: string; facebook?: string; instagram?: string; youtube?: string };
  businessConfig?: { currency?: string; timezone?: string };
};
