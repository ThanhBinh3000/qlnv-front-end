import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BcNhapXuatMuaBanHangDTQGService extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-nhap-xuat-mua-ban-hang-dtqg', '');
  }

  baoCaoTienDoNhapHang(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-tien-do-nhap-gao`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  baoCaoChiTietXuatGaoHotro(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-chi-tiet-xuat-gao-hotro-diaphuong`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  baoCaoNhapXuatTon(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/nhap-xuat-ton-gao`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  baoCaoTienDoBdgThocGaoTheoNam(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tien-do-bdg-thoc-gao-theo-nam`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  keHoachHoTroGaoHocSinh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ke-hoach-ho-tro-gao-hoc-sinh`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  ketQuaHoTroGaoHocSinh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-qua-ho-tro-gao-hoc-sinh`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcThongTinDthauMuaVt(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc_thong_tin_dau_thau_mua_vt`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  kquaNhapVt(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/kqua-nhap-vt`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  tienDoBdgThocTheoNamNhapKho(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tien-do-ban-thoc-theo-nam`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  tongHopTonKhoVatTu(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tong-hop-ton-kho-vat-tu`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  ketQuaXuatCapVatTu(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-qua-xuat-cap-vat-tu`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  bcBanThocThuocKeHoachNam(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-ban-thoc-thuoc-kh-nam`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  bcDanhSachNhaThauUyTin(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-ds-nha-thau-uy-tin`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  bcThKetQuaDauThauMuaGao(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-th-kq-dau-thau-mua-gao`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  bcKqXuatGaoCthtDiaPhuongNam(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-kq-xuat-gao-ctht-dp-nam`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  bcTienDoXuatGaoHoTroHocSinh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-tien-do-xuat-gao-hotro-hocsinh`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

}
