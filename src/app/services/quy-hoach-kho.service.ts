import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class QuyHoachKhoService extends BaseService{

  // gateway: string = '/qlnv-kho'
  gateway: string = ''

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-quy-hoach-kho/qd-quy-hoach', '');
  }

  danhSachQdGoc() {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/qd-goc`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  danhMucChungGetAll(loai: string): Promise<any> {
    const url = `http://192.168.1.80:8888/qlnv-category/dmuc-chung/danh-sach/${loai}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  layTatCaDangTree(body): Promise<any> {
    const url = `http://192.168.1.80:8888/qlnv-category/dmuc-donvi/tat-ca-tree?maDviCha=${body.maDviCha}`;
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


}
