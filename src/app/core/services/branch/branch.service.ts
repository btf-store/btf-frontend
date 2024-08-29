import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Response } from '../../models/generic/Response';
import { Branch } from '../../models/interface/Branch';
import { Observable } from 'rxjs';
import { Constants } from '../../constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  url = Constants.LOCAL_URL.concat("/branches");
  constructor(
    private apiService: ApiService
  ) { }

  getAllBranch(): Observable<Response<Branch>> {
    return this.apiService.get(this.url, {
      responseType: 'json'
    })
  }
}
