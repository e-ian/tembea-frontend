enum Status {
  Approve,
  Decline,
}

export interface IRouteApprovalDeclineInfo {
  status: Status;
  routeRequestId: number;
  requesterFirstName: string;
}
