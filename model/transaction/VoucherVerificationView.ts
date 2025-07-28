export interface VoucherVerificationView {
  tranId?: number;
  tranCode: string;
  tranDate?: Date;
  tranDateNp: string;
  valueDate?: Date;
  valueDateNp: string;
  tranBranchId?: number;
  branchId?: number;
  branchName: string;
  bookId?: number;
  bookName: string;
  glId?: number;
  glAccount: string;
  repoId?: number;
  customerAccount: string;
  customerName: string;
  instrument: string;
  debit: number;
  credit: number;
  statementReference: string;
  verificationId?: number;
  verifiedBy?: number;
  createdBy?: number;
}
