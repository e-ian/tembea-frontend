import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentsService } from '../../__services__/departments.service';
import { AlertService } from 'src/app/shared/alert.service';
import { MatDialog } from '@angular/material';
import { IDeleteDepartmentResponse, IDepartmentsModel } from './../../../shared/models/departments.model';
import { AddDepartmentsModalComponent } from './add-departments-modal/add-departments-modal.component';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-view-department',
  templateUrl: './departments.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss',
    './departments.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ],
})
export class DepartmentsComponent implements OnInit {
  departments: IDepartmentsModel[] = [];
  totalItems: number;
  pageNo: number;
  pageSize: number;
  isLoading: boolean;
  displayText = 'No Departments Created';
  updateSubscription: any;

  constructor(
    private departmentService: DepartmentsService,
    public dialog: MatDialog,
    private alert: AlertService,
    private appEventService: AppEventService,
  ) {
    this.pageNo = 1;
    this.pageSize = ITEMS_PER_PAGE;
    this.isLoading = true;
  }

  ngOnInit() {
    this.getDepartments();
    this.updateSubscription = this.appEventService.subscribe('newDepartment', () => this.getDepartments());
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getDepartments();
  }

  getDepartments = (): void => {
    this.isLoading = true;
    this.departmentService.get(this.pageSize, this.pageNo).subscribe(departmentData => {
      const { departments, pageMeta } = departmentData;
      this.departments = departments;
      this.totalItems = pageMeta.totalResults;
      this.isLoading = false;
    },
      (error) => {
        if (error) {
          this.isLoading = false;
          this.displayText = `Ooops! We're having connection problems.`;
          return;
        }
      });
  }

  addDepartment() {
    this.dialog.open(AddDepartmentsModalComponent, {
      data: <IDepartmentsModel>{}
    })
  }

  deleteDepartment(departmentId: number, departmentName: string) {
    this.departmentService.delete(departmentId)
      .subscribe((response: IDeleteDepartmentResponse) => {
        const {
          success
        } = response;
        if (success) {
          this.alert.success(`${departmentName} was Successfully Deleted`);
          return this.getDepartments();
        }
      }, (error) => {
        if (error) {
          return this.alert.error(`😞Sorry! ${departmentName} could not be deleted`)
        }
      })
  }

  showDeleteModal(departmentId: number, departmentName: string): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '592px',
      backdropClass: 'modal-backdrop',
      panelClass: 'logout-modal-panel-class',
      data: {
        confirmText: 'Yes',
        displayText: 'delete this department'
      }
    });
    dialogRef.componentInstance.executeFunction.subscribe(() => {
      this.deleteDepartment(departmentId, departmentName);
    })
  }
}
