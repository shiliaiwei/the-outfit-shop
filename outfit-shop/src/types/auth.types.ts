export type Role = "ADMIN" | "MANAGER" | "CASHIER" | "STAFF" | "PUBLIC";

export interface User {
  id: number;
  username: string;
  employee_name?: string;
  email: string;
  role: Role;
  avatar_url?: string;
  permissions?: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: Role;
  user?: User;
}
