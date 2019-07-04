import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { IHttpResponse } from 'src/app/interface/http-resp.interface';

export enum HttpMethodType {
  get = 'GET', post = 'POST', delete = 'DELETE', put = 'PUT'
}
export enum HttpDataType {
  RowData, FormData
}


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl: string;

  private corsHeaders: HttpHeaders;

  constructor(
    private http: HttpClient,
    private localSvc: LocalStorageService
  ) {
    // this.baseUrl = 'http://192.168.0.7/khulasa-news-panel/';
    // this.baseUrl = 'http://development.bdigimedia.com/riccha_dev/khulasa-News-Panel/';
    this.baseUrl = 'http://development.bdigimedia.com/riccha_dev/khulasa-En-Panel/';

  }

  /**
   * Send http get request
   * @param apiPath api controller path (exclusive base path)
   * @param params paremeters to send
   */
  public get(apiPath: string, params?: HttpParams): Promise<IHttpResponse> {
    return new Promise((resolve, reject) => {

      this.http.get(this.baseUrl + apiPath, { params }).subscribe(
        (resp: any) => {
          this.handleResponse(resp).then(data => resolve(data)).catch(err => reject(err));
        },
        err => {
          this.handleError(err);
          reject('Something went wrong');
        },
        () => {

        }
      );
    });
  }

  /**
   * Send http post request
   * @param apiPath api controller path (exclusive base path)
   * @param data data to send
   */
  public post(apiPath: string, data?: any): Promise<IHttpResponse> {
    return new Promise((rs, rj) => {
      this.http.post(this.baseUrl + apiPath, data,
        {
          // headers: this.corsHeaders
        }).subscribe(
          resp => {
            this.handleResponse(resp).catch(err => err);
          },
          err => {
            this.handleError(err);
          }
        );
    });
  }

  /**
   * Send http put request
   * @param apiPath api controller path (exclusive base path)
   * @param data data to send
   */
  public put(apiPath: string, data?: any): Promise<IHttpResponse> {
    return new Promise((rs, rj) => {
      this.http.put(this.baseUrl + apiPath, data).subscribe(
        resp => {
          this.handleResponse(resp);
        },
        err => {
          this.handleError(err);
        }
      );
    });
  }

  /**
   * Send http delete request
   * @param apiPath api controller path (exclusive base path)
   */
  public delete(apiPath: string, data?: any): Promise<IHttpResponse> {
    return new Promise((rs, rj) => {

      this.http.delete(this.baseUrl + apiPath).subscribe(
        resp => {
          this.handleResponse(resp);
        },
        err => {
          this.handleError(err);
        }
      );
    });
  }

  private handleResponse(response: any): Promise<IHttpResponse> {
    // const status = parseInt(response.status, 10);

    const resp: IHttpResponse = {
      data: response.data,
      message: response.message,
      status: response.status === true
    };
    if (response.status) {
      return Promise.resolve(resp);
    } else {
      return Promise.reject(resp.message);
    }
  }

  private async handleError(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      if (environment.production) {
        console.error(err.error.message);
      } else {
        alert(err.error.message);
      }
    } else {
      if (environment.production) {
        console.error(`Error status : ${err.status} , Message : ${err.error}`);
      } else {
        alert(err.error.message);
      }
    }
  }

}
