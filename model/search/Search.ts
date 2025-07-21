export interface SearchResult {
  value: string;
  title: string;
  description: string;
  custom1?: string;
  custom2?: any;
  custom3?: string;
  avatar?: string;
  profileId?: string;
  childProfileId?: any;
  firstName?: any;
  middleName?: any;
  lastName?: any;
  dateOfBirth?: any;
  salutationId?: any;
  custName?: string;
  customerName?: string;
}

export interface depositAccountSearchDetail extends accountSearchInfoModel {
  id: number;
  profileId: number;
  childCustomerId?: number | null;
  childName?: string | null;
  minBal: number;
  interestRate: number;
  isFd: boolean;
  isRecurring: boolean;
  drawingPowerForJournal: number;
  maturityDate?: Date | string | null;
  isDormant: boolean;
  stopDormantAc: boolean;
  allowCheckBook: boolean;
  isJointAc: boolean;
  showDormantPopUp: boolean;
  showStatement: boolean;
}

export interface accountSearchInfoModel {
  isMatured: boolean;
  isTerminated: boolean;
  kycPopup: boolean;
  maturityPopup: boolean;
  hideBalWhiteList: boolean;
  drawingPower: number;
  customerId: number;
  branchId: number;
  accountNumber: string;
  customerName: string;
  balance: number;
  profileId: number;
}

export interface UcDetail {
  accountNumber: string;
  customerName?: string;
  childName?: string;
  balance: number;
  branchId: number;
  customerId: number;
  drawingPower: number;
  interestRate?: number;
  minBal: number;
  profileId: number;
  allowOverdraft: boolean;
  isMatured?: boolean;
  terminatedOn?: Date;
  status?: boolean;
  isFd?: boolean;
  isRecurring?: boolean;
  odLoanDrawingPower?: number;
  drawingPowerForJournal: number;
  stopDormantAc?: boolean;
  isDormant?: boolean;
  hasPending?: boolean;
  allowCheckBook?: boolean;
  onlyAddOneDepositForFd?: boolean;
  isJointAc?: boolean;
  maturityDate?: Date;
  email?: string;
}
