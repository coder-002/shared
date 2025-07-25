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

export async function memberSearch(
  query: string,
  activeOnly: boolean,
  limitBranchId?: number
) {
  if (!query) return;

  const res = await post<any>(`/member/filter`, {
    pageNumber: 1,
    itemPerPage: 10,
    searchText: query.trim(),
    activeOnly: activeOnly,
    limitBranchId: limitBranchId,
  });

  return res && res.data;
}

export async function memberSearchByBranch(
  query: string,
  activeOnly: boolean,
  limitBranchId?: number
) {
  if (!query) return;

  const res = await post<any>(`/member/filter-branch`, {
    pageNumber: 1,
    itemPerPage: 10,
    searchText: query.trim(),
    activeOnly: activeOnly,
    limitBranchId: limitBranchId,
  });

  return res && res.data;
}

export async function searchCustomerShortDetail(
  query: string,
  activeOnly: boolean
) {
  if (!query) return;

  const res = await post<AutoCompleteResult>(`/member/short-detail-search`, {
    query: query.trim(),
    activeOnly: activeOnly,
  });

  return res && res.data;
}

export async function searchDeposit(
  query: string,
  activeOnly: boolean,
  allBranches: boolean,
  branchId: number,
  acStatementLimit: boolean,
  customerId: number,
  productId: number
) {
  if (!query) return;
  branchId = branchId || 0;
  console.log(customerId);

  const res = await post<AutoCompleteResult>(`/dep-acc/search/${branchId}`, {
    query: query,
    activeOnly: activeOnly,
    allBranches: allBranches,
    acStatementLimit: acStatementLimit,
    customerId: customerId,
    productId: productId,
  });
  return res && res.data;
}

export async function searchFdDeposit(
  query: string,
  activeOnly: boolean,
  allBranches: boolean,
  branchId: number,
  acStatementLimit: boolean,
  customerId: number,
  productId: number
) {
  if (!query) return;
  branchId = branchId || 0;

  const res = await post<AutoCompleteResult>(
    `/deposit/fd-account/search/${branchId}`,
    {
      query: query,
      activeOnly: activeOnly,
      allBranches: allBranches,
      acStatementLimit: acStatementLimit,
      customerId: customerId,
      productId: productId,
    }
  );
  return res && res.data;
}

export async function searchNonTermDeposit(
  query: string,
  activeOnly: boolean,
  allBranches: boolean,
  branchId: number,
  acStatementLimit: boolean,
  customerId: number,
  productId: number
) {
  if (!query) return;
  branchId = branchId || 0;

  const res = await post<AutoCompleteResult>(
    `/deposit/non-term-account/search/${branchId}`,
    {
      query: query,
      activeOnly: activeOnly,
      allBranches: allBranches,
      acStatementLimit: acStatementLimit,
      customerId: customerId,
      productId: productId,
    }
  );
  return res && res.data;
}

export async function searchLoan(
  query: string,
  activeOnly: boolean,
  allBranches: boolean,
  branchId: number,
  acStatementLimit: boolean,
  customerId: number,
  productId: number
) {
  if (!query) return;
  branchId = branchId || 0;

  const res = await post<AutoCompleteResult>(`/loan-acc/search/${branchId}`, {
    query: query,
    activeOnly: activeOnly,
    allBranches: allBranches,
    acStatementLimit: acStatementLimit,
    customerId: customerId,
    productId: productId,
  });
  return res && res.data;
}

export async function searchOdLoan(
  query: string,
  activeOnly: boolean,
  allBranches: boolean,
  branchId: number,
  acStatementLimit: boolean,
  customerId: number,
  productId: number
) {
  if (!query) return;
  branchId = branchId || 0;

  const res = await post<AutoCompleteResult>(`/loan-acc/search/${branchId}`, {
    query: query,
    activeOnly: activeOnly,
    allBranches: allBranches,
    acStatementLimit: acStatementLimit,
    customerId: customerId,
    productId: productId,
  });

  return res && res.data;
}

export async function searchShare(
  query: string,
  activeOnly: boolean,
  allBranches: boolean,
  branchId: number,
  acStatementLimit: boolean,
  customerId: number,
  productId: number
) {
  if (!query) return;
  branchId = branchId || 0;

  const res = await post<AutoCompleteResult>(
    `/share-account/search/${branchId}`,
    {
      query: query,
      activeOnly: activeOnly,
      allBranches: allBranches,
      acStatementLimit: acStatementLimit,
      customerId: customerId,
      productId: productId,
    }
  );
  return res && res.data;
}

export async function searchSupplier(query: string, activeOnly: boolean) {
  if (!query) return;

  const res = await post<AutoCompleteResult>(`/inventory/suppliers/search`, {
    searchText: query.trim(),
    activeOnly: activeOnly,
  });
  return res && res.data;
}
