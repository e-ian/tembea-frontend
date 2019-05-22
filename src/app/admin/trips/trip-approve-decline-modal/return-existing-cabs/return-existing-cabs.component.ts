import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ICabInventory } from 'src/app/shared/models/cab-inventory.model';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { CabsInventoryService } from 'src/app/admin/__services__/cabs-inventory.service';
import { NgForm } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material';

@Component({
  selector: 'app-return-existing-cabs',
  templateUrl: './return-existing-cabs.component.html',
  styleUrls: ['./return-existing-cabs.component.scss']
})
export class ReturnExistingCabsComponent implements OnInit  {
  public cols = 3;
  public rowHeight: any = '3:1';
  public colspan = 1;
  public disableOtherInput = false;
  public selectedCabOption = {driverName: '', driverPhoneNo: '', regNumber: ''}
  filteredOptions: Observable<object[]>;
  cabs: ICabInventory[] = [];
  watcher: Subscription;
  activeMediaQuery = '';
  sort: string;


@Input() approveForm;

@Input() optionValue: string;

@Output() emitAutoComplete = new EventEmitter();

@Output() clickedCabs = new EventEmitter();

@ViewChild('auto') auto: MatAutocomplete;

  constructor(
    public mediaObserver: MediaObserver,
    public cabService: CabsInventoryService,
  ) {
    this.sort = 'name,asc,batch,asc';
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if ( change.mqAlias === 'xs') {
         this.cols = 2;
         this.rowHeight = '5:1';
         this.colspan = 2;
      }
      if ( change.mqAlias === 'sm') {
        this.cols = 3;
        this.rowHeight = '3:1';
        this.colspan = 1;
     }
    });
  }

  ngOnInit() {
    this.getCabsInventory();
    this.emitAutoComplete.emit(this.auto);
  }

  startFiltering() {
    if (this.approveForm.controls) {
      this.filteredOptions = this.approveForm.valueChanges
      .pipe(
        startWith(''),
        map(this.keyWordFilter)
      );
    }
  }

  keyWordFilter = (value: any) => {
    if (value.cabDetails === '') {
      this.disableOtherInput = false;
        }

    if (value.cabDetails) {
      return this._filter(value.cabDetails)
        }
        if (value.cabRegNumber) {
          return this._filter(value.cabRegNumber)
            }
      return this.cabs;
    };

    _filter (value): object[] {
      const filterValue = value.toLowerCase();
      return this.cabs.filter(option => {
        if (option.model && option.model.toLowerCase().includes(filterValue)) {
            return true;
        }
             return false;
        });
    }

    getCabsInventory() {
      this.cabService.getCabs(1000, 1, this.sort, null)
      .subscribe(cabsData => {
        const {
          cabs
        } = cabsData;
      this.cabs = cabs;
      this.startFiltering();
    })
  }

  click (option) {
    this.clickedCabs.emit(option)
  }

  setOption (option) {
    return option[this.optionValue];
  }
}
