import { Injectable } from '@angular/core';
import { Constants } from '../../constants/Constants';
import { ApiService } from '../generics/api.service';
import { Observable } from 'rxjs';
import { Response } from '../../models/generic/Response';
import { BranchType } from '../../models/interface/Branch';
import { RequestParams } from '../../models/interface/request/RequestParams';

@Injectable({
  providedIn: 'root'
})
export class BranchTypeService {
  url = Constants.LOCAL_URL.concat("/branches-type")
  constructor(
    private apiService: ApiService
  ) { }

  getAllBranchTypeByBranchId(branchId: number): Observable<Response<BranchType>> {
    return this.apiService.get(this.url.concat(`/${branchId}`), {
      responseType: 'json'
    })
  }
}
