import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthResponse, LoginRequest } from '../../../../core/models/interface/Auth';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { catchError, finalize, Observable } from 'rxjs';
import { Constants } from '../../../../core/constants/Constants';
import { Response } from '../../../../core/models/generic/Response';
import { JwtService } from '../../../../core/services/jwt/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormControlComponent,
    NzFormItemComponent,
    NzInputGroupComponent,
    NzGridModule,
    NzButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    NzFormLabelComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formLogin: FormGroup
  isValid: boolean
  authResponse: AuthResponse

  constructor(
    private formBuilder: FormBuilder,
    private nzMessageService: NzMessageService,
    private authSerivce: AuthService,
    private jwtService: JwtService,
    private router: Router
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [true]
    })
    this.isValid = true;
    this.authResponse = {
      accessToken: "",
      refreshToken: ""
    }
  }

  checkFieldValidation(fieldName: string): boolean {
    const control = this.formLogin.get(fieldName);
    return control ? control.invalid : false;
  }

  checkEmailValidation(): boolean {
    return this.checkFieldValidation("email") && !this.isValid
  }

  checkPassowrdValidation(): boolean {
    return this.checkFieldValidation("password") && !this.isValid
  }

  loginSubmit() {
    if (this.formLogin.valid) {
      let loginRequest: LoginRequest = {
        email: this.formLogin.get("email")?.value,
        password: this.formLogin.get("password")?.value
      }
      const id = this.nzMessageService.loading("Đang đăng nhập", { nzDuration: 0 }).messageId
      this.authSerivce.login(loginRequest).pipe(
        finalize(() => {
          this.nzMessageService.remove(id)
        }),
        catchError((errorResponse) => {
          if (errorResponse.error.statusCode === 401) {
            this.nzMessageService.error(Constants.WRONG_EMAIL_PASSWORD)

          } else {
            this.nzMessageService.error(errorResponse.error.message)
          }
          this.isValid = true
          this.formLogin.get("password")?.setValue("")
          return new Observable<Response<AuthResponse>>;
        })
      ).subscribe({
        next: (response: Response<AuthResponse>) => {
          this.authResponse = response.data as AuthResponse
          this.jwtService.addToken(this.authResponse.accessToken)
          this.nzMessageService.success(Constants.LOGIN_SUCCESS)
          this.router.navigateByUrl("")
        }
      })
    } else {
      this.isValid = false
    }
  }
}
