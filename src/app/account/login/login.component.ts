import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isAuthenticated!: boolean;
  form!: FormGroup;
  loginInvalid!: boolean;
  formSubmitAttempt!: boolean;
  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  onSubmit() {
    this.accountService.login(this.form.value).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    }, error => console.log(error));
  }
}
