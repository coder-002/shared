export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  canEdit: boolean;
  multiBranchAccess: boolean;
  allowAdjustmentEntry: boolean;
  allowIntAdjustment: boolean;
  allowGuaranteeComplete: boolean;
  allowPreWithdrawal: boolean;
  allowPreDeposit: boolean;
  allowMinBalWithdraw: boolean;
  allowVoucherApprove: boolean;
  allowVoucherReject: boolean;
}
