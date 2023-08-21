import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from "../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class DanhMucService extends BaseService {
  gateway: string = '/qlnv-category'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dm-hang', '/qlnv-category');
  }

  loadDsDiaDanhByCap(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/dm-dia-danh/danh-sach`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  loadDanhMucHangHoa() {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/danh-sach`;
    return this.httpClient.post<any>(url, null);
  }

  timKiem(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/hop-dong/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  delete(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xoa/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  loadDanhMucHangHoaAsync(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/danh-sach`;
    return this.httpClient.post<any>(url, null).toPromise();
  }

  loadDanhMucHangHoaTheoMaCha(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/danh-sach/ma-cha`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  loadDanhMucHangGiaoChiTieu(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/gct-vat-tu`;
    return this.httpClient.post<any>(url, null).toPromise();
  }

  loaiVatTuHangHoaGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/LOAI_HHOA`;
    return this.httpClient.get<any>(url).toPromise();
  }

  getAllVthhByCap(cap): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/danh-sach/cap/${cap}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  phuongThucDauThauGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/PT_DTHAU`;
    return this.httpClient.get<any>(url).toPromise();
  }

  nguonVonGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/NGUON_VON`;
    return this.httpClient.get<any>(url).toPromise();
  }

  hinhThucDauThauGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/HT_LCNT`;
    return this.httpClient.get<any>(url).toPromise();
  }

  loaiHopDongGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/LOAI_HDONG`;
    return this.httpClient.get<any>(url).toPromise();
  }

  danhMucDonViGetAll(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-donvi/danh-sach/tat-ca`;
    return this.httpClient.get<any>(url).toPromise();
  }

  danhMucChungGetAll(loai: string): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach/${loai}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  danhMucThuKhoGetList(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-thukho/danh-sach`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  danhMucLoaiKhoGetList(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-lh-kho/danh-sach`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  danhMucPhuongThucBaoQuanGetList(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-pthuc-bquan/danh-sach`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  loadDanhMucHinhThucBaoQuan(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-hthuc-bquan/findList`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  traCuuTieuChuanKyThuat(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-tieu-chuan/tra-cuu`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  danhSachTieuChuan(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-tieu-chuan/danh-sach`;
    return this.httpClient.get<any>(url).toPromise();
  }

  loadDanhMucHangChiTiet(id: string): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/chi-tiet/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  layTatCaHangHoaDviQly(type): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/danh-sach/all-dvql/${type}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  layTatCaDviQly(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dm-hang/dvql`
    return this.httpClient.get<any>(url).toPromise();
  }

  getDanhMucHangDvql(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/search-all`;
    return this.httpClient.post<any>(url, body);
  }

  getDanhMucHangHoaDvql(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/search-all-ma`;
    return this.httpClient.post<any>(url, body);
  }

  getDanhMucHangDvqlAsyn(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/search-all`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  danhMucChungTheoPhanHe(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dmuc-chung/danh-sach-theo-phan-he`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getLastMaHang(ma): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-category/dm-hang/last-mahh/${ma}`
    return this.httpClient.get<any>(url).toPromise();
  }

  getDSMatHang(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-category/dmuc-congcu/tra-cuu`
    return this.httpClient.post<any>(url, body).toPromise();
  }

}
