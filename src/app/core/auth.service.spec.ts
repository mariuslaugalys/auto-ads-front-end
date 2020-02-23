import {AuthService} from './auth.service';
import {Subject} from "rxjs";
import {fakeAsync, tick} from "@angular/core/testing";

describe('AuthService', () => {

  let source;
  let service: AuthService;
  let mockRouter;

  beforeEach(() => {
    source = new Subject<any>();
    mockRouter = jasmine.createSpyObj(['navigate']);
    service = new AuthService(mockRouter);
  });

  it('should return object', fakeAsync(() => {
    let result: any = "";
    service.authorizeRequest(source.asObservable()).subscribe((response) => {
      result = response;
    });
    source.next("success");
    tick();
    expect(result).toEqual("success");
  }));

  it('should throw error object', fakeAsync(() => {
    let errorObj: any = {status: 500, message: "error"};

    expect(() => {
      service.authorizeRequest(source.asObservable()).subscribe();
      source.error(errorObj);
      tick()
    }).toThrow(errorObj);
  }));

  it('should call navigate and clear token', fakeAsync(() => {
    let errorObj: any = {status: 401, message: 'unauthorized'};

    const clearTokenSpy = spyOn(service, 'clearToken');

    expect(() => {
      service.authorizeRequest(source.asObservable()).subscribe();
      source.error(errorObj);
      tick();
    }).toThrow(errorObj);

    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(clearTokenSpy).toHaveBeenCalledTimes(1);
  }));

  it('should set sessionStorage token and emit', () => {
    const emitSpy = spyOn(service.tokenSubject, 'next');
    const storageSetSpy = spyOn(sessionStorage, 'setItem');
    const storageRemoveSpy = spyOn(sessionStorage, 'removeItem');

    service.setToken("A");
    expect(emitSpy).toHaveBeenCalledWith('A');
    expect(storageSetSpy).toHaveBeenCalledWith('token', 'A');

    service.clearToken();
    expect(emitSpy).toHaveBeenCalledWith('');
    expect(storageRemoveSpy).toHaveBeenCalledTimes(1);
  });
});
