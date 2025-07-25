export interface Product {
  id: number;
  productName: string;
  productNameNp: string;
  prefix: string;
  suffix: string;
  autoAc: boolean;
  acDigit: number;
  tranGlId: number;
  glName: string;
  dividendGlId: number;
  status: boolean;
  isCompulsory: boolean;
  branchId: any;
  charges: any[];
}
