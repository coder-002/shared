export interface PersonalProfileInit {
  addressTypes: AddressType[];
  capitalizeKycName: boolean;
  childDepositProducts: ChildDepositProduct[];
  contactType: ContactType[];
  copomisRequiredFields: string[];
  districts: District[];
  ethnicGroups: EthnicGroup[];
  collectors: Collector[];
  familyTypes: FamilyType[];
  genders: Gender[];
  groups: any;
  idTypes: IdType[];
  localBodies: LocalBody[];
  maritalStatuses: MaritalStatuse[];
  occupations: Occupation[];
  onlyFullNameInKycRelation: boolean;
  personTypes: PersonType[];
  provinces: Province[];
  relations: Relation[];
  religions: Religion[];
  salutations: Salutation[];
  showType: boolean;
}

export interface AddressType {
  id: number;
  name: string;
  npName: string;
}

export interface ChildDepositProduct {
  id: number;
  branchId: any;
  isPublic: boolean;
  productName: string;
  productNameNp: string;
  prefix: string;
  suffix: any;
  autoAc: boolean;
  acDigit: number;
  random: boolean;
  isTerm: boolean;
  isRecurring: boolean;
  installments: any;
  lockInstallment: boolean;
  duration: number;
  lockDuration: boolean;
  minBal: number;
  withdrawalLimit: number;
  intRate: number;
  lockIntRate: boolean;
  ipfId: number;
  lockIpf: boolean;
  intCalcTypeId: number;
  tranGlId: number;
  intExpGlId: number;
  intPayableGlId: number;
  allowCheque: boolean;
  chequeMinBal: number;
  chequeCharge: number;
  allowPreWithdrawal: boolean;
  preWithdrawalCharge: number;
  preWithdrawalRate: number;
  postIntOnTermination: boolean;
  allowOd: boolean;
  odRate: any;
  lockOdRate: boolean;
  odLimit: any;
  lockOdLimit: boolean;
  odIpfId: any;
  lockOdIpf: boolean;
  allowStatement: boolean;
  statementFrequency: any;
  statementOverUseCharge: number;
  lockStatementOverUseCharge: boolean;
  dormant: boolean;
  dormancyDays: number;
  odGlId: number;
  taxRate: number;
  status: boolean;
  lockMinBal: boolean;
  installmentAmount: number;
  lockInstAmount: boolean;
  instFrequencyId: number;
  isLongTerm: boolean;
  lockInstFrequency: boolean;
  isCompulsory: boolean;
  isMfProduct: boolean;
  isChildSaving: boolean;
  taxGlId: number;
  isChunumunuSaving: boolean;
  isAgeDuration: boolean;
  fineGlId: number;
  compulsoryIntNominee: boolean;
  syncOnApp: boolean;
  year: number;
  month: number;
  day: number;
  lockAllowCheque: boolean;
  statementChargeGlId: any;
}

export interface ContactType {
  id: number;
  name: string;
}

export interface District {
  id: number;
  districtName: string;
  provinceId: number;
  provinceName: string;
  npName: string;
  copomisCode: string;
}

export interface EthnicGroup {
  id: number;
  ethnicName: string;
}

export interface Collector {
  id: number;
  employeeName: string;
  branchId: number;
  status: boolean;
}

export interface FamilyType {
  id: number;
  typeName: string;
}

export interface Gender {
  id: number;
  genderCode: string;
  genderName: string;
  genderNameNp: string;
  copomisCode: string;
}

export interface IdType {
  id: number;
  name: string;
  npName: string;
}

export interface LocalBody {
  id: number;
  districtId: number;
  districtName: string;
  municipalityName: string;
  municipalityType: string;
}

export interface MaritalStatuse {
  id: number;
  statusCode: string;
  maritalStatusName: string;
  maritalStatusNameNp: string;
}

export interface Occupation {
  id: number;
  occupationName: string;
  industryId?: number;
  industryName: any;
}

export interface PersonType {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  provinceName: string;
  npName: string;
}

export interface Relation {
  id: number;
  name: string;
  salutationId: any;
}

export interface Religion {
  id: number;
  religionName: string;
}

export interface Salutation {
  id: number;
  name: string;
  genderId?: number;
  npName: string;
}
