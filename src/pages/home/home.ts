import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WithdrawlDetailsPage } from '../withdrawldetails/withdrawldetails';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ToastController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    selectedItem: any;
    icons: string[];
    items: Array<{amount: string, month: string, rowid: number}>;
    toastCtrl: ToastController;

    constructor(public navCtrl: NavController,private sqlite: SQLite, toastCtrl: ToastController) {
        this.toastCtrl = toastCtrl;

        this.items = [];
        sqlite.create({
            name: 'data.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('create table if not exists deposits(rowid INTEGER PRIMARY KEY,amount integer, month datetime)', {}).then(() => {
                this.presentToast('Created Deposit');
            }).catch(e => {
                this.presentToast(e);
            });
            
            db.executeSql('create table if not exists withdrawls(rowid INTEGER PRIMARY KEY, amount integer, debitedamount decimal, conversioncharges decimal, month datetime,currencytype text, actualtotal decimal, debitedtotal decimal, difference decimal, conversionrate decimal)', {}).then(() => {
                this.presentToast('Created Withdrawls');
            }).catch(e => {
                alert(JSON.stringify(e));
            });
        }).catch(e => this.presentToast(e));
    }
    
    ionViewDidEnter() {
        this.items = [];
        this.getData().then((resp:any) => {
            for (var i = 0; i < resp.rows.length; i++) {
                //let dt = this.datePipe.transform(resp.rows.item(i).month, 'dd-MMM-yy'); 
                this.items.push({amount: resp.rows.item(i).amount, month:resp.rows.item(i).month, rowid: resp.rows.item(i).rowid});
            }
        });
    }
    
    getData() {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                var query = "SELECT * FROM withdrawls";
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
        this.navCtrl.push(WithdrawlDetailsPage);
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
        //alert('Clicked');
        this.navCtrl.push(WithdrawlDetailsPage, {
            rowid: item.rowid
        });
    }

}
