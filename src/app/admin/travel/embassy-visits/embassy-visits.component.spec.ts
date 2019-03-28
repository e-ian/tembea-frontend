import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbassyVisitsComponent } from './embassy-visits.component';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmbassyVisitsComponent', () => {
  let component: EmbassyVisitsComponent;
  let fixture: ComponentFixture<EmbassyVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbassyVisitsComponent ],
      imports: [ AppTestModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideTemplate(EmbassyVisitsComponent, `<div></div>`)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbassyVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Embassy Visits component', () => {
    expect(component).toBeDefined();
  });
});
