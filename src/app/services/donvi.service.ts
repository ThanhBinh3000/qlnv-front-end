import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';
import { last } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class DonviService extends BaseService {
  GATEWAY = '/qlnv-category';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-donvi', '/qlnv-category');
  }

  layTatCaDonVi(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/danh-sach/hoat-dong`;
    return this.httpClient.get<any>(url).toPromise();
  }

  layTatCaDonViByLevel(level): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/tat-ca/${level}`
    return this.httpClient.get<any>(url).toPromise();
  }

  layTatCaDonViCha(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/danh-sach/dvi-cha`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  layTatCaDviDmKho(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/danh-sach/dm-kho`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  layTatCaByMaDvi(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/danh-sach/all-tree`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  getDviTree(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/danh-sach/tree-node`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
  getAllChildrenByMadvi(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/danh-sach/children`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  layDonViCon(): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-category/dmuc-donvi/ds-donvi-child`;
    return this.httpClient.get<any>(url).toPromise();
  }

  layDonViChiCuc(): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-category/dmuc-donvi/ds-donvi-child`;
    return this.httpClient.get<any>(url).toPromise();
  }
  getLastMadvi(maDvi): Promise<any> {
    const url = `${environment.SERVICE_API}/qlnv-category/dmuc-donvi/last-madvi/${maDvi}`
    return this.httpClient.get<any>(url).toPromise();
  }


  getDonVi(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/chi-tiet`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  loadDonViTinh(): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-dvi-tinh/danh-sach/tat-ca`;
    return this.httpClient.get<any>(url).toPromise();
  }

  layTatCaDangTree(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/tat-ca-tree?maDviCha=${body.maDviCha}`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getDonViHangTree(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/don-vi-hang-view`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getDonViTheoMaCha(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/search-kho`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  updateThuKho(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/update-thu-kho`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  getDonViTheoIdThuKho(body): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dmuc-donvi/tat-ca/thu-kho`;
    return this.httpClient.post<any>(url, body).toPromise();
  }


  async layDonViTheoCapDo(
    body: any,
    capDv?: number | string,
  ): Promise<{ [capDv: string]: any[] }> {
    const dsDonViCha = await this.layTatCaDangTree(body);
    const data = dsDonViCha?.data || [];
    let dsTong: any[] = [];
    if (data.length) {
      for (const dvCha of data) {
        dsTong = [...dsTong, ...this._getChild(dvCha, capDv)];
      }

      return dsTong.reduce((prev, cur) => {
        if (!prev[cur.capDvi]) {
          prev[cur.capDvi] = [cur];
        } else {
          prev[cur.capDvi].push(cur);
        }

        return prev;
      }, {});
    }
    return null;
  }

  private _getChild(parent: any, capDv?: number | string): any {
    let parentTemp = parent;
    const result = [];
    const stack = [parentTemp];

    while (stack.length) {
      const parent = stack.pop();
      result.push(parent);
      if (parent.children?.length && parent.capDvi !== capDv) {
        for (const child of parent.children) {
          stack.push(child);
        }
      }
    }

    return result;
  }

  layPhanTuCha(dsTong, ptuHienTai: any): any {
    const maxLevel = Object.keys(dsTong)
      .filter((item) => item)
      .map((item) => Number(item))[0];
    const result = { [ptuHienTai.capDvi]: ptuHienTai };
    let maDviCha = ptuHienTai.maDviCha;
    for (let i = Number(ptuHienTai.capDvi); i >= maxLevel; i--) {
      let dsCha = dsTong[i].find((item) => item.key === maDviCha);
      if (dsCha) {
        result[i] = [dsCha];
        maDviCha = dsCha.maDviCha;
      }
    }

    return result;
  }

  layDsPhanTuCon(dsTong, ptuHienTai: any): any {
    const minLevel = last(
      Object.keys(dsTong)
        .filter((item) => item)
        .map((item) => Number(item)),
    );
    const result = { [ptuHienTai.capDvi]: ptuHienTai };
    let dsCha = [ptuHienTai.key];
    for (let i = Number(ptuHienTai.capDvi) + 1; i <= minLevel; i++) {
      let dsCon = dsTong[i].filter((item) => dsCha.includes(item.maDviCha));
      if (dsCon?.length) {
        result[i] = dsCon;
        dsCha = dsCon.map((item) => item.key);
      }
    }

    return result;
  }

  getTonKho(body: any): Promise<any> {
    let url_ = `${environment.SERVICE_API}/qlnv-luukho/lk-hang-trong-kho?`;
    // let url_ = `http://192.168.5.184:3333/hang-trong-kho/search?`;
    if (body.maChiCuc)
      url_ += 'maChiCuc=' + encodeURIComponent('' + body.maChiCuc) + '&';
    if (body.maDiemKho)
      url_ += 'maDiemKho=' + encodeURIComponent('' + body.maDiemKho) + '&';
    if (body.maNhaKho)
      url_ += 'maNhaKho=' + encodeURIComponent('' + body.maNhaKho) + '&';
    if (body.maNganKho)
      url_ += 'maNganKho=' + encodeURIComponent('' + body.maNganKho) + '&';
    if (body.maLokho)
      url_ += 'maLokho=' + encodeURIComponent('' + body.maLokho) + '&';
    if (body.chungLoaiHH)
      url_ += 'chungLoaiHH=' + encodeURIComponent('' + body.chungLoaiHH) + '&';
    if (body.loaiHH)
      url_ += 'loaiHH=' + encodeURIComponent('' + body.loaiHH) + '&';
    if (body.pageNumber != null || body.pageNumber != undefined)
      url_ += 'paggingReq.page=' + encodeURIComponent('' + (body.pageNumber - 1)) + '&';
    if (body.pageSize)
      url_ += 'paggingReq.limit=' + encodeURIComponent('' + body.pageSize) + '&';

    url_ = url_.replace(/[?&]$/, '');
    return this.httpClient.get<any>(url_).toPromise();
  }
}
