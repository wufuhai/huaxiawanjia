import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/share';
import { DataProvider } from './data';
import { Md5 } from 'ts-md5';
import { UtilProvider } from './util';

// declare var returnCitySN;

@Injectable()
export class WebApi {

    post_url: string = '/webAPI/api';
    post_uc_url: string = '/webAPI/uc/api';
    constructor(
        public events: Events,
        public storage: Storage,
        public http: HttpClient,
        public toastCtrl: ToastController,
        public util: UtilProvider,
        public data: DataProvider) {

    }

    login(phone, password) {

        var loginKey = Md5.hashStr(password);

        // var self = this;
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

        var seq = this.http.post(this.post_uc_url, `service_name=god.login&phone=${phone}&loginKey=${loginKey}`, { headers });

        seq.subscribe((json: any) => {
            if (json.tokenId) {
                var cookie = {
                    password: password,
                    tokenId: json.tokenId,
                    god: json.god,
                };

                this.data.addCookie(cookie);
            }
        })

        return seq;
    };

    async getAccountInfo(account) {
        return this.post(this.post_url,
            { service_name: 'mbm_mbminfo_req', tokenId: account.tokenId, godId: account.god.id, aId: 1 },
            (json: any) => {
                var result = json.result;
                if (result == "000000") {
                    var userReceivedAmount = this.util.fMc2(json.alreadyInterest);
                    var userAmount = this.util.fMc2(json.amount);
                    var userAvailableAmount = this.util.fMc2(json.availableAmount);
                    account.userReceivedAmount = this.util.fMc(userReceivedAmount);//累计到账收益（元）
                    account.userAmount = this.util.fMc(userAmount);//资产总计（元）
                    account.userAvailableAmount = this.util.fMc(userAvailableAmount);//可用余额（元）
                    account.status = json.userjfAmount + '积分';//总积分
                    account.signStatus = json.signStatus;
                    this.data.saveAccounts();
                }
                else if (result == '100097') {
                    account.status = '登录状态已过期'
                }
            });
    }

    // requestFruiteState(account: any) {
    //     return this.request(this.post_url, { service_name: 'mbm_activities_gold_silver_status_req', tokenId: account.tokenId, godId: account.god.id });
    // };

    async getKcodes(account) {

        // var self = this;
        await this.post(this.post_url, { service_name: 'mbm_kcode_list_req', tokenId: account.tokenId, godId: account.god.id, status: 2, pageIndex: 1, pageSize: 200 },
            (data: any) => {
                if (data.result === '000000') {

                    account.kcodes = data.object;
                    for (let code of data.object) {
                        this.addKcode(account, code);
                    }

                    this.data.kcodeGroups = this.data.kcodeGroups.sort((a, b) => { return a.restDays - b.restDays });
                }
            });
    }

    addKcode(account: any, data: any) {
        if (data == null)
            return;

        var group = this.data.kcodeGroups.find(g => g.account.god.id == account.god.id);
        if (group == null) {
            group = { account: account, hide: false, restDays: 999, items: [] };
            group.items = [];
            this.data.kcodeGroups.push(group);
        }

        var item = group.items.find(i => i.id == data.id);
        if (item == null) {
            item = data;
            group.items.push(item);
        }

        item.deviceName = data.deviceName;
        item.accountId = data.accountId;
        item.activateTime = data.activateTime;
        item.allowSpeed = data.allowSpeed;
        item.kcode = data.kcode;
        item.kcodeAmount = data.kcodeAmount;
        item.hide = false;
        item.speed = 0;

        item.tracks = ['navigation'];

        if (data.unExchangeAmount && data.kcodeExchangePlanList) {

            data.kcodeExchangePlanList.forEach(plan => {

                if (item.restDays == null && plan.actualExchangeDate == '') {

                    item.exchangeDate = plan.exchangeDate;
                    item.restDays = plan.restDays; //this.calcRestDays(item.exchangeDate);

                    if (item.restDays < group.restDays)
                        group.restDays = item.restDays;
                }

                if (plan.speed > 0)
                    item.speed = item.speed + 1;

            });
        }
        group.items = group.items.sort((a, b) => { return a.restDays - b.restDays });

    }

    // private calcRestDays(date: any) {
    //     var date1 = new Date();
    //     var date2 = new Date(date);
    //     var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    //     var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    //     if (diffDays < 0)
    //         diffDays = 0;
    //     return diffDays;
    // }

    async checkin(account: any) {

        // 签到
        await this.post(this.post_url, { service_name: 'mbm_signdetail_req', tokenId: account.tokenId, godId: account.god.id }).toPromise();

        // 每日打卡
        await this.post(this.post_url, { service_name: 'every_day_sign_req', tokenId: account.tokenId, godId: account.god.id }).toPromise();

        // 分享加一次抽奖机会
        await this.post(this.post_url, { service_name: 'mbm_act_share', tokenId: account.tokenId, godId: account.god.id, aId: 1 }).toPromise();

        // 第一次抽奖
        await this.post(this.post_uc_url, { service_name: 'lottery.roll', tokenId: account.tokenId, godId: account.god.id, aId: 1 }).toPromise();

        // 第二次抽奖
        await this.post(this.post_uc_url, { service_name: 'lottery.roll', tokenId: account.tokenId, godId: account.god.id, aId: 1 }).toPromise();

        // 重新获取账户信息
        await this.getAccountInfo(account);
    };

    //获取状态
    async getFruitState(account: any) {
        let seq = this.post(this.post_url, { service_name: 'mbm_activities_gold_silver_status_req', tokenId: account.tokenId, godId: account.god.id });

        seq.subscribe((json: any) => {
            var result = json.result;
            if (result == "000000") {
                var noReceiveSeed = json.data.noReceiveSeed;
                var receiveSeed = json.data.receiveSeed;

                if (noReceiveSeed && noReceiveSeed.id) {

                    account.fruit = {
                        level: noReceiveSeed.level,
                        name: noReceiveSeed.level == 1 ? '普通果实' : (noReceiveSeed.level == 2 ? '银果实' : '金果实'),
                        countdown: this.util.toTime(noReceiveSeed.completeTime - json.data.systemDate)
                    };
                } else if (receiveSeed) {

                    account.fruit = {
                        level: 0,
                        name: '浇水',
                        countdown: '23:59:59'
                    };
                }

                this.data.saveAccounts();
            }
        });

        await seq.toPromise();
    };

    //浇水
    async waterFruit(account: any) {

        await this.post(this.post_url, { service_name: 'mbm_activities_gold_silver_watering_req', tokenId: account.tokenId, godId: account.god.id }, (json) => {
            var result = json.result;
            if (result == "000000") {
                this.getFruitState(account);
            }
        }).toPromise();
    };

    //摘取
    async pickFruit(account: any) {
        let body = { service_name: 'mbm_activities_gold_silver_receive_req', tokenId: account.tokenId, godId: account.god.id };

        // 摘取
        await this.post(this.post_url, body).toPromise();

        // 重新浇水
        await this.waterFruit(account);

        // 更新加速券数量
        await this.getMyCoupons(account);
    };

    async harvest(account: any) {

        let fruit = account.fruit;
        if (fruit) {
            if (fruit.level == 3)
                this.pickFruit(account);
            else
                this.waterFruit(account);
        }
    }

    async getMyQuali(account: any) {
        await this.post(this.post_url, {
            service_name: 'kcode_active_right_req', godId: account.id, tokenId: account.tokenId
        }, (json: any) => {
            var result = json.result;

            if (result == "000000") {
                var items = json.object as any[];
                if (items.length > 0) {
                    account.devices = items;
                }
            }
        }).toPromise();
    }

    async getMyCoupons(account: any) {

        await this.post(this.post_url, {
            "service_name": "mbm_kaquan_req",
            "godId": account.god.id,
            "tokenId": account.tokenId,
            "presenttype": 7,
            "presentstatus": 1,
            "pageIndex": 1,
            "pageSize": 100
        }, (json: any) => {
            var result = json.result;

            if (result == "000000") {
                var items = json.object as any[];
                if (items && items.length > 0) {
                    account.speedCoupons = items;
                }

                this.data.saveAccounts();
            }
        }).toPromise();
    }

    async getKgift(account: any) {

        await this.post(this.post_url, {
            "service_name": "mbm_kcode_amount_req",
            "godId": account.god.id,
            "tokenId": account.tokenId
        }, (json: any) => {
            var result = json.result;

            if (result == "000000") {
                account.rewardAmount = this.util.fMc(this.util.fM(json.amount));

                this.data.saveAccounts();
            }
        }).toPromise();
    }

    getCode(phone) {
        return this.post(this.post_uc_url, {
            "service_name": "activeCode.phone",
            "phone": phone,
            "logicType": "3",
            "type": "1"
        }
        // , (json: any) => {
        //     if (json.result == "000000") {
        //         this.util.toast('获取成功，短信验证码正下发至您的手机，请耐心等待！').present();
        //     }
        // }
    );
    }

    withdraw(godId, tokenId, amount, phone, code) {
        this.post(this.post_url, {
            "service_name": "mbm_outcome_req",
            "godId": godId,
            "tokenId": tokenId,
            "amount": amount,
            // "bankcardName": bankcardName,
            // "bankCardNumber": bankCardNumber,
            // "bankCardSubbranch": bankCardSubbranch,
            "outcomeVarifycode": code,
            "phone": phone,
            //"fraudTokenId": fraudTokenId,
            //"ip": returnCitySN["cip"]
        },

            (json) => {
                var result = json.result;
                if (result == "000000") {
                    this.util.toast(json.resultdesc).present();
                }
            });
    }

    private post(url, data, callback?: any) {

        // this.wait(300);

        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

        var params = [];
        for (var key in data) {
            var val = data[key];
            params.push(key + "=" + val);
        }

        const body = params.join('&');

        let seq = this.http.post(url, body, { headers }).share();

        if (callback)
            seq.subscribe(callback);

        return seq;
    }

    public showToast(msg: any) {
        this.toastCtrl.create({ message: msg, duration: 3000 }).present();
    }

    // private wait(ms) {
    //     var start = new Date().getTime();
    //     var end = start;
    //     while (end < start + ms) {
    //         end = new Date().getTime();
    //     }
    // }
}