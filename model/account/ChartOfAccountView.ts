export interface ChartOfAccountView {
  id: number;
  code: string;
  accountName: string;
  accountNameNp: string;
  parentId?: number;
  parentCode: string;
  parent: string;
  branchId?: number;
  branch: string;
  isGroup: boolean;
  isTranGl: boolean;
  isSystem: boolean;
  isPublic?: boolean;
  glType: string;
  masterId?: number;
  masterAccount: string;
  status?: boolean;
  glLevel?: number;
  address: string;
  contact: string;
  genderId?: number;
  creator?: string;
}
