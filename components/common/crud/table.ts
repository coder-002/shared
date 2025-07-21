export interface Column<T> {
  title: string | React.ReactNode;
  key: keyof T;
  dataIndex: [keyof T] | keyof T;
  render?: (
    text: any,
    record: T,
    index: number
  ) =>
    | React.ReactNode
    | {
        children?: React.ReactNode;
        props?: any;
      };

  onCell?: (record: T, rowIndex: number) => any;
  align?: "left" | "right" | "center";
  fixed?: "left" | "right";
  className?: string;
}
