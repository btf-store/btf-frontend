import { ProductLine } from "./Branch"
import { Category } from "./Category"
import { Image } from "./Image"
import { Price } from "./Price"
import { Size } from "./Size"

export interface Product {
  productId: string
  productName: string,
  color: string,
  category: Category,
  salePercent: number,
  productLine?: ProductLine,
  imageList: Image[],
  priceList: Price[] | [],
  listSize: Size[],
  status: string
}

export interface ProductRequest {
  productId: string,
  productName: string,
  productColor: string,
  categoryId: number,
  productLineId: number,
  listSizeId: number[]
}

export interface ProductFilter {
  productName: string,
  productLineId: number,
  priceFrom: number,
  priceTo: number,
  categoryId: number,
  sortBy: 'salePercent' | 'price' | 'productName',
  isAscending: boolean
}

