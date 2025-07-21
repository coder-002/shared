import { SearchResult } from "@/shared/model/search/Search";
import { post } from "../ajaxService";

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
