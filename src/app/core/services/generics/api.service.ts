import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Options } from '../../models/interface/request/Options';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  get<T>(url: string, options: Options): Observable<T> {
    return this.httpClient.get(url, options) as Observable<T>
  }

  post<T>(url: string, body: T, options: Options){
    return this.httpClient.post(url,body,  options) as Observable<T>
  }

  put<T>(url: string, body: T, options: Options){
    return this.httpClient.put(url, body, options) as Observable<T>
  }

  delete<T>(url: string, options: Options): Observable<T> {
    return this.httpClient.delete(url, options) as Observable<T>
  }
}
