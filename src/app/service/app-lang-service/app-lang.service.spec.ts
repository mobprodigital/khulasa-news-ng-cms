import { TestBed } from '@angular/core/testing';

import { AppLangService } from './app-lang.service';

describe('AppLangService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppLangService = TestBed.get(AppLangService);
    expect(service).toBeTruthy();
  });
});
