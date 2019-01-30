import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthService } from '../../auth/__services__/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss']
})
export class LogoutModalComponent implements OnInit {
  public firstName: string;

  constructor(
    public dialogRef: MatDialogRef<LogoutModalComponent>,
    private authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.firstName = this.authService.getCurrentUser().firstName;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logout() {
    this.authService.logout();
    this.dialogRef.close();
    this.router.navigate(['/']);
  }
}
