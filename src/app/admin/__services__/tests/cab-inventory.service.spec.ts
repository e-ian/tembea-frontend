import { CabsInventoryService } from '../cabs-inventory.service';
import { responseMock, getCabsMock, createCabMock } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CabInventoryModel } from 'src/app/shared/models/cab-inventory.model';
import { of } from 'rxjs';

describe('CabInventoryService', () => {
    let injector: TestBed;
    let service: CabsInventoryService;
    let httpMock: HttpTestingController;
    const getCabsResponse = new CabInventoryModel().deserialize(getCabsMock)

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: []
        });
        injector = getTestBed();
        service = injector.get(CabsInventoryService);
        httpMock = injector.get(HttpClientTestingModule);
    });

    describe('getCabs', () => {
        it('should get all Cabs', () => {
            let cabs;
            jest.spyOn(service, 'getCabs').mockReturnValue(of(getCabsResponse));

            service.getCabs(2, 2, 'name,asc,batch,asc').subscribe(value => {
                cabs = value;
            })
            expect(cabs.cabs).toEqual(getCabsMock.cabs);
        });
    })
    describe('addCab', () => {
        it('should add a new cab', () => {
            let cab;
            jest.spyOn(service, 'addCab').mockReturnValue(of(responseMock));

            service.addCab(createCabMock).subscribe(value => {
                cab = value;
            })
            expect(cab).toEqual(responseMock);
        });
    })
})
