import { Price } from "./Price";
import { Size } from "./Size";

export interface CartItem {
  productId: string
  productName: string,
  imageUrl: string,
  color: string,
  priceList: Price[] | [],
  size: Size,
  quantity: number
}
