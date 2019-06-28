import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  private prefixKey: string = 'ks_';

  /**
   * @param key key name to save data
   * @param data data to save
   * @param makeStringify (default is false)if true then save data in json string else in original type
   */
  public setData(key: string, data: any, makeStringify: boolean = false): void {
    if (data !== undefined || data !== null) {
      if (makeStringify === true) {
        data = JSON.stringify(data);
      }
      localStorage.setItem(this.prefixKey + key, data);
    }
  }


  /**
   * Get local stored data by key
   * @param key key of stored value
   * @param inJson (optional) (default false) If true json object will be returned else return any
   */
  public getData(key: string, inJson: boolean = false): any {
    const localData = localStorage.getItem(this.prefixKey + key);
    if (localData) {
      if (inJson === true) {
        try {
          const jsonData = JSON.parse(localData);
          return jsonData;
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

  /**
   * Clear all localStorage data
   */
  public clear(): void {
    localStorage.clear();
  }

}
