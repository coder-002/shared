import { get } from "@/shared/services/ajaxService";
import { api } from "../api-list/service-api";
import { useQuery } from "@tanstack/react-query";
import { Meta } from "@/shared/model/user/UserMeta";
import { User } from "@/shared/model/user/User";
import { Role } from "@/shared/model/user/UserRole";

const getMeta = async () => {
  return await get<Meta>(api.user.meta);
};

const useGetMeta = () => {
  return useQuery({
    queryKey: [api.user.meta],
    queryFn: getMeta,
    select: (response) => response?.data,
  });
};

const getUsers = async () => {
  return await get<User[]>(api.user.users);
};

const useGetUsers = () => {
  return useQuery({
    queryKey: [api.user.users],
    queryFn: getUsers,
    select: (response) => response.data,
  });
};

const getUserRole = async () => {
  return await get<Role[]>(api.user.userRole);
};

const useGetUserRole = () => {
  return useQuery({
    queryKey: [api.user.userRole],
    queryFn: getUserRole,
    select: (response) => response.data,
  });
};

export { useGetMeta, useGetUserRole, useGetUsers };
