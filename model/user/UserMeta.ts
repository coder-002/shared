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
