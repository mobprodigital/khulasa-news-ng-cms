import { Injectable, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AppLangEnum } from 'src/app/enum/app-lang.enum';


@Injectable({
  providedIn: 'root'
})
export class AppLangService {


  @Output()
  public langChangedEmitter: EventEmitter<AppLangEnum> = new EventEmitter();

  constructor(
    private localStgService: LocalStorageService
  ) {

  }


  private _selectedAppLang: AppLangEnum =
    this.localStgService.getData('lang') === AppLangEnum.English ? AppLangEnum.English : AppLangEnum.Hindi;

  public get selectedAppLang(): AppLangEnum {
    return this._selectedAppLang;
  }
  public set selectedAppLang(v: AppLangEnum) {
    this._selectedAppLang = v;
    this.localStgService.setData('lang', v, false);
    this.langChangedEmitter.emit(v);
  }

}

