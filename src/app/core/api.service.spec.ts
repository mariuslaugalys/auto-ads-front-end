import {ApiService} from './api.service';
import {environment} from "../../environments/environment";
import createSpyObj = jasmine.createSpyObj;

describe('ApiService', () => {

  let api: ApiService;
  let router;
  let auth;
  let httpClient;

  beforeEach(() => {
    auth = createSpyObj(['getToken', 'authorizeRequest']);
    httpClient = createSpyObj(['put', 'get', 'post', 'delete']);
    router = createSpyObj(['navigate']);

    api = new ApiService(httpClient, router, auth);
  });

  it('should not add Authorization header', () => {
    auth.getToken.and.returnValue(null);
    const headers: any = {};
    api.addAuthorizationHeader(headers);
    expect(headers.Authorization).toBeUndefined();
  });

  it('should add Authorization header', () => {
    auth.getToken.and.returnValue("A");
    const headers: any = {};
    api.addAuthorizationHeader(headers);
    expect(headers.Authorization).toEqual("Bearer A");
  });

  it('should post with Content-Type header', () => {
    auth.getToken.and.returnValue(null);
    api.post("/url", {data: "ABC"});

    expect(httpClient.post).toHaveBeenCalledWith(
      environment.hostUrl + '/url',
      {data: "ABC"},
      {headers: {'Content-Type': "application/json"}}
    );
    expect(httpClient.post).toHaveBeenCalledTimes(1);
    expect(auth.getToken).toHaveBeenCalledTimes(1);
  });

  it('should put with Content-Type header', () => {
    auth.getToken.and.returnValue(null);
    api.put("/url", {data: "ABC"});

    expect(httpClient.put).toHaveBeenCalledWith(
      environment.hostUrl + '/url',
      {data: "ABC"},
      {headers: {'Content-Type': "application/json"}}
    );
    expect(httpClient.put).toHaveBeenCalledTimes(1);
    expect(auth.getToken).toHaveBeenCalledTimes(1);
  });

  it('should post with FormData', () => {
    auth.getToken.and.returnValue(null);

    const formData = new FormData();
    formData.append("name", "ABC")
    api.postFormData("/url", formData);

    expect(httpClient.post).toHaveBeenCalledWith(
      environment.hostUrl + '/url',
      formData,
      {headers: {}}
    );
    expect(auth.getToken).toHaveBeenCalledTimes(1);
  });

  it('should put with FormData', () => {
    auth.getToken.and.returnValue(null);

    const formData = new FormData();
    formData.append("name", "ABC")
    api.putFormData("/url", formData);

    expect(httpClient.put).toHaveBeenCalledWith(
      environment.hostUrl + '/url',
      formData,
      {headers: {}}
    );
    expect(httpClient.put).toHaveBeenCalledTimes(1);
    expect(auth.getToken).toHaveBeenCalledTimes(1);
  });

  it('should call get', () => {
    auth.getToken.and.returnValue(null);
    api.get("/url");

    expect(httpClient.get).toHaveBeenCalledWith(
      environment.hostUrl + '/url',
      {headers: {}}
    );
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(auth.getToken).toHaveBeenCalledTimes(1);
  });

  it('should call delete', () => {
    auth.getToken.and.returnValue(null);
    api.delete("/url");

    expect(httpClient.delete).toHaveBeenCalledWith(
      environment.hostUrl + '/url',
      {headers: {}}
    );
    expect(httpClient.delete).toHaveBeenCalledTimes(1);
    expect(auth.getToken).toHaveBeenCalledTimes(1);
  });

  it('should get with responseType option', () => {
    auth.getToken.and.returnValue(null);
    api.getBlob("/url");

    expect(httpClient.get).toHaveBeenCalledWith(
      environment.hostUrl + '/url',
      {headers: {}, responseType: 'blob'}
    );
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(auth.getToken).toHaveBeenCalledTimes(1);
  });
});
