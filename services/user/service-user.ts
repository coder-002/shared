import { get } from "@/shared/services/ajaxService";
import { api } from "../api-list/service-api";
import { useQuery } from "@tanstack/react-query";

export interface Meta {
  branchId: number;
  nickName: string;
  fullName: string;
  userId: number;
  userName: string;
  today: Date;
  todayBS: string;
  roleId: number;
  canEdit: boolean;
  clientId?: number; //new
  allowAdjustmentEntry: boolean;
  allowIntAdjustment: boolean;
  allowGuaranteeComplete: boolean;
  allowPreWithdrawal: boolean;
  allowPreDeposit: boolean;
  multiBranchAccess: boolean;
  loggedInHour?: string;
  loggedInMinutes?: string;
  loggedInSec?: string;
  tenant: string;
  isHeadOffice: boolean;
  roleName: string;
  monthStart: Date;
  monthEnd: Date;
  inProcess: boolean;
  allowMinBalWithdraw: boolean;
  allowVoucherApprove: boolean;
  allowVoucherReject: boolean;
  userFullName: string;
  contact: string;
  profilePicture: string;
  loginTime: string;
  locale?: string; //new
}

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

export { useGetMeta };
