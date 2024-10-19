import { Injectable } from '@angular/core';
import { Constants } from '../../constants/Constants';
import { ApiService } from '../generics/api.service';
import { Observable } from 'rxjs';
import { Size } from '../../models/interface/Size';
import { Response } from '../../models/generic/Response';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  url = Constants.LOCAL_URL.concat("/sizes");
  constructor(
    private apiService: ApiService
  ) { }

  getAllSize(): Observable<Response<Size>> {
    return this.apiService.get(this.url, {
      responseType: 'json'
    })
  }
}
