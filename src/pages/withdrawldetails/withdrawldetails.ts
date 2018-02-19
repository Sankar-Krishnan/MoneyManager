import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ToastController } from 'ionic-angular';
import { RemoteServiceProvider } from '../../providers/remote-service/remote-service';
import { DatePipe } from '@angular/common'

import { HomePage } from '../home/home';

@Component({
    selector: 'page-withdrawldetails',
    templateUrl: 'withdrawldetails.html'
})

export class WithdrawlDetailsPage {

    rowid: number;
    amount: number;
    debitedAmount: number;
    converstionCharges: number;
    month: Date;
    currencyType: string;
    actualTotal: number;
    debitedTotal: number;
    difference: number;
    conversionRate: number;

    constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private toastCtrl: ToastController, private remoteService : RemoteServiceProvider,private datepipe: DatePipe) {
        this.rowid = 0;

        this.amount = 0;
        this.debitedAmount = 0.0;
        this.converstionCharges = 0.0;
        this.actualTotal = 0.0;
        this.debitedTotal = 0.0;
        this.difference = 0.0;
        this.conversionRate = 0.0;

        let item = navParams.get('rowid');
        //alert(JSON.stringify(item));
        if(item != undefined) {
            this.rowid = item;
        }
    }

    saveData() {
        this.actualTotal = 0.0;
        this.debitedTotal = 0.0;
        this.difference = 0.0;

        let dateWithdrawn = this.datepipe.transform(this.month, 'yyyy-MM-dd');;

        this.remoteService.getConversionRateAsPerDate(dateWithdrawn).subscribe((data)=>{
            this.conversionRate = data.rates.MXN;
            //alert(this.conversionRate + " " + this.amount + " " + this.debitedAmount + " " + this.converstionCharges);
            this.actualTotal = this.amount / this.conversionRate;
            this.debitedTotal = +this.debitedAmount + +this.converstionCharges;
            this.difference = this.debitedTotal - this.actualTotal;

            this.saveToDB();

            this.navCtrl.pop();
        });
    }

    ionViewDidLoad() {
        //this.presentToast("View did enter");
        if(this.rowid != 0) {
            this.getData(this.rowid).then((resp:any) => {
                //alert(JSON.stringify(resp));
                this.amount = resp.rows.item(0).amount;
                this.debitedAmount = resp.rows.item(0).debitedamount;
                this.converstionCharges = resp.rows.item(0).conversioncharges;
                this.actualTotal = resp.rows.item(0).actualtotal;
                this.debitedTotal = resp.rows.item(0).debitedtotal;
                this.difference = resp.rows.item(0).difference;
                this.conversionRate = resp.rows.item(0).conversionrate;
                this.month = resp.rows.item(0).month;
                this.currencyType = resp.rows.item(0).currencytype;
                alert(this.currencyType);
            });    
        }
    }


    getData(id) {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                var query = "SELECT * FROM withdrawls where rowid=?";
                db.transaction(function(tx) {
                    //alert(id);
                    tx.executeSql(query, [id], function(tx, rs) {
                        resolve(rs);
                    }, function(tx, error) {
                        alert('SELECT error: ' + error.message);
                    });
                }).catch(e => alert(JSON.stringify(e)));
            }).catch(e => this.presentToast(e));
        });
    }

    saveToDB() {
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                if(this.rowid == 0) {
                    var query = 'INSERT INTO withdrawls (amount, debitedamount,conversioncharges,month,currencytype,actualtotal,debitedtotal,difference,conversionrate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    db.executeSql(query, [this.amount, this.debitedAmount, this.converstionCharges, this.month, this.currencyType, this.actualTotal, this.debitedTotal, this.difference, this.conversionRate]).then((data) => {
                        this.presentToast("New Withdrawl Recorded")
                        resolve();
                    }, (error) => {
                        alert(JSON.stringify(error));
                        //alert("ERROR: " + JSON.stringify(error.err));
                    });
                }
                else {
                    alert("update");
                    var updateQuery = 'update withdrawls set amount=?, debitedamount=?,conversioncharges=?,month=?,currencytype=?,actualtotal=?,debitedtotal=?,difference=?,conversionrate=? where rowid=?';
                    db.executeSql(query, [this.amount, this.debitedAmount, this.converstionCharges, this.month, this.currencyType, this.actualTotal, this.debitedTotal, this.difference, this.conversionRate, this.rowid]).then((data) => {
                        this.presentToast("New Withdrawl Recorded")
                        resolve();
                    }, (error) => {
                        alert(JSON.stringify(error));
                        //alert("ERROR: " + JSON.stringify(error.err));
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

//create table if not exists withdrawls(rowid INTEGER PRIMARY KEY, amount integer, debitedamount decimal, conversioncharges decimal, month datetime,currencytype text, actualtotal decimal, debitedtotal decimal, difference decimal, conversionrate decimal)
