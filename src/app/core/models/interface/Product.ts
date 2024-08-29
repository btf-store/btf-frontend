import { BranchType } from "./Branch"
import { Price } from "./Price"

export interface Product {
  productColorId: number
  productName: string,
  color: string,
  category: string,
  onSales?:boolean,
  branchType?: BranchType,
  imageList: string[],
  priceList: Price[]  | [],
  sizeList: string[],
  description: string
}
