import { useQuery } from "@tanstack/react-query";
import { get } from "@/shared/services/ajaxService";
import { api } from "@/shared/services/api-list/service-api";
import { IBranch } from "@/shared/model/branch/Branch";

const getCurrentBranch = async () => {
  return await get<IBranch>(api.branch.currentBranch);
};

const useGetCurrentBranch = () => {
  return useQuery({
    queryKey: [api.branch.currentBranch],
    queryFn: getCurrentBranch,
    select: (response) => response.data,
  });
};

const getAllBranches = async () => {
  return await get<IBranch[]>(api.branch.allBranches);
};

const useGetAllBranches = () => {
  return useQuery({
    queryKey: [api.branch.allBranches],
    queryFn: getAllBranches,
    select: (response) => response.data,
  });
};

export { useGetCurrentBranch, useGetAllBranches };
