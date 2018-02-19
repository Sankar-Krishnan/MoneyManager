import { Component, AfterViewInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DepositEditPage } from '../depositEdit/depositEdit'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { DatePipe } from '@angular/common'

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {
    selectedItem: any;
    icons: string[];
    items: Array<{title: string, note: string, rowid: number}>;
    toastCtrl: ToastController;
    platform: Platform;

    constructor(public navCtrl: NavController, plt: Platform, private sqlite: SQLite, toastCtrl: ToastController,private datePipe: DatePipe) {

        this.toastCtrl = toastCtrl;

        this.items = [];
        this.platform = plt;
    }

    ionViewDidEnter() {
        this.items = [];
        this.getData().then((resp:any) => {
            for (var i = 0; i < resp.rows.length; i++) {
                //let dt = this.datePipe.transform(resp.rows.item(i).month, 'dd-MMM-yy'); 
                this.items.push({title: resp.rows.item(i).month, note:resp.rows.item(i).amount, rowid: resp.rows.item(i).rowid});
            }
        });
    }
    
//    ionViewDidLoad() {
//        this.getData().then((resp:any) => {
//            for (var i = 0; i < resp.rows.length; i++) {
//                this.items.push({title: resp.rows.item(i).month, note:resp.rows.item(i).amount});
//            }
//        });
//    }

    getData() {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                var query = "SELECT * FROM deposits";
                db.transaction(function(tx) {
                    tx.executeSql(query, [], function(tx, rs) {
                        resolve(rs);
                    }, function(tx, error) {
                        alert('SELECT error: ' + error.message);
                    });
                }).catch(e => alert(JSON.stringify(e)));
            }).catch(e => this.presentToast(e));
        });
    }
    
    editData() {
        this.navCtrl.push(DepositEditPage);
    }

    presentToast(msg:string) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

    itemTapped(event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(DepositEditPage, {
            item: item
        });
    }
}




//db.executeSql('INSERT INTO deposits (amount, month) VALUES (?, ?)', [1000, '02/05/2018']).then((data) => {
//
//                alert("INSERTED error " + JSON.stringify(data));
//                //alert("Insert into page title content OK !");
//            }, (error) => {
//
//                this.presentToast("Report Error inserting table page title content : " + error);
//                //alert("ERROR: " + JSON.stringify(error.err));
//            });
