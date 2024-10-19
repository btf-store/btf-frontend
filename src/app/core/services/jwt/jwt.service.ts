import { Injectable } from '@angular/core';
import { Constants } from '../../constants/Constants';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { CustomJwtPayload } from '../../models/interface/Auth';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  tokenName: string = Constants.USER_TOKEN

  constructor(
    private cookieService: CookieService,
  ) {
  }

  addToken(token: string) {
    const tokenExisted = this.cookieService.get(this.tokenName)
    if (tokenExisted) {
      this.cookieService.delete(this.tokenName)
    }
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30);
    this.cookieService.set(this.tokenName, token, { expires: expirationTime });
  }

  logout() {
    this.cookieService.delete(this.tokenName)
  }

  isAuthenticated(): boolean {
    return this.getToken() !== "";
  }

  isAuthorized(): boolean {
    return true;
  }

  getToken(): string {
    return this.cookieService.get(this.tokenName)
  }

  getClaims(): CustomJwtPayload | null {
    const tokent = this.getToken()
    if (tokent === "") {
      return null;
    }
    return jwtDecode<CustomJwtPayload>(tokent);
  }

  getRole(): string | undefined {
    const claims = this.getClaims()
    if(claims != null){
      console.log(claims.authorities[0].authority)
      return claims.authorities[0].authority
    }
    return undefined
  }
}
