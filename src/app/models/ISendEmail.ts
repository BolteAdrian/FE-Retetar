export interface ISendEmail {
  email: string;
  subject: string;
  message: string;
  attachment?: File; // Optional attachment property
}