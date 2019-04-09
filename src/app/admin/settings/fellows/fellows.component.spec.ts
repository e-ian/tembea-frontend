import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FellowsComponent } from './fellows.component';
import { FellowsService } from '../../__services__/fellows.service';
import { FellowCardComponent } from './fellow-card/fellow-card.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { of } from 'rxjs';
import { fellowsMockResponse } from '../../__services__/__mocks__/fellows.mock';

describe('FellowsComponent', () => {
  let component: FellowsComponent;
  let fixture: ComponentFixture<FellowsComponent>;
  const mockFellowsService = {
    getFellows: jest.fn().mockReturnValue(of(fellowsMockResponse))
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FellowsComponent,
        FellowCardComponent,
        AppPaginationComponent,
        EmptyPageComponent
      ],
      providers: [{ provide: FellowsService, useValue: mockFellowsService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FellowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create fellows component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch fellows when component instantiates', () => {
    expect(mockFellowsService.getFellows).toHaveBeenCalled();
  });

  it('should get next page when pagination is clicked', () => {
    component.setPage(2);
    expect(mockFellowsService.getFellows).toHaveBeenCalledWith(9, 2);
  });
});
