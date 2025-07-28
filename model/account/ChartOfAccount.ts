export interface ChartOfAccount {
  id: number;
  code: string;
  accountName: string;
  accountNameNp: string;
  parentId?: number;
  branchId?: number;
  genderId: number;
  address: string;
  contact: string;
  isSystem: boolean;
  isGroup: boolean;
  isTranGl: boolean;
  isPublic: boolean;
  glType: string;
  glLevel: number;
  status: boolean;
  createdBy: number;
  createdOn?: Date;
  masterId?: number;
}
