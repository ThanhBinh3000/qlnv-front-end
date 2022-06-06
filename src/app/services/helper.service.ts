import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import Cleave from 'cleave.js';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { ResponseData } from '../interfaces/response';
declare var vgcapluginObject: any;

@Injectable({
  providedIn: 'root'
})

export class HelperService {
  constructor(
    private httpClient: HttpClient
  ) { }

  markFormGroupTouched(formGroup) {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }

  EnumToSelectList(key): Promise<ResponseData<any>> {
    const url = `${environment.SERVICE_API}api/InitApp/EnumToSelectList?key=${key}`;
    return this.httpClient.get<ResponseData<any>>(url).toPromise();
  }


  dateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value && !moment(control.value, 'DD/MM/YYYY', true).isValid()) {
      return { invalid: true };
    }
    return;
  };

  formatDate() {
    const datesCollection = (<HTMLCollection>document.getElementsByClassName('input-date'));
    let dates = Array.from(datesCollection);

    dates.forEach(function (date) {
      new Cleave(date, {
        date: true,
        delimiter: '/',
        datePattern: ['d', 'm', 'Y'],
      })
    });
  }

  SignFileCallBack1(rv) {
    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
      location.reload()
    }
  }

  replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }
}