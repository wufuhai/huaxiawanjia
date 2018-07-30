import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PageInterface } from '../interfaces/page';
import { DataProvider } from '../providers/data';
import { AppSettings } from '../providers/app-settings';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  appPages: PageInterface[] = [
    { title: '账户', name: 'AccountListPage', component: 'AccountListPage', tabComponent: 'AccountListPage', index: 0, icon: 'contacts' },
    { title: 'K码', name: 'KCodeListPage', component: 'KCodeListPage', tabComponent: 'KCodeListPage', index: 1, icon: 'calendar' },
  ];

  otherPages: PageInterface[] = [
    { title: '添加账户', name: 'LoginPage', component: 'LoginPage', icon: 'person-add' },
    { title: '打赏', name: 'DonatePage', component: 'DonatePage', icon: 'cash' },
    { title: '关于', name: 'AboutPage', component: 'AboutPage', icon: 'information-circle' }
  ];

  private isDevice: boolean;
  rootPage: any;

  constructor(
    private platform: Platform,
    data: DataProvider,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appCenterAnalytics: AppCenterAnalytics,
    //private codePush: CodePush,
    private settings: AppSettings) {

    this.rootPage = 'AccountListPage';
    this.platformReady();

    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.settings.useProxy();
    } else {
      this.isDevice = true;
    }

    // load the data
    data.load();
  }

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Set the root of the nav with params if it's a tab index
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();

      if (this.isDevice)
        this.appCenterAnalytics.setEnabled(true).then(() => { console.log('App cernter analytics enabled') }).catch();

      // this.checkCodePush(); //Use the plugin always after platform.ready()
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  //   checkCodePush() {

  //     this.codePush.sync({
  //      updateDialog: {
  //       appendReleaseDescription: true,
  //       descriptionPrefix: "\n\nChange log:\n"   
  //      },
  //      installMode: InstallMode.IMMEDIATE
  //   }).subscribe(
  //     (data) => {
  //      console.log('CODE PUSH SUCCESSFUL: ' + data);

  //     },
  //     (err) => {
  //      console.log('CODE PUSH ERROR: ' + err);

  //     }
  //   );
  //  }
}



