export interface CustomerView {
  id: number;
  introducedOn?: string;
  introducedOnNp: string;
  kymExpiryDateNp?: string;
  profileId?: number;
  branchId: number;
  branch: string;
  lastVerifiedOn?: string;
  groupId?: number;
  groupName: string;
  customerType: string;
  customerName: string;
  permanentAddress: string;
  temporaryAddress: string;
  contactNumber: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  genderId?: number;
  salutationId?: number;
  gender: string;
  citizenshipNumber?: string;
  dateOfBirth?: string;
  expiredKycList?: ExpiredKycList[];
}

export interface ExpiredKycList {
  customerId: number;
  kycId: number;
  customerName: string;
  lastVerifiedOn: string;
  expired: boolean;
  edited?: boolean;
}
