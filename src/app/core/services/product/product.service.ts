import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Constants } from '../../constants/Constants';
import { Options } from '../../models/interface/request/Options';
import { Response } from '../../models/generic/Response';
import { error } from '@ant-design/icons-angular';
import { Observable } from 'rxjs';
import { Product, ProductRequest } from '../../models/interface/Product';
import { RequestParams } from '../../models/interface/request/RequestParams';
import { HttpHeaders } from '@angular/common/http';

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

  createProduct(request: ProductRequest): Observable<Response<Product>> {
    return this.apiService.post(this.url, request, {
      responseType: 'json'
    })
  }

  updateProduct(request: ProductRequest): Observable<Response<Product>> {
    return this.apiService.put(this.url, request, {
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
}
