import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';
import { AlertService } from '../_services/alert.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hide = true;
  valueFirstName = '';
  valueLastname = '';
  valueLogin = '';

  registerForm: FormGroup;
  loading:boolean = false;
  submitted:boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private snackbar: MatSnackBar
  ) {
    if (this.authenticationService.currentUserValue) { 
      this.router.navigate(['/']);
  }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
                this.router.navigate(['/login']);
                this.showMessage("Регистрация успешна");
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
                this.showErrorMessage(error);
            });
    }, 1500);
  }

  private showErrorMessage(message: HttpErrorResponse) {
    this.snackbar.open(message.error.message, 'OK', { duration: 6000 });
    // console.log(message);
  }
  private showMessage(message: any) {
    this.snackbar.open(message, 'OK', { duration: 3000 });
    // console.log(message);
  }

}
