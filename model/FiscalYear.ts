export interface FiscalYear {
  id: number;
  fyCode: string;
  fyName: string;
  startsOn: Date;
  endsOn: Date;
  status: boolean;
  createdBy: number;
  createdOn?: Date;
  closed: boolean;
}
