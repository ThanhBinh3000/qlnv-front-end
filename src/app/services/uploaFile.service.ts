import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseData } from '../interfaces/response';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'UploadFile', '');
  }

  uploadFile(file: File, title?: string, folder?): Promise<any> {
    const url: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('folder', 'tcdt/' + folder);
    return this.httpClient.post<any>(url, formData).toPromise();
  }

  downloadFile(urlFile: string): Observable<Blob> {
    const url = `${environment.SERVICE_API}/qlnv-core/file/${urlFile}`;
    return this.httpClient.get(url, { responseType: 'blob' });
  }
}
