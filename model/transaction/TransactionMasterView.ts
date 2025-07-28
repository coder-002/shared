export interface TransactionMasterView {
  tranId: number;
  tranCode: string;
  refNumber: string;
  tranDate?: Date;
  tranDateNp: string;
  valueDate?: Date;
  valueDateNp: string;
  branchId?: number;
  bookId?: number;
  bookName: string;
  verificationId: number;
  verifiedBy?: number;
  verifier: string;
  verificationReason: string;
  collectorId?: number;
  collector: string;
  createdBy?: number;
  creator: string;
  createdOn?: Date;
  verifiedOn?: Date;
}
