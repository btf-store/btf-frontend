export interface Image {
  imageId: number,
  imageUrl: string,
  typeImage: string,
  status: string
}

export interface UploadImageProduct {
  productId: number,
  listImageFile: File[]
}

export interface UpdateImageProduct {
  imageId: number,
  status: string,
  typeImage: string
}
