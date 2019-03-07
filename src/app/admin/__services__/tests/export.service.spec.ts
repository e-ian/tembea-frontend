import { ExportService } from '../export.component.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';

describe('ExportComponent', () => {
  describe('exportToPDF', () => {
    let service: ExportService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });

      const testBed = getTestBed();
      service = testBed.get(ExportService);
      httpMock = testBed.get(HttpTestingController);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should make a get http call', async () => {
      await service.exportToPDF('routes', 'name,asc,id,asc', {})
        .subscribe((result) => {
          expect(result).toEqual('');
        })

      const request = httpMock.expectOne(`${service.exportToPDFUrl}?table=routes&sort=name,asc,id,asc`);
        expect(request.request.method).toEqual('GET');
    })
  })
});
