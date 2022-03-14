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

  initDMChung(key): Promise<ResponseData<any>> {
    const url = `${environment.SERVICE_API}api/InitApp/GetOptionalSelectList?key=${key}`;
    return this.httpClient.get<ResponseData<any>>(url).toPromise();
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

  // Lãnh đạo ký phê duyệt
  exc_sign_approved(data, idVanBan, type, userName) {
    var prms = {};

    prms["FileUploadHandler"] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&loaiKy=${1}&userName=${userName}`;
    prms["SessionId"] = "";
    prms["FileName"] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_approved(json_prms, this.SignFileCallBack1);

  }

  // Ký nháy
  exc_sign_approved_kynhay(data, idVanBan, type, userName) {
    var prms = {};

    prms["FileUploadHandler"] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&loaiKy=${3}&userName=${userName}`;
    prms["SessionId"] = "";
    prms["FileName"] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_approved(json_prms, this.SignFileCallBack1);

  }

  // Văn thư ký phát hành
  exc_sign_issued(data, idVanBan, type, userName) {
    var prms = {};

    prms["FileUploadHandler"] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&loaiKy=${2}&userName=${userName}`;
    prms["SessionId"] = "";
    prms["FileName"] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;
    prms["DocNumber"] = "123";
    prms["IssuedDate"] = new Date();

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_issued(json_prms, this.SignFileCallBack1);

  }

  // Văn thư ký công văn đến
  vgca_sign_income(data, idVanBan, type, userName) {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}&userName=${userName}`;
    prms["SessionId"] = "";
    prms["FileName"] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_income(json_prms, this.SignFileCallBack1);

  }

  // Add Comment
  exc_comment(data, idVanBan, type) {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
    prms["SessionId"] = "";
    prms["FileName"] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_comment(json_prms, this.SignFileCallBack1);
  }

  // Ký tài liệu đính kèm
  exc_appendix(data, idVanBan, type) {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
    prms["SessionId"] = "";
    prms["FileName"] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFile?fileId=${data.id}`;
    prms["DocNumber"] = "123/BCY-CTSBMTT";
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_appendix(json_prms, this.SignFileCallBack1);
  }

  // Sao văn bản điện tử
  exc_sign_copy(data, idVanBan, type) {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = `${environment.SERVICE_API}api/QuanLyFilesServer/UploadFileKySo?id=${idVanBan}&fileName=${data.fileName}&type=${type}`;
    prms["SessionId"] = "";
    prms["FileName"] = `${environment.SERVICE_API}api/QuanLyFilesServer/DownloadFilePdf?fileId=${data.id}`;
    prms["DocNumber"] = "123/BCY-CTSBMTT";
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgcapluginObject.vgca_sign_copy(json_prms, this.SignFileCallBack1);
  }

  SignFileCallBack1(rv) {
    var received_msg = JSON.parse(rv);
    if (received_msg.Status == 0) {
      location.reload()
    }
  }

  delete_cols(ws, start_col, ncols) {
    var crefregex = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)([1-9]\d{0,5}|10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6])(?![_.\(A-Za-z0-9])/g;
    if (!ws) throw new Error("operation expects a worksheet");
    var dense = Array.isArray(ws);
    if (!ncols) ncols = 1;
    if (!start_col) start_col = 0;

    /* extract original range */
    var range = XLSX.utils.decode_range(ws["!ref"]);
    var R = 0, C = 0;

    var formula_cb = function ($0, $1, $2, $3, $4, $5) {
      var _R = XLSX.utils.decode_row($5), _C = XLSX.utils.decode_col($3);
      if (_C >= start_col) {
        _C -= ncols;
        if (_C < start_col) return "#REF!";
      }
      return $1 + ($2 == "$" ? $2 + $3 : XLSX.utils.encode_col(_C)) + ($4 == "$" ? $4 + $5 : XLSX.utils.encode_row(_R));
    };

    var addr, naddr;
    for (C = start_col + ncols; C <= range.e.c; ++C) {
      for (R = range.s.r; R <= range.e.r; ++R) {
        addr = XLSX.utils.encode_cell({ r: R, c: C });
        naddr = XLSX.utils.encode_cell({ r: R, c: C - ncols });
        if (!ws[addr]) { delete ws[naddr]; continue; }
        if (ws[addr].f) ws[addr].f = ws[addr].f.replace(crefregex, formula_cb);
        ws[naddr] = ws[addr];
      }
    }
    for (C = range.e.c; C > range.e.c - ncols; --C) {
      for (R = range.s.r; R <= range.e.r; ++R) {
        addr = XLSX.utils.encode_cell({ r: R, c: C });
        delete ws[addr];
      }
    }
    for (C = 0; C < start_col; ++C) {
      for (R = range.s.r; R <= range.e.r; ++R) {
        addr = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[addr] && ws[addr].f) ws[addr].f = ws[addr].f.replace(crefregex, formula_cb);
      }
    }

    /* write new range */
    range.e.c -= ncols;
    if (range.e.c < range.s.c) range.e.c = range.s.c;
    ws["!ref"] = XLSX.utils.encode_range(this.clamp_range(range));

    /* merge cells */
    if (ws["!merges"]) ws["!merges"].forEach(function (merge, idx) {
      var mergerange;
      switch (typeof merge) {
        case 'string': mergerange = XLSX.utils.decode_range(merge); break;
        case 'object': mergerange = merge; break;
        default: throw new Error("Unexpected merge ref " + merge);
      }
      if (mergerange.s.c >= start_col) {
        mergerange.s.c = Math.max(mergerange.s.c - ncols, start_col);
        if (mergerange.e.c < start_col + ncols) { delete ws["!merges"][idx]; return; }
        mergerange.e.c -= ncols;
        if (mergerange.e.c < mergerange.s.c) { delete ws["!merges"][idx]; return; }
      } else if (mergerange.e.c >= start_col) mergerange.e.c = Math.max(mergerange.e.c - ncols, start_col);
      this.clamp_range(mergerange);
      ws["!merges"][idx] = mergerange;
    });
    if (ws["!merges"]) ws["!merges"] = ws["!merges"].filter(function (x) { return !!x; });

    /* cols */
    if (ws["!cols"]) ws["!cols"].splice(start_col, ncols);
  }

  clamp_range(range) {
    if (range.e.r >= (1 << 20)) range.e.r = (1 << 20) - 1;
    if (range.e.c >= (1 << 14)) range.e.c = (1 << 14) - 1;
    return range;
  }
}