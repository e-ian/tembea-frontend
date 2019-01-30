import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesInventoryComponent } from './routes-inventory.component';

describe('RoutesInventoryComponent', () => {
  let component: RoutesInventoryComponent;
  let fixture: ComponentFixture<RoutesInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
