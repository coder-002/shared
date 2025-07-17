import { useQuery } from "@tanstack/react-query";
import { get } from "@/shared/services/ajaxService";
import { api } from "@/shared/services/api-list/service-api";

export interface Branch {
  id: number;
  branchCode: string;
  fullName: string;
  nickName: string;
  registrationDate: string;
  registrationNumber: string;
  panNumber: string;
  branchAddress: string;
  city: string;
  state: string;
  street: string;
  country: string;
  contactNumber: string;
  fax: string;
  email: string;
  url: string;
  isHeadOffice: boolean;
  ibtGl: number;
}

const getCurrentBranch = async () => {
  return await get<Branch>(api.branch.currentBranch);
};

const useGetCurrentBranch = () => {
  return useQuery({
    queryKey: [api.branch.currentBranch],
    queryFn: getCurrentBranch,
    select: (response) => response?.data,
  });
};

const getAllBranches = async () => {
  return await get<Branch[]>(api.branch.allBranches);
};

const useGetAllBranches = () => {
  return useQuery({
    queryKey: [api.branch.allBranches],
    queryFn: getAllBranches,
    select: (response) => response.data,
  });
};

export { useGetCurrentBranch, useGetAllBranches };
