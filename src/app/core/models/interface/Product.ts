import { branchType } from "./Branch"
import { Price } from "./Price"

export interface Product {
  productColorId: number
  productName: string,
  color: string,
  category: string,
  brandName: string,
  branchType?: branchType,
  imageList: string[],
  priceList: Price[]  | [],
  sizeList: [],
  description: string
}
