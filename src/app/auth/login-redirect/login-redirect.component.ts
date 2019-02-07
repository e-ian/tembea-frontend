import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../__services__/auth.service';
import { Toastr, TOASTR_TOKEN } from 'src/app/shared/toastr.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.scss']
})
export class LoginRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: Toastr
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams.token;
    this.authService.andelaAuthServiceToken = token;
    if (!token) {
      return this.authService.unAuthorizeUser();
    }
    this.authService.login()
    .subscribe(data => {
      const { data: response } = data;
      if (response.isAuthorized) {
        return this.authService.authorizeUser(response);
      }
    }, (err: any) => this.handleEventError(err))
  }

  handleEventError(err: any) {
    if (err instanceof HttpErrorResponse && err.status === 401 || err.status === 500 ) {
      return this.authService.unAuthorizeUser();
    }
    this.toastr.error('Something went wrong! try again');
    this.router.navigate(['/']);
  }
}
