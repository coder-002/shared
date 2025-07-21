import { CoroperateContactDetails } from "./corporate/CorporateContactDetails";
import { CorporateAddresses } from "./corporate/CorporateAddresses";
import {
  CorporateMemberCount,
  FinancialInfos,
  OrgMemberShip,
} from "../frontdesk/CorporateProfileModel";
import { SocialMedia } from "../frontdesk/SocialMedia";

export interface CorporateProfileFullDetail {
  corporate: CorporateProfile;
  memberCount: CorporateMemberCount[];
  address: CorporateAddresses[];
  contactPersons: CoroperateContactDetails[];
  financialInfos: FinancialInfos[];
  organization: OrgMemberShip[];
  media: SocialMedia[];
  avatar: string;
  sign: string;
  registrationCertificate: string;
  regulation: string;
  pan: string;
  minute: string;
  lastAuditReport: string;
  other: string;
  creationDate?: Date;
}

export interface CorporateProfile {
  id?: number;
  customerId: number;
  orgTypeId: number;
  orgName: string;
  nickName: string;
  address: string;
  workingArea: string;
  contact: string;
  email: string;
  fax: string;
  url: string;
  contactPerson?: string;
  designation?: string;
  mobileNumber?: string;
  registrationNumber: string;
  registrationBody: string;
  registrationDate: Date;
  panType: string;
  panNumber: string;
  profileId?: number;
  groupId: number;
  districtId: number;
  mnVdc: string;
  wardNumber: string;
  collectorId?: number;
  type: string;
  registrationAddress: string;
  currentAddress: string;
  noOfBranch: number;
  branchRemarks: string;
  contactPersons?: CoroperateContactDetails[];
  lastAnnualMeetingHeldOn: Date;
  lastAnnualMeetingHeldCount: number;
}
