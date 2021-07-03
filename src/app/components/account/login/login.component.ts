import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private returnUrl: string = '';

  public hide = true;
  public loading = false;
  public loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private snackbar: MatSnackBar
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
    this.loginForm = this.getLoginForm();
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        () => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
          this.showMessage('Вход успешно выполнен');
        },
        (error: HttpErrorResponse) => {
          this.showErrorMessage(error);
          this.loading = false;
        }
      );
  }

  public get canLogin() {
    return this.loginForm.valid;
  }

  public onForgetPassword(): void {
    this.showMessage('Функция пока не доступна');
  }

  /**
   * todo: add password length validators
   */
  private getLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  private showErrorMessage(httpError: HttpErrorResponse): void {
    if (httpError.error.array && httpError.error.array.length) {
      const arr = httpError.error.array as Array<any>;
      arr.forEach(el => {
        this.snackbar.open(el.msg, 'OK', { duration: 6000 });
      })
    } else {
      this.snackbar.open(httpError.error.msg, 'OK', { duration: 6000 });
    }
  }

  private showMessage(message: string): void {
    this.snackbar.open(message, 'OK', { duration: 3000 });
  }
}
