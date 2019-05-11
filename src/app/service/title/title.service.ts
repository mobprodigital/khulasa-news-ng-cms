import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private titleService: Title) {

  }

  public setTitle(Title: string) {
    this.titleService.setTitle(Title+' | '+'Khulasa-News');
  }
}
