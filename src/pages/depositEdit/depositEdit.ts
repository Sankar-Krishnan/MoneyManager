import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ToastController } from 'ionic-angular';

import { ListPage } from '../list/list';

@Component({
    selector: 'page-depositEdit',
    templateUrl: 'depositEdit.html'
})

export class DepositEditPage {

    selectedItem: any;
    icons: string[];
    amount: number;
    month: Date;
    rowid: number;

    constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private toastCtrl: ToastController) {
        this.amount=0;

        let item = navParams.get('item');
        //alert(JSON.stringify(item));
        if(item != undefined) {
            this.amount = item.note;
            this.month = item.title;
            this.rowid = item.rowid;
        }
        else {
            this.rowid = 0;
        }
    }

    saveData() {
        this.saveToDB().then(() => {
            this.navCtrl.pop();
        });
    }

    saveToDB() {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            }).then((db: SQLiteObject) => {

                if(this.rowid == 0) {
                    var query = 'INSERT INTO deposits (amount, month) VALUES (?, ?)';
                    db.executeSql(query, [this.amount, this.month]).then((data) => {
                        this.presentToast("New Deposit Recorded")
                        resolve();
                    }, (error) => {
                        this.presentToast("Report Error inserting table page title content : " + error);
                        //alert("ERROR: " + JSON.stringify(error.err));
                    });
                }
                else {
                    var query = 'update deposits SET amount=?,month=? where rowid=?';
                    db.executeSql(query,[this.amount,this.month,this.rowid]).then((data) => {
                       this.presentToast("Deposit Updated");
                        resolve();
                    }, (error) => {
                        this.presentToast("Report Error updating table page title content : " + error);
                    });
                }
            }).catch(e => this.presentToast(e));
        });
    }

    presentToast(msg:string) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }
}
