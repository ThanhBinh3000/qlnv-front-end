import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class TongHopPhuongAnGiaService extends BaseService {
  gateway: string = "/qlnv-khoach";

  constructor(public httpClient: HttpClient) {
    super(httpClient, "phuong-an-gia/tong-hop", "/qlnv-khoach");

  }

  loadToTrinhDeXuat(body: any) {
    const url = `${environment.SERVICE_API}${this.gateway}/phuong-an-gia/tong-hop/danh-sach`;
    return this.httpClient.post<any>(url, body).toPromise();

  }

  loadToTrinhDeXuatThongTinGia(id: number) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/tong-hop/danh-sach/chi-tiet/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  tongHop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/tong-hop`;
    return this.httpClient.post(url, body).toPromise();
  }
}
