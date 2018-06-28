import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ApiInterceptor } from "../providers/api-interceptor";
import { DataProvider } from "../providers/data";
import { UserData } from "../providers/user-data";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { HttpModule } from "@angular/http";
import { SharedModule } from "../shared/shared.module";
import { WebApi } from "../providers/webapi";
import { ComponentsModule } from "../components/components.module";
import { UtilProvider } from "../providers/util";
import { AppSettings } from "../providers/app-settings";
//import { AppCenterAnalytics } from '@ionic-native/app-center-analytics';
import { IonicStorageModule } from "../../node_modules/@ionic/storage";
//import { CodePush } from '@ionic-native/code-push';

export const PROVIDERS = [
    AppSettings,
    DataProvider,
    UserData,
    WebApi,
    UtilProvider,
    InAppBrowser,
    //AppCenterAnalytics,
    //CodePush,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
]

export const MODULES = [
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    SharedModule,
    ComponentsModule
]