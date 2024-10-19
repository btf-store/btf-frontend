import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { JwtService } from '../../../../core/services/jwt/jwt.service';
import { Router } from '@angular/router';
import { AuthResponse, RegisterAccountRequest } from '../../../../core/models/interface/Auth';
import { catchError, finalize, Observable } from 'rxjs';
import { Response } from '../../../../core/models/generic/Response';
import { Constants } from '../../../../core/constants/Constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formRegister: FormGroup
  isValid: boolean
  authResponse: AuthResponse

  constructor(
    private formBuilder: FormBuilder,
    private nzMessageService: NzMessageService,
    private authSerivce: AuthService,
    private jwtService: JwtService,
    private router: Router
  ) {
    this.formRegister = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      repassword: ['', Validators.required]
    })
    this.isValid = true;
    this.authResponse = {
      accessToken: "",
      refreshToken: ""
    }
  }

  checkFieldValidation(fieldName: string): boolean{
    const control = this.formRegister.get(fieldName);
    return control ? control.invalid : false;
  }

  checkFullNameValidation(): boolean{
    return this.checkFieldValidation("fullName") && !this.isValid
  }

  checkEmailValidation(): boolean{
    return this.checkFieldValidation("email") && !this.isValid
  }

  checkPassowrdValidation(): boolean{
    return this.checkFieldValidation("password") && !this.isValid
  }

  checkRepasswordValidation(): boolean{
    const password = this.formRegister.get("password")?.value
    if(password != ""){
      const repassword = this.formRegister.get("repassword")?.value
      return !(repassword === password)
    }
    return false;
  }

  onRegister(){
    if(this.formRegister.valid){
      let registerRequest: RegisterAccountRequest = {
        fullName: this.formRegister.get("fullName")?.value,
        email: this.formRegister.get("email")?.value,
        password: this.formRegister.get("password")?.value
      }
      const id = this.nzMessageService.loading("Đang đăng ký", { nzDuration: 0 }).messageId
      this.authSerivce.register(registerRequest).pipe(
        finalize(() => {
          this.nzMessageService.remove(id)
        }),
        catchError((errorResponse) => {
          if(errorResponse.error.statusCode === 400){
            if(errorResponse.error.message === "email is existed"){
              this.nzMessageService.error(Constants.EMAIL_EXISTED)
            }else{
              this.nzMessageService.error(errorResponse.error.message)
            }
          }else{
            this.nzMessageService.error(errorResponse.error.message)
          }
          this.isValid = true
          this.formRegister.get("password")?.setValue("")
          this.formRegister.get("repassword")?.setValue("")
          return new Observable<Response<AuthResponse>>;
        })
      ).subscribe({
        next: (response: Response<AuthResponse>) => {
          this.authResponse = response.data as AuthResponse
          this.jwtService.addToken(this.authResponse.accessToken)
          this.nzMessageService.success(Constants.REGISTER_SUCCESS)
          this.router.navigateByUrl("")
        }
      })
    }else{
      this.isValid = false
    }
  }
}
