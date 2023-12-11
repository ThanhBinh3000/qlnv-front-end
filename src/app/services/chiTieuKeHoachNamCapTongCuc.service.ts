import {OldResponseData, ResponseData} from './../interfaces/response';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BaseService} from './base.service';
import {Observable} from 'rxjs';
import {TonKhoDauNamLuongThuc} from '../models/ThongTinChiTieuKHNam';

@Injectable({
  providedIn: 'root',
})
export class ChiTieuKeHoachNamCapTongCucService extends BaseService {
  GATEWAY = '/qlnv-khoach';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ChiTieuKeHoachNamCapTongCuc', '');
  }

  timKiem(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam?`;
    if (body.donViId)
      url_ += 'donViId=' + encodeURIComponent('' + body.donViId) + '&';
    if (body.maDvi)
      url_ += 'maDvi=' + encodeURIComponent('' + body.maDvi) + '&';
    if (body.capDvi)
      url_ += 'capDvi=' + encodeURIComponent('' + body.capDvi) + '&';
    if (body.loaiQuyetDinh)
      url_ += 'loaiQuyetDinh=' + encodeURIComponent('' + body.loaiQuyetDinh) + '&';
    if (body.ngayKyTuNgay)
      url_ +=
        'ngayKyTuNgay=' + encodeURIComponent('' + body.ngayKyTuNgay) + '&';
    if (body.ngayKyDenNgay)
      url_ +=
        'ngayKyDenNgay=' + encodeURIComponent('' + body.ngayKyDenNgay) + '&';
    if (body.soQD) url_ += 'soQD=' + encodeURIComponent('' + body.soQD) + '&';
    if (body.tenDvi)
      url_ += 'tenDonVi=' + encodeURIComponent('' + body.tenDvi) + '&';
    if (body.trichYeu)
      url_ += 'trichYeu=' + encodeURIComponent('' + body.trichYeu) + '&';
    if (body.namKeHoach)
      url_ += 'namKeHoach=' + encodeURIComponent('' + body.namKeHoach) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ +=
        'paggingReq.page=' +
        encodeURIComponent('' + (body.pageNumber - 1)) +
        '&';
    if (body.pageSize)
      url_ +=
        'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';
    if (body.trangThai)
      url_ += 'trangThai=' + encodeURIComponent('' + body.trangThai) + '&';
    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadThongTinChiTieuKeHoachNam(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  importFile(body: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', body, body.name);
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/import`;
    return this.httpClient.post(url, formData).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/status`;
    return this.httpClient.put(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/export/list`;
    return this.httpClient.post(url, body, {responseType: 'blob'});
  }

  deleteData(id: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/${id}`;
    return this.httpClient.delete(url).toPromise();
  }

  themMoiChiTieuKeHoach(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam`;
    return this.httpClient.post(url, body).toPromise();
  }

  chinhSuaChiTieuKeHoach(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam`;
    return this.httpClient.put(url, body).toPromise();
  }

  tonKhoDauNam(body: any): Promise<ResponseData<Array<TonKhoDauNamLuongThuc>>> {
    const url = `${environment.SERVICE_API}/qlnv-kho/kt-tinhtrang-hienthoi/thong-tin`;
    return this.httpClient.post(url, body).toPromise();
  }

  downloadFile(): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/download/import-template`;
    return this.httpClient.post(url, null, {responseType: 'blob'});
  }

  downloadFileKeHoach(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}/qlnv-core/file/download`;
    return this.httpClient.post(url, body, {responseType: 'blob'});
  }

  deleteMultiple(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/delete/multiple`;
    return this.httpClient.post(url, body).toPromise();
  }

  getCountChiTieu(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/count`;
    return this.httpClient.get(url).toPromise();
  }

  loadThongTinChiTieuKeHoachCucNam(namKh: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/dxkh-lcnt/${namKh}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadThongTinChiTieuKeHoachTheoNamVaDonVi(namKh: number, maDvi: string): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/dxkh-lcnt/${namKh}/${maDvi}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  loadThongTinChiTieuKeHoachTongCucGiao(body: any): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/chi-tieu-cua-tong-cuc`;
    return this.httpClient.post(url_, body).toPromise();
  }

  getCtieuKhoach(namKh) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/ct-kh-nam/khoi-luong-nhap-xuat/${namKh}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  loadThongTinChiTieuKeHoachVtNam(namKh: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/dxkh-lcnt/vt/${namKh}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  canCuBTCGiaoTCDT(namKh: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/qd-btc-giao-tcdt/${namKh}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  canCuCucQd(namKh: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/ct-kh-tc/${namKh}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  canCuCucPa(namKh: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/pa-ct-kh-duoc-giao/${namKh}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  chiTeuPag(namKh: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/ct-kh-tc-pag/${namKh}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  trangThaiHienThoi(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-luukho/hang-trong-kho/trang-thai-ht`;
    return this.httpClient.post(url, body).toPromise();
  }

  xemTruocCtKhNamLuongThuc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/preview/ke-hoach-luong-thuc`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  xemTruocCtKhNamMuoi(body) {
    const url = `${environment.SERVICE_API}/qlnv-report/ct-kh-preview/xem-truoc-ct-kh-muoi`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  xemTruocCtKhNamVatTu(body) {
    const url = `${environment.SERVICE_API}/qlnv-report/ct-kh-preview/xem-truoc-ct-kh-vat-tu`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  xuatBaoCaoNhapVt(body: any): Promise<HttpResponse<Blob>> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/report-nhap-vt`;
    return this.httpClient.post(url, body, {responseType: 'blob', observe: 'response'}).toPromise();
  }

  xemTruocCtKhNamTheoCuc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/chi-tieu-ke-hoach-nam/preview/xem-truoc-ct-kh-theo-cuc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
