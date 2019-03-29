import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDepartmentsModel, Department } from 'src/app/shared/models/departments.model';
import { DepartmentsService } from 'src/app/admin/__services__/departments.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  templateUrl: './add-departments-modal.component.html',
  styleUrls: ['./add-departments-modal.component.scss']
})
export class AddDepartmentsModalComponent implements OnInit {
  model: IDepartmentsModel;
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddDepartmentsModalComponent>,
    public departmentService: DepartmentsService,
    public alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: IDepartmentsModel,
    private appEventService: AppEventService
  ) {
    this.model = new Department()
  }

  ngOnInit() {
    this.loading = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addDepartment(): void {
    this.loading = true;
    this.departmentService.addDepartment(this.model)
    .subscribe(
      (res) => {

        if (res.success) {
          this.alert.success(res.message);
          this.appEventService.broadcast({ name: 'newDepartment' });
          this.loading = false;
          this.dialogRef.close();
        }
      },
      (error) => {
        if (error && error.status  === 404 ) {
          const { error: { message }} = error
          this.alert.error(message)
        } else if (error && error.status  === 409 ) {
          const { error: { message }} = error
          this.alert.error(message)
        } else {
          this.alert.error('Something went wrong, please try again')
        }
        this.loading = false;
      }
    )
  };
}
