export interface SpecialInstruction {
  id: number;
  depositId?: number;
  customerId?: number;
  loanId?: number;
  shareId?: number;
  valueDate: Date;
  message: string;
  messageType: string;
  createdBy?: number;
  createdOn?: Date;
  deleted?: false;
  accountName?: string;
  accountNumber?: string;
  creator?: string;
}

export interface SpecialInstructionView {
  id: number;
  depositId: any;
  shareId: any;
  loanId: any;
  accountNumber: string;
  customerName: string;
  valueDate: string;
  valueDateNp: string;
  message: string;
  messageType: string;
  creator: string;
  customerId: number;
  lastEditedBy: string;
}
