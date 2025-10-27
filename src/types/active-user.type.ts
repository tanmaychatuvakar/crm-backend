export type ActiveUser = {
  id: string;
  email: string;
  is: (role: string) => boolean;
};
