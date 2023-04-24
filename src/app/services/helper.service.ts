import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import Cleave from 'cleave.js';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { ResponseData } from '../interfaces/response';
import { MESSAGE } from "../constants/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
declare var vgcapluginObject: any;

@Injectable({
  providedIn: 'root'
})

export class HelperService {
  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService,
  ) { }

  markFormGroupTouched(formGroup) {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i) && formGroup.controls[i].enabled) {

          formGroup.controls[i].markAsDirty();
          formGroup.controls[i].updateValueAndValidity();

      }
    }
    this.findInvalidControls(formGroup);
  }


  async getId(sequenceName: string) {
    if (sequenceName) {
      const url = `${environment.SERVICE_API}/qlnv-system/system/${sequenceName}`;
      let res = await this.httpClient.get<any>(url).toPromise();
      if (res.msg == MESSAGE.SUCCESS) {
        return res.data;
      }
    } else {
      console.error('Sequence Name is null')
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

  findInvalidControls(formData) {
    const invalid = [];
    const controls = formData.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (invalid.length > 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      console.log(invalid,' invalid');
    }
  }

  bidingDataInFormGroup(formGroup: FormGroup, dataBinding: any) {
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name)) {
          formGroup.controls[name].setValue(dataBinding[name]);
        }
      }
    }
  }

  setIndexArray(array: any[]) {
    if (array && array.length > 0) {
      array.forEach((item, index) => {
        item.idx = index;
      })
    }
  }

  public removeValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).clearValidators();
    }
  }
}
