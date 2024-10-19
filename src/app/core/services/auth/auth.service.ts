import { Injectable } from '@angular/core';
import { ApiService } from '../generics/api.service';
import { Constants } from '../../constants/Constants';
import { AuthResponse, LoginRequest, RegisterAccountRequest } from '../../models/interface/Auth';
import { Response } from '../../models/generic/Response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = Constants.LOCAL_URL.concat("/auths");

  constructor(
    private apiService: ApiService
  ) { }

  login(requestBody: LoginRequest): Observable<Response<AuthResponse>> {
    return this.apiService.post(this.url.concat("/login"), requestBody, {
      responseType: 'json'
    })
  }

  adminLogin(requestBody: LoginRequest): Observable<Response<AuthResponse>> {
    return this.apiService.post(this.url.concat("/admin/login"), requestBody, {
      responseType: 'json'
    })
  }

  register(requestBody: RegisterAccountRequest): Observable<Response<AuthResponse>> {
    return this.apiService.post(this.url.concat("/register"), requestBody, {
      responseType: 'json'
    })
  }
}
