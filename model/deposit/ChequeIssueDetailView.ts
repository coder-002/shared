export interface ChequeIssueDetailView {
  id?: number;
  depositId: number;
  branchId?: number;
  chequeNumber: number;
  blocked?: boolean;
  blockReason: string;
  unblocked?: boolean;
  unblockedBy?: number;
  tranId?: number;
  tranCode: string;
  amount?: number;
  statementReference: string;
}
