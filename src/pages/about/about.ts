import { Component } from '@angular/core';
import { PopoverController, IonicPage, ToastController, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  // public deployChannel = "";
  // public isBeta = false;
  // public progress = 0;
  // public progressTitle = '';

  constructor(
    public popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    public navCtrl: NavController) {
  }

  presentPopover(event: Event) {
    let popover = this.popoverCtrl.create('AboutPopoverPage');
    popover.present({ ev: event });
  }

  // async checkChannel() {
  //   try {
  //     const res = await Pro.deploy.info();
  //     this.deployChannel = res.channel;
  //     this.isBeta = (this.deployChannel === 'Master')
  //   } catch (err) {
  //     this.handleError(err);
  //   }
  // }

  // async toggleBeta() {
  //   const config = {
  //     channel: (this.isBeta ? 'Master' : 'Production')
  //   }

  //   try {
  //     await Pro.deploy.init(config);
  //     await this.checkChannel();
  //   } catch (err) {
  //     this.handleError(err);
  //     // Pro.monitoring.exception(err);
  //   }

  // }

  // async performAutoUpdate() {

  //   try {
  //     const resp = await Pro.deploy.checkAndApply(true, function (progress) {
  //       this.progress = progress;
  //     });

  //     if (resp.update) {
  //       // We found an update, and are in process of redirecting you since you put true!
  //     } else {
  //       // No update available
  //     }
  //   } catch (err) {
  //     this.handleError(err);
  //     // Pro.monitoring.exception(err);
  //   }
  // }

  // async performManualUpdate() {
  //   try {
  //     const haveUpdate = await Pro.deploy.check();
  //     this.progress = 0;

  //     if (haveUpdate) {
  //       let alert = this.alertCtrl.create({
  //         title: '升级',
  //         message: '发现新版本，现在下载安装？',
  //         buttons: [
  //           {
  //             text: '稍后再说',
  //             role: 'cancel',
  //             handler: () => {
  //               console.log('Cancel clicked');
  //             }
  //           },
  //           {
  //             text: '升级',
  //             handler: () => {
  //               this.showDownloadModal();
  //             }
  //           }
  //         ]
  //       });
  //       alert.present();
  //     } else {
  //       this.toastCtrl.create({ message: '已经是最新版本', duration: 3000 }).present();
  //     }
  //   } catch (err) {
  //     this.handleError(err);
  //   }
  // }

  // async downloadAndExtract() {
  //   try {
  //     this.progressTitle = '下载中...';
  //     Pro.deploy
  //     await Pro.deploy.download((progress) => {
  //       this.progress = progress;
  //     })

  //     this.progressTitle = '解压中...';
  //     await Pro.deploy.extract((progress) => {
  //       this.progress = progress;
  //     })

  //     await Pro.deploy.redirect();
  //   }
  //   catch (err) {
  //     this.handleError(err);
  //   }
  // }

  // async checkVersions() {
  //   const versions = await Pro.deploy.getVersions();
  //   console.log(versions);
  //   // ['UUID', 'UUID2', 'UUID3']
  // }

  // async deleteVersion() {
  //   const versions = await Pro.deploy.getVersions();
  //   Pro.deploy.deleteVersion(versions[0]);
  // }

  // showDownloadModal() {
  //   const modalOptions: ModalOptions = {
  //     showBackdrop: false,
  //     enableBackdropDismiss: false,
  //     // enterAnimation: 'modal-slide-in',
  //     // leaveAnimation: 'modal-slide-out',
  //     // cssClass: `padding: 30px; background: rgba(0,0,0,0.5);`
  //   };
  //   this.modalCtrl.create('UpdateDownloadPage', { download: true }, modalOptions).present();
  // }


  handleError(err) {
    this.toastCtrl.create({ message: err, duration: 3000, showCloseButton: true })
  }

  goToDonate() {
    this.navCtrl.setRoot('DonatePage');
  }
}
