import { api, ApiEnvelope } from "@/lib/api/client";
import { User } from "@/types/auth.types";
import { z } from "zod";

const EmployeeSchema = z.object({
  id: z.number(),
  employee_name: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  position: z.string().optional(),
  avatar_url: z.string().optional(),
});

const EmployeeListResp = ApiEnvelope(z.array(EmployeeSchema));
const EmployeeResp = ApiEnvelope(EmployeeSchema);

export const staffService = {
  getEmployees: async (params?: any) => {
    const data = await api.get<any>("/employees", { params });
    return EmployeeListResp.parse(data);
  },

  getEmployee: async (id: number) => {
    const data = await api.get<any>(`/employees/${id}`);
    return EmployeeResp.parse(data).data;
  },

  createEmployee: async (employee: any) => {
    const data = await api.post<any>("/employees", employee);
    return EmployeeResp.parse(data).data;
  },

  updateEmployee: async (id: number, employee: any) => {
    const data = await api.patch<any>(`/employees/${id}`, employee);
    return EmployeeResp.parse(data).data;
  },

  deleteEmployee: async (id: number) => {
    return await api.delete(`/employees/${id}`);
  }
};
