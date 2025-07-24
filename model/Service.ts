export interface Service {
  id: number;
  name: string;
}

export interface ServiceDetails {
  id: number;
  serviceName: string;
  issuedDate: Date;
  renewedOn: Date;
  accountId: number;
  accountName: string;
  expiryDate: Date;
  mobileNo: number;
  cardNo: number;
  remark: number;
  charge: number;
  isActive: boolean;
}
