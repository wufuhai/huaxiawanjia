import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, ToastController } from 'ionic-angular';
//import { Pro } from '@ionic/pro';

@IonicPage()
@Component({
  selector: 'page-update-download',
  templateUrl: 'update-download.html',
})
export class UpdateDownloadPage {

  public progress = 0;
  public progressTitle = '';

  constructor(public navParams: NavParams,
    public viewCtrl: ViewController,
    //private alertCtrl: AlertController,
    //public renderer: Renderer,
    private toastCtrl: ToastController) {

    //this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);

    const download = navParams.get('download');
    if (download) {
      this.downloadAndExtract();
    }
  }

  ionViewDidLoad() {

  }

  closeView() {
    this.viewCtrl.dismiss();
  }

  async downloadAndExtract() {
    // try {
    //   this.progressTitle = 'Downloading...';
    //   Pro.deploy
    //   await Pro.deploy.download((progress) => {
    //     this.progress = progress;
    //   })

    //   this.progressTitle = 'Extracting...';
    //   await Pro.deploy.extract((progress) => {
    //     this.progress = progress;
    //   })

    //   let alert = this.alertCtrl.create({
    //     title: '退出',
    //     message: '升级成功，新版本需要重新启动才能生效',
    //     buttons: [
    //       {
    //         text: '稍后再说',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel clicked');
    //         }
    //       },
    //       {
    //         text: '重新打开',
    //         handler: () => {
    //           Pro.deploy.redirect();
    //         }
    //       }
    //     ]
    //   });
    //   alert.present();
    // }
    // catch (err) {
    //   this.handleError(err);
    // }
  }


  handleError(err) {
    this.toastCtrl.create({ message: err, duration: 3000, showCloseButton: true })
  }

}
