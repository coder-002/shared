export interface CorporateMemberCount {
  id: number;
  corporateId: number;
  male: number;
  female: number;
  corporate: number;
  other: number;
}

export interface OrgMemberShip {
  id: number;
  corporateId: number;
  universalOrg: string;
  share?: boolean;
  deposit?: boolean;
  loan?: boolean;
  institutionType?: number;
}

export interface UniversalOrg {
  id: number;
  orgName: string;
}

export interface FinancialInfos {
  id: number;
  corporateId: number;
  tillDate?: Date;
  title: string;
  amount: number;
  type: "Assets" | "Expenses" | "Incomes" | "Liabilities";
}
