import { ResponseData } from '../interfaces/response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { TonKhoDauNamLuongThuc } from '../models/ThongTinChiTieuKHNam';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuKiemTraChatLuongHangService extends BaseService {
  GATEWAY = '/qlnv-gateway/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'QuanLyPhieuKiemTraChatLuongHang','');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/ql-phieu-kiem-tra-chat-luong-hang-lt?`;
    if (body.maDonVi)
      url_ += 'maDonVi=' + encodeURIComponent('' + body.maDonVi) + '&';
    if (body.maHangHoa)
      url_ += 'maHangHoa=' + encodeURIComponent('' + body.maHangHoa) + '&';
    if (body.maNganKho)
      url_ += 'maNganKho=' + encodeURIComponent('' + body.maNganKho) + '&';
    if (body.ngayKiemTraDenNgay)
      url_ +=
        'ngayKiemTraDenNgay=' +
        encodeURIComponent('' + body.ngayKiemTraDenNgay) +
        '&';
    if (body.ngayKiemTraTuNgay)
      url_ +=
        'ngayKiemTraTuNgay=' +
        encodeURIComponent('' + body.ngayKiemTraTuNgay) +
        '&';
    if (body.pageNumber)
      url_ +=
        'pageable.pageNumber=' + encodeURIComponent('' + body.pageNumber) + '&';
    if (body.offset)
      url_ += 'pageable.offset=' + encodeURIComponent('' + body.offset) + '&';
    if (body.pageSize)
      url_ +=
        'pageable.pageSize=' + encodeURIComponent('' + body.pageSize) + '&';
    if (body.paged)
      url_ += 'pageable.paged=' + encodeURIComponent('' + body.paged) + '&';
    if (body.sorted)
      url_ +=
        'pageable.sort.sorted=' + encodeURIComponent('' + body.sorted) + '&';
    if (body.unsorted)
      url_ +=
        'pageable.sort.unsorted=' +
        encodeURIComponent('' + body.unsorted) +
        '&';
    if (body.unpaged)
      url_ += 'pageable.unpaged=' + encodeURIComponent('' + body.unpaged) + '&';
    if (body.soPhieu)
      url_ += 'soPhieu=' + encodeURIComponent('' + body.soPhieu) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }
  themMoiChiTieuKeHoach(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam`;
    return this.httpClient.post(url, body).toPromise();
  }

  chinhSuaChiTieuKeHoach(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam`;
    return this.httpClient.put(url, body).toPromise();
  }
}
