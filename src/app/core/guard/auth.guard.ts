import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtService = inject(JwtService);
  const requiredRole = route.data['role'] as string;
  const userRole = jwtService.getRole()
  if(requiredRole == userRole){
    return true
  }else{
    router.navigateByUrl("")
    return false;
  }
};
