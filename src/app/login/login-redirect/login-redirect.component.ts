import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
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
      return this.unAuthorizeUser();
    }
    this.authService.login()
    .subscribe(data => {
      const { data: response } = data;
      if (response.isAuthorized) {
        return this.authorizeUser(response);
      }
    }, (err: any) => this.handleEventError(err))
  }

  authorizeUser(response: any) {
    this.authService.isAuthorized = true;
    this.authService.isAuthenticated = true;
    this.authService.currentUser = response;
    this.toastr.success('Login Successful');
    return this.router.navigate(['/admin']);
  }

  unAuthorizeUser() {
    this.authService.isAuthorized = false;
    this.toastr.error('Unauthorized access');
    this.router.navigate(['/']);
  }

  handleEventError(err: any) {
    if (err instanceof HttpErrorResponse && err.status === 401 || err.status === 500 ) {
      return this.unAuthorizeUser();
    }
    this.authService.isAuthorized = false;
    this.toastr.error('Something went wrong! try again');
    this.router.navigate(['/']);
  }
}
