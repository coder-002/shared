export interface CashRepository {
  id: number;
  repoCode: string;
  repoName: string;
  description: string;
  branchId: number;
  isTranNode: boolean;
}
