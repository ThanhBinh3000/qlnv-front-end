import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import Cleave from 'cleave.js';

import { environment } from 'src/environments/environment';
import { OldResponseData } from '../interfaces/response';
declare var vgcapluginObject: any;

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private httpClient: HttpClient) {}

  markFormGroupTouched(formGroup) {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
  }

  initDMChung(key): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/InitApp/GetOptionalSelectList?key=${key}`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  EnumToSelectList(key): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/InitApp/EnumToSelectList?key=${key}`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  dateValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value && !moment(control.value, 'DD/MM/YYYY', true).isValid()) {
      return { invalid: true };
    }
    return;
  };

  formatDate() {
    const datesCollection = <HTMLCollection>(
      document.getElementsByClassName('input-date')
    );
    let dates = Array.from(datesCollection);

    dates.forEach(function (date) {
      new Cleave(date, {
        date: true,
        delimiter: '/',
        datePattern: ['d', 'm', 'Y'],
      });
    });
  }

  // Lãnh đạo ký phê duyệt
  exc_sign_approved(data, idVanBan, type, userName) {
    var prms = {};

    prms['FileUploadHandler'] = `${
      environment.SERVICE_API
    }api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${
      data.fileName
    }&type=${type}&loaiKy=${1}&userName=${userName}`;
    prms['SessionId'] = '';
    prms[
      'FileName'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_approved(json_prms, this.SignFileCallBack1);
  }

  // Ký nháy
  exc_sign_approved_kynhay(data, idVanBan, type, userName) {
    var prms = {};

    prms['FileUploadHandler'] = `${
      environment.SERVICE_API
    }api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${
      data.fileName
    }&type=${type}&loaiKy=${3}&userName=${userName}`;
    prms['SessionId'] = '';
    prms[
      'FileName'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_approved(json_prms, this.SignFileCallBack1);
  }

  // Văn thư ký phát hành
  exc_sign_issued(data, idVanBan, type, userName) {
    var prms = {};

    prms['FileUploadHandler'] = `${
      environment.SERVICE_API
    }api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${
      data.fileName
    }&type=${type}&loaiKy=${2}&userName=${userName}`;
    prms['SessionId'] = '';
    prms[
      'FileName'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;
    prms['DocNumber'] = '123';
    prms['IssuedDate'] = new Date();

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_issued(json_prms, this.SignFileCallBack1);
  }

  // Văn thư ký công văn đến
  vgca_sign_income(data, idVanBan, type, userName) {
    var prms = {};
    var scv = [{ Key: 'abc', Value: 'abc' }];

    prms[
      'FileUploadHandler'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&userName=${userName}`;
    prms['SessionId'] = '';
    prms[
      'FileName'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;
    prms['MetaData'] = scv;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_income(json_prms, this.SignFileCallBack1);
  }

  // Add Comment
  exc_comment(data, idVanBan, type) {
    var prms = {};
    var scv = [{ Key: 'abc', Value: 'abc' }];

    prms[
      'FileUploadHandler'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
    prms['SessionId'] = '';
    prms[
      'FileName'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;
    prms['MetaData'] = scv;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_comment(json_prms, this.SignFileCallBack1);
  }

  // Ký tài liệu đính kèm
  exc_appendix(data, idVanBan, type) {
    var prms = {};
    var scv = [{ Key: 'abc', Value: 'abc' }];

    prms[
      'FileUploadHandler'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
    prms['SessionId'] = '';
    prms[
      'FileName'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;
    prms['DocNumber'] = '123/BCY-CTSBMTT';
    prms['MetaData'] = scv;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_appendix(json_prms, this.SignFileCallBack1);
  }

  // Sao văn bản điện tử
  exc_sign_copy(data, idVanBan, type) {
    var prms = {};
    var scv = [{ Key: 'abc', Value: 'abc' }];

    prms[
      'FileUploadHandler'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
    prms['SessionId'] = '';
    prms[
      'FileName'
    ] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFilePdf?fileId=${data.id}`;
    prms['DocNumber'] = '123/BCY-CTSBMTT';
    prms['MetaData'] = scv;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_copy(json_prms, this.SignFileCallBack1);
  }

  SignFileCallBack1(rv) {
    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
      location.reload();
    }
  }
}
