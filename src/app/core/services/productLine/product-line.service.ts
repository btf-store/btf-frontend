import { Injectable } from '@angular/core';
import { Constants } from '../../constants/Constants';
import { ApiService } from '../generics/api.service';
import { Observable } from 'rxjs';
import { ProductLine } from '../../models/interface/Branch';
import { Response } from '../../models/generic/Response';

@Injectable({
  providedIn: 'root'
})
export class ProductLineService {

  url = Constants.LOCAL_URL.concat("/product-line")
  constructor(
    private apiService: ApiService
  ) { }

  getAllProductLineByBranchId(branchId: number): Observable<Response<ProductLine>> {
    return this.apiService.get(this.url.concat(`/getByBranchId/${branchId}`), {
      responseType: 'json'
    })
  }

  getProductLineById(productLineId: number): Observable<Response<ProductLine>> {
    return this.apiService.get(this.url.concat(`/getById/${productLineId}`), {
      responseType: 'json'
    })
  }
}
