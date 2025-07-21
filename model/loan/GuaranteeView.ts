export interface GuaranteeView {
  id: number;
  valueDateNp: string;
  valueDate?: Date;
  loanId?: number;
  branchId?: number;
  loanAccount: string;
  customerName: string;
  address: string;
  contactNumber: string;
  amount?: number;
  description: string;
  depositId?: number;
  depositAccount: string;
  shareId?: number;
  shareAccount: string;
  isCompleted?: boolean;
  completedBy: string;
  completedOn: number;
  createdBy?: number;
  narration: string;
}
