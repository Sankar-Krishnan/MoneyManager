import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatePipe } from '@angular/common'
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { WithdrawlDetailsPage } from '../pages/withdrawldetails/withdrawldetails';
import { DepositEditPage } from '../pages/depositEdit/depositEdit'


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DashboardPage,
    WithdrawlDetailsPage,
    DepositEditPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DashboardPage,
    WithdrawlDetailsPage,
    DepositEditPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    [DatePipe],
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteServiceProvider,
    HttpClientModule
  ]
})
export class AppModule {}
