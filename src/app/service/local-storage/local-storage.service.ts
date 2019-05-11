import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  private prefixKey: string = 'ks_';

  public setData(key: string, data: any, makeStringify: boolean = true): void {
    if (data) {
      if (makeStringify === true) {
        localStorage.setItem(this.prefixKey + key, JSON.stringify(data));
      } else {
        localStorage.setItem(this.prefixKey + key, data);
      }
    }
  }

  public getData(key: string): any;
  public getData(key: string, inJson: boolean): any;
  public getData(key: string, inJson?: boolean): any {
    let localData = localStorage.getItem(this.prefixKey + key);
    if (localData) {
      if (inJson === true) {
        try {
          const _localData = JSON.parse(localData);
          return _localData;
        } catch (err) {
          console.warn(err);
          return null;
        }
      } else {
        return localData;
      }
    } else {
      return null;
    }
  }

}
