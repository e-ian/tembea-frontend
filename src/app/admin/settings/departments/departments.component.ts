import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentsService } from '../../__services__/departments.service';
import { IDepartmentsModel, IPageMeta } from 'src/app/shared/models/departments.model';

@Component({
  selector: 'view-department',
  templateUrl: './departments.component.html',
  styleUrls: [
    '../../routes/routes-inventory/routes-inventory.component.scss', 
    './departments.component.scss', 
    '../../../auth/login-redirect/login-redirect.component.scss'
  ],
})
export class DepartmentsComponent implements OnInit {

  departments: IDepartmentsModel[] = [];
  totalPages: number;
  pageNo: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  groupSize: number = 3;
  currentPageGroup: number = 0;
  isLoading: boolean = true;

  constructor(private departmentService: DepartmentsService) {}

  ngOnInit() {
    this.getDepartments();
  }

  getPages(): any {
    const pages = [];
    const groupedPages = [];

    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    while (pages.length) {
      groupedPages.push(pages.splice(0, this.groupSize));
    }
    return groupedPages;
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getDepartments();
  }

  nextGroup(): void {
    this.currentPageGroup += 1;
  }

  prevGroup(): void {
    this.currentPageGroup -= 1;
  }

  getRemainingItemsInDB = (pageMeta: IPageMeta) => {
    const numberOfPages = Math.ceil(pageMeta.totalResults / 10);
    if(numberOfPages < this.pageNo){
      return pageMeta.totalResults - (this.pageSize * this.pageNo);
    }
    return 10;
  }

  getDepartments = (): void => {
    this.isLoading = true;
    this.departmentService.getDepartments(this.pageSize, this.pageNo).subscribe(departmentData => {
      const { departments, pageMeta} = departmentData;
      const numberOfPages = Math.ceil(pageMeta.totalResults / 10);
      const remainingItems = this.getRemainingItemsInDB(pageMeta);
      this.departments = departments;
      this.totalPages = numberOfPages;
      this.pageSize = remainingItems > 10 && this.pageNo !== numberOfPages ? 10 : remainingItems;
      this.pages = this.getPages();
      if(this.isLoading === true){
        this.isLoading = false;
      }
    });
  };
}
