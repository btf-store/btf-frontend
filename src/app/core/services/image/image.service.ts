import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Constants } from '../../constants/Constants';
import { UpdateImageProduct, UploadImageProduct } from '../../models/interface/Image';
import { Observable } from 'rxjs';
import { Response } from '../../models/generic/Response';
import { RequestParams } from '../../models/interface/request/RequestParams';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  url: String = Constants.LOCAL_URL.concat("/images")
  constructor(
    private apiService: ApiService
  ) { }

  uploadImageProduct(params: RequestParams, listImageFile: FormData): Observable<Response<null>> {
    return this.apiService.post(this.url.concat("/product"), listImageFile, {
      params: params,
      responseType: 'json'
    })
  }

  updateImageProduct(body: UpdateImageProduct[]): Observable<Response<null>> {
    return this.apiService.put(this.url.concat("/product"), body,  {
      responseType: 'json'
    })
  }

}
