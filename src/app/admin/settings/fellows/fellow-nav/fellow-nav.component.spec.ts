import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FellowNavComponent } from './fellow-nav.component';
import { FellowsComponent } from '../fellows.component';
import { ShortenNamePipe } from '../../../__pipes__/shorten-name.pipe';
import { AppTestModule } from '../../../../__tests__/testing.module';

describe('FellowNavComponent', () => {
  let component: FellowNavComponent;
  let fixture: ComponentFixture<FellowNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FellowNavComponent, ShortenNamePipe, FellowsComponent ],
      imports: [ HttpClientTestingModule, AppTestModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideTemplate(FellowNavComponent, `<div></div>`)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FellowNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
