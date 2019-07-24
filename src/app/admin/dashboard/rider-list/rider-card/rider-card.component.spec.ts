import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderCardComponent } from './rider-card.component';

describe('RiderCardComponent', () => {
  let component: RiderCardComponent;
  let fixture: ComponentFixture<RiderCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderCardComponent);
    fixture.componentInstance.rider = { name: 'Test User', picture: 'pic', route: 'name'};
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
