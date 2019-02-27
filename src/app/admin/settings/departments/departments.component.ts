import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentsService } from '../../__services__/departments.service';
import { IDepartmentsModel } from 'src/app/shared/models/departments.model';

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

  constructor(private departmentService: DepartmentsService) {
    this.pageNo = 1;
    this.pageSize = 10;
    this.isLoading = true;
  }

  ngOnInit() {
    this.getDepartments();
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getDepartments();
  }

  getDepartments = (): void => {
    this.isLoading = true;
    this.departmentService.getDepartments(this.pageSize, this.pageNo).subscribe(departmentData => {
      const { departments, pageMeta} = departmentData;
      this.departments = departments;
      this.totalItems = pageMeta.totalResults;
      if (this.isLoading) {
        this.isLoading = false;
      }
    });
  };
}
