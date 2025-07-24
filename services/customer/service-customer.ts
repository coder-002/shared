import { SearchResult } from "@/shared/model/search/Search";
import { get, post } from "../ajaxService";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api-list/service-api";
import { PersonalProfileInit } from "@/shared/model/customer/PersonalProfileInit";

interface AutoCompleteResult {
  totalCount: number;
  results: SearchResult[];
}

export async function searchCustomer(
  query: string,
  activeOnly: boolean,
  limitBranchId?: number
) {
  if (!query) return;

  const res = await post<AutoCompleteResult>(`/member/search`, {
    query: query.trim(),
    activeOnly: activeOnly,
    limitBranchId: limitBranchId,
  });

  return res && res.data;
}

const getProfileInit = async () => {
  return await get<PersonalProfileInit>(api.customer.getPersonalProfile);
};

const useGetProfileInit = () => {
  return useQuery({
    queryKey: [api.customer.getPersonalProfile],
    queryFn: getProfileInit,
    select: (response) => response.data,
  });
};

export { useGetProfileInit };
