import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'removeItem');

    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save token in localstore', () => {
    service.isLogged.subscribe({
      next: (val) => {
        expect(val).toBeTrue();
      }
    })
    service.saveToken('token1234');
    expect(localStorage.setItem).toHaveBeenCalledWith('TOKEN', 'token1234');
  });

  it('should get token from localStorage', () => {
    service.getToken();
    expect(localStorage.getItem).toHaveBeenCalledWith('TOKEN');
  });

  it('should delete token from localStorage', () => {
    service.isLogged.subscribe({
      next: (val) =>{
        expect(val).toBeFalse;
      }
    });
    service.deleteToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith('TOKEN');
  });

});
