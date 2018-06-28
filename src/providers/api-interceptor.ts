import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import { ToastController, AlertController } from 'ionic-angular';
import { AppSettings } from './app-settings';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    
    private alert: any;

    constructor(public toastCtrl: ToastController,
        public settings: AppSettings,
        public alertCtrl: AlertController) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let self = this;

        if (request.url.indexOf('http') === -1 && request.url.indexOf('assets') === -1) {

            request = request.clone({
                url: `${self.settings.get('api_url')}${request.url}`,
                setHeaders: {
                    'X-Host-Override': 'wanjiajinfu.com',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
        }



        return next.handle(request).do((event) => {
            if (event instanceof HttpResponse) {
                // console.log(event.body);

                if (event.body && event.body.result) {
                    // if (event.body.result != '000000')
                    this.toastCtrl.create({ message: event.body.resultdesc, duration: 3000 }).present();
                }
            }
        }, err => {

            if (err instanceof HttpErrorResponse) {

                console.log(err);

                if (err.status == 401 && request.headers.get('Anonymous'))
                    return;
                else if (err.status != 200) {

                    if (self.alert) {
                        return;
                    }

                    let title = '' + err.status;
                    let msg = err.message;
                    if (err.status == 403) {
                        title = '';
                        msg = '糟糕，服务器禁止当前IP的访问，请换一个网络或者稍后再试';
                    }
                    else if (err.status == 0) {
                        title = '';
                        msg = '网络好像出了点问题';
                    }
                    var alert = this.alertCtrl.create({
                        title: title,
                        subTitle: msg,
                        buttons: ['Dismiss']
                    });
                    alert.onDidDismiss(() => {
                        self.alert = null;
                    });

                    self.alert = alert;

                    alert.present();
                }
            }


        });
    }
}