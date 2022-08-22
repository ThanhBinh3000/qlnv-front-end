import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BaseService } from "./base.service";

@Injectable({
  providedIn: "root"
})
export class DanhMucService extends BaseService {
  gateway: string = "/qlnv-category";
  constructor(public httpClient: HttpClient) {
    super(httpClient, "dm-hang", "/qlnv-category");
  }

  loadDanhMucHangHoa() {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-hang/danh-sach`;
    return this.httpClient.post<any>(url, null);
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

  danhSachTieuChuanTheoMaHh(loaiVthh: string): Promise<any> {
    const url = `${environment.SERVICE_API}${this.gateway}/dm-tieu-chuan/chi-tiet/ma-hh/${loaiVthh}`;
    return this.httpClient.get<any>(url).toPromise();
  }
}
