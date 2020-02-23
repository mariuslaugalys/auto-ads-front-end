import {AuthGuard} from './auth.guard';
import createSpyObj = jasmine.createSpyObj;

describe('AuthGuard', () => {

  let mockRouter;
  let mockAuth;
  let guard;

  beforeEach(() => {
    mockRouter = createSpyObj(['navigate']);
    mockAuth = createSpyObj(['getToken']);
    guard = new AuthGuard(mockAuth, mockRouter);
  });

  it('should call navigate', () => {
    mockAuth.getToken.and.returnValue(undefined);

    expect(guard.canActivate()).toEqual(false);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
  });

  it('should return true', () => {
    mockAuth.getToken.and.returnValue('token');

    expect(guard.canActivate()).toEqual(true);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
  });
});
