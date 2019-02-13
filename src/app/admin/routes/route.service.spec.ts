import { RouteService } from './route.service';
import { httpMock } from './__mocks__/create-route';
import { environment } from '../../../environments/environment';

describe('CreateRouteComponent', () => {
  let component: RouteService;

  const mockData = {
    someProp: 'someValue'
  }

  beforeEach(() => {
    component = new RouteService(httpMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call post method', () => {
    const toPromise = { toPromise:  () => {} }
    const postMethod = jest.spyOn(component.http, 'post').mockReturnValue(toPromise);
    component.createRoute(mockData)
    expect(postMethod).toBeCalled();
  });
});
