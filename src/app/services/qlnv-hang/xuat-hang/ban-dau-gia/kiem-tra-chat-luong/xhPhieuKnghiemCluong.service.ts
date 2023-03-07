import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/services/base.service';
import { Observable } from 'rxjs';
import { OldResponseData } from 'src/app/interfaces/response';
import { PATH } from 'src/app/constants/path';
@Injectable({
  providedIn: 'root',
})
export class XhPhieuKnghiemCluongService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.DAU_GIA + "/" + PATH.KNGHIEM_CLUONG, PATH.QLNV_HANG);
  }


}
