export interface User {
  id: number;
  roleId: number;
  roleName?: string;
  branchId: number;
  userName: string;
  password: string;
  fullName: string;
  email?: string;
  contact?: string;
  auditUserId?: number;
  auditTs: string;
  status?: boolean;
  counterId?: any;
}
