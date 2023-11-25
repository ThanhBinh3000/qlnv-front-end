import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../constants/message';

@Injectable({
  providedIn: 'root',
})
export class QuanLyVonPhiService extends BaseService {
  constructor(
    public httpClient: HttpClient,
    private notification: NzNotificationService
  ) {
    super(httpClient, 'quanLyVonPhi', '');
  }

  urlDefault = environment.SERVICE_API;

  //lay danh muc don vi con theo ma don vi vho trc
  dmDviCon(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-donvi/tat-ca',
      request,
    )
  }

  dmKho(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-donvi/danh-sach/all-tree',
      request
    )
  }

  // upload file to server
  uploadFile(request: FormData): Observable<any> {
    const headerss = new HttpHeaders().set('Content-Type', 'multipart/form-data').set('Access-Control-Allow-Origin', '*');
    return this.httpClient.post(
      this.urlDefault + '/qlnv-core/file/upload-attachment',
      request,
      { 'headers': headerss }
    );
  }

  async upFile(file: File, path: string, noiDung?: string) {
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', path);
    const temp = await this.uploadFile(upfile).toPromise().then(
      (data) => {
        const objfile = {
          fileName: data.filename,
          fileSize: data.size,
          fileUrl: data.url,
          noiDung: noiDung,
        }
        return objfile;
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    return temp;
  }

  //download file tu he thong chung
  downloadFile(fileUrl: any): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-core/file/' + fileUrl, { responseType: 'blob' });
  }

  async downFile(file, doc) {
    if (doc.fileUrl) {
      await this.downloadFile(doc.fileUrl).toPromise().then(
        (data) => {
          let fileName = doc.fileName;
          if (fileName.split('.').length == 1) {
            fileName = doc.fileName + doc.fileUrl.substring(doc.fileUrl.lastIndexOf('.'))
          }
          fileSaver.saveAs(data, fileName);
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  getListUser(): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/chung/can-bo');
  }

  getDinhMuc(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/chung/dinh-muc',
      request,
    )
  }
}
