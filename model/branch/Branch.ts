export interface IBranch {
  id: number;
  branchCode: string;
  fullName: string;
  nickName: string;
  registrationDate: Date;
  registrationNumber: string;
  panNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  contactNumber: string;
  fax: string;
  email: string;
  url: string;
  isHeadOffice: boolean;
  ibtGl?: number;
  creator?: number;
  createdOn: Date;
}
