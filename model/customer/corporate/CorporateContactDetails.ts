export interface CoroperateContactDetails {
  id: number;
  corporateId: Number;
  committeeId?: number;
  contactPerson: string;
  designation: string;
  post: string;
  occupation?: string;
  citizenshipNo: string;
  issueDate?: string;
  issuePlace?: string;
  mobileNo?: string;
  tenure: string;
  estimateYearlyIncome: string;
  alsoMemberOn?: string;
  associationPost?: string;
  isAccountOperator?: boolean;
  provinceRepresentative?: boolean;
}
