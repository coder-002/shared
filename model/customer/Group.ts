export interface Group {
  id: number;
  branchId: any;
  branchName: any;
  groupName: string;
  groupDescription: string;
  coordinatorMemberId: number;
  coordinator: string;
  appointmentDate: string;
  status: boolean;
  closureDate: any;
  address: string;
  centerId: number;
  centerName: string;
  defaultGroup: boolean;
  groupCode: string;
  meetingDay: number;
}
