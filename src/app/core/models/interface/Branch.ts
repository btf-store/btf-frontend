export interface ProductLine {
  productLineId: number,
  productLineName: string,
  description: string
  branch: Branch
}

export interface Branch {
  branchId: number,
  branchName: string,
}
