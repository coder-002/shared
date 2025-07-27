export interface BankAccount {
  id: number;
  bankName: string;
  bankNameNp: string;
  nickName: string;
  branchName: string;
  headOfficeAddress: any;
  headOfficeContact: any;
  branchOfficeContact: any;
  branchOfficeAddress: string;
  accountNumber: string;
  accountType: string;
  financialInstitutionTypeId: number;
  glId: number;
  financialInstitutionName: string;
  code?: string;
}
