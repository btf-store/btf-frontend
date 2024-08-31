export interface Price {
  priceId?: number,
  priceType?: string,
  value: number,
  dateFrom?: string,
  status?: string
}

export interface PriceRequest {
  productId: number
  priceType: string,
  value: number,
  salePercent: number
}
