import { get } from "@/shared/services/ajaxService";
import { useQuery } from "@tanstack/react-query";
import { Meta } from "@/shared/model/user/UserMeta";
import { User } from "@/shared/model/user/User";
import { Role } from "@/shared/model/user/UserRole";

const endpoint = "/user";

export async function getMeta(): Promise<Meta | null> {
  const res = await get<Meta>(`/user/meta`);
  return res && res.data;
}

export async function getUsers(): Promise<User[]> {
  const res = await get<User[]>(endpoint);
  return (res && res.data) || [];
}

export async function getUserRoles() {
  const res = await get<Role[]>("/role");
  return res && res.data;
}
