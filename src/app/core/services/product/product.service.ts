import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Constants } from '../../constants/Constants';
import { Response } from '../../models/generic/Response';
import { Observable } from 'rxjs';
import { Product, ProductRequest } from '../../models/interface/Product';
import { PriceRequest } from '../../models/interface/Price';
import { RequestParams } from '../../models/generic/Request';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url:string = Constants.LOCAL_URL.concat("/products")
  constructor(
    private apiService: ApiService,
  ) { }

  getFilteredProduct(params?: RequestParams): Observable<Response<Product>> {
    return this.apiService.get(this.url, {
      params: params,
      responseType: 'json'
    })
  }

  getProductById(productId: string): Observable<Response<Product>> {
    return this.apiService.get(this.url.concat(`/${productId}`), {
      responseType: 'json'
    });
  }

  adminGetProductById(productId: string): Observable<Response<Product>> {
    return this.apiService.get(this.url.concat(`/byAdmin/${productId}`), {
      responseType: 'json'
    });
  }

  getRelateProducts(params: RequestParams): Observable<Response<Product>> {
    return this.apiService.get(this.url.concat(`/relate`), {
      params: params,
      responseType: 'json'
    });
  }

  searchProduct(keySearch: string): Observable<Response<Product>> {
    return this.apiService.get(this.url.concat(`/search`), {
      responseType: 'json'
    })
  }

  createProduct(requestBody: ProductRequest): Observable<Response<Product>> {
    return this.apiService.post(this.url, requestBody, {
      responseType: 'json'
    })
  }

  updateProduct(requestBody: ProductRequest): Observable<Response<Product>> {
    return this.apiService.put(this.url, requestBody, {
      responseType: 'json'
    })
  }

  activeProduct(params: RequestParams): Observable<Response<Product>> {
    return this.apiService.put(this.url.concat(`/activeProduct`), null, {
      params: params,
      responseType: 'json'
    })
  }

  inActiveProduct(params: RequestParams): Observable<Response<Product>> {
    return this.apiService.put(this.url.concat(`/inActiveProduct`), null, {
      params: params,
      responseType: 'json'
    })
  }

  createProductPrice(requestBody: PriceRequest): Observable<Response<Product>> {
    return this.apiService.post(this.url.concat("/createPrice"), requestBody, {
      responseType: 'json'
    })
  }
}
