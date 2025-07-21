import { CustomerKymView } from "./CustomerKymView";
import { CorporateProfile } from "./CorporateProfile";
import { GuaranteeView } from "../loan/GuaranteeView";
import { Attachment } from "../attachment/Attachment";

export interface Customer {
  id: number;
  introducedOn: Date;
  profileId: number;
  branchId: number;
  groupId: number;
  status: boolean;
  terminationDate?: Date;
  terminationReason: string;
  createdBy: number;
  createdOn: Date;
}

export interface CustomerInfo {
  id: number;
  introducedOn: Date;
  introducedOnNp: string;
  profileId: number;
  branchId: number;
  branch: string;
  groupId: number;
  groupName: string;
  customerType: string;
  customerName: string;
  permanentAddress: string;
  temporaryAddress: string;
  collectorId: number;
  contactNumber: string;
  email: string;
  genderId?: number;
  gender: string;
  dateOfBirth: Date;
  dateOfBirthNp: string;
  photoUrl: string;

  attachments: Attachment[];
  accounts: CustomerInfoAccount;
  guarantee: GuaranteeView[];
  selfGuarantee: GuaranteeView[];

  //property details was dynamic. changed to Corporate or KymDetail
  corporate: CorporateProfile;
  kymDetail: CustomerKymView;
}

export interface CustomerInfoAccount {
  deposit: CustomerInfoDepAccount[];
  share: CustomerInfoDepAccount[];
  loan: CustomerInfoLoanAccount[];
}

export interface CustomerAccountInfo {
  deposit: CustomerInfoDepAccount;
  share: CustomerInfoDepAccount;
  loan: CustomerInfoLoanAccount;
}

export interface CustomerInfoDepAccount {
  id: number;
  branch: string;
  creationDateNp: string;
  creationDate?: Date;
  product: string;
  accountNumber: string;
  collector: string;
  accountDuration?: string;
  interestNomineeAccountNumber?: string;
  accountNominee?: string;
  accountNomineeRel?: string;
  balance: number;
  intBal?: number;
  passbookVerified?: string;
  drawingPower: { f1: string; f2: string }[];
  instAmt?: number;
  verifiedDebit?: number;
  verifiedCredit?: number;
  unVerifiedDebit?: number;
  unVerifiedCredit?: number;
  acWhiteListShowBal?: boolean;
}

export interface CustomerInfoLoanAccount {
  id: number;
  branch: string;
  issuedOnNp: string;
  product: string;
  accountNumber: string;
  amount: number;
  duration: number;
  interestRate: number;
  balance: number;
  passbookVerified?: string;
  drawingPower: { f1: string; f2: string }[];
  acWhiteListShowBal?: boolean;
}
