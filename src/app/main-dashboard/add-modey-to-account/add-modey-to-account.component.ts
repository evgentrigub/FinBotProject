import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../account/_services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../../account/_models/user';

@Component({
  selector: 'app-add-modey-to-account',
  templateUrl: './add-modey-to-account.component.html',
  styleUrls: ['./add-modey-to-account.component.css'],
})
export class AddModeyToAccountComponent implements OnInit {
  dataForm: FormGroup;
  editedStats: User;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AddModeyToAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.dataForm = new FormGroup({
      summa: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {}

  addMoney(summa: number) {
    const prev = this.data.account;
    this.data.account = summa;
    this.userService.updateAccount(this.data).subscribe();
    this.data.account = +prev + +summa;
    this.dialogRef.close();
  }
}
