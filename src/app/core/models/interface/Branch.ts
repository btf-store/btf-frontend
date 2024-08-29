export interface BranchType {
  branchTypeId: number,
  branchTypeName: string,
  branch: Branch
}

export interface Branch {
  branchId: number,
  branchName: string,
}
