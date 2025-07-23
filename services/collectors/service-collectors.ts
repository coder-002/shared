import { IEmployee } from "@/shared/model/employee/employee";
import { get } from "../ajaxService";
import { api } from "../api-list/service-api";
import { useQuery } from "@tanstack/react-query";

const getCollectors = async (activeOnly: boolean, allBranch?: boolean) => {
  const textActiveOnly = activeOnly ? "true" : "false";
  const textAllBranch = allBranch ? "true" : "false";

  const url = api.collector.getAllBranchCollector
    .replace("{activeOnly}", textActiveOnly)
    .replace("{allBranch}", textAllBranch);
  return await get<IEmployee[]>(url);
};

const useGetCollectors = (activeOnly: boolean, allBranch?: boolean) => {
  return useQuery({
    queryKey: ["collectors", activeOnly, allBranch],
    queryFn: () => getCollectors(activeOnly, allBranch),
    staleTime: 5 * 60 * 1000,
    enabled: activeOnly !== undefined,
    select: (data) => data.data,
  });
};

const getCollectorsById = async (activeOnly: boolean, branchId: number) => {
  const textActiveOnly = activeOnly ? "true" : "false";
  const url = branchId
    ? api.collector.getCollectorByBranchId
        .replace("{activeOnly}", textActiveOnly)
        .replace("{branchId}", branchId.toString())
    : api.collector.getCollectorByStatus.replace(
        "{activeOnly}",
        textActiveOnly
      );

  return await get<IEmployee[]>(url);
};
