import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth/auth.guard';
import { AuthService } from './service/auth/auth.service';
import { AjaxInterceptor } from './interceptor/ajax-interceptor/ajax-interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  providers: [AuthGuard, AuthService,
    [{
      provide: HTTP_INTERCEPTORS,
      useClass: AjaxInterceptor,
      multi: true,

    }, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }], MatDatepickerModule,
    MatNativeDateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
