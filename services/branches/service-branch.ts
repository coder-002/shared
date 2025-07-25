import { get } from "@/shared/services/ajaxService";
import { IBranch } from "@/shared/model/branch/Branch";

export async function getBranches() {
  const res = await get<IBranch[]>("/branch/all/ui");
  return res && res.data;
}

export async function getCurrentBranch() {
  const res = await get<IBranch>("/branch/get");
  return res && res.data;
}

export async function getBranch(branchId: number) {
  const res = await get<IBranch>(`/core/branch/get/${branchId}`);
  return res && res.data;
}
