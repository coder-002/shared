import { IEmployee } from "@/shared/model/employee/employee";
import { get } from "../ajaxService";

const getCollectors = async (activeOnly: boolean, allBranch?: boolean) => {
  let url = `/administration/employee-collector/${activeOnly}/false`;
  if (allBranch) url = `/administration/employee-collector/${activeOnly}/true`;

  const res = await get<IEmployee[]>(url);
  return res && res.data;
};

const getCollectorsById = async (activeOnly: boolean, branchId: number) => {
  let url = `/core/collectors/dd/${activeOnly}/false`;
  if (branchId) url = `/core/collectors/by-branch/${activeOnly}/${branchId}`;

  const res = await get<IEmployee[]>(url);
  return res && res.data;
};

export { getCollectors, getCollectorsById };
