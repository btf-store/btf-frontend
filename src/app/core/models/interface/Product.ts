import { ProductLine } from "./Branch"
import { Category } from "./Category"
import { Image } from "./Image"
import { Price } from "./Price"

export interface Product {
  productId: number
  productName: string,
  color: string,
  category: Category,
  salePercent:number,
  productLine?: ProductLine,
  imageList: Image[],
  priceList: Price[]  | [],
  listSize: number[],
  status: string
}

export interface ProductRequest {
  productId: number,
  productName: string,
  productColor: string,
  categoryId: number,
  productLineId: number,
  listSize: number []
}

