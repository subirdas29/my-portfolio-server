export type TMessage = {
  name: string;
  phone:string;
  email: string;
  subject:string;
  message: string;
  status: "Pending" | "Replied" | "No Response" | "Dealing" | "Booked" | "Closed";
  createAt: Date;
  updatedAt: Date;
};
