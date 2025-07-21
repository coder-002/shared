export interface TerminatedAccount {
  id: number;
  depositId: number;
  terminatedOn: Date;
  terminationFee: number;
  unterminatedOn?: Date;
  unterminatedReason: string;
  tranId?: number;
  lastEditedBy?: number;
  lastEditedOn?: Date;
  createdBy: number;
  createdOn?: Date;
}
