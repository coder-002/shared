export interface Attachment {
  id: number;
  tableName: string;
  tableId: number;
  fileName: string;
  originalFilename: string;
  description: string;
  createdBy: number;
  createdOn: Date;
  expired?: boolean;
}

export interface EAttachment {
  title: string;
  fileName: string;
  originalName: string;
}
