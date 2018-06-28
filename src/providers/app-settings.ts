import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {
  _settings = {};
  constructor() {
    this.set('api_url', 'http://weixin.wanjiajinfu.com');
    this.set('update_url', 'https://kelvinwu.blob.core.windows.net/download/update.xml');
  }

  get(prop?: any) {
    // use our state getter for the clone
    const state = this._settings;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    return this._settings[prop] = value;
  }

  useProxy(){
    this.set('api_url', 'http://192.168.2.8:8484/http://weixin.wanjiajinfu.com')
  }
}
