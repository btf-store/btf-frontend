import { ProductLine } from "./Branch"
import { Image } from "./Image"
import { Price } from "./Price"

export interface Product {
  productId: number
  productName: string,
  color: string,
  category: string,
  salePercent?:number,
  productLine?: ProductLine,
  imageList: Image[],
  priceList: Price[]  | [],
  sizeList: string[],

}
