import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "../../base.service";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class TongHopPhuongAnGiaService extends BaseService {
  gateway: string = "/qlnv-khoach";

  constructor(public httpClient: HttpClient) {
    super(httpClient, "phuong-an-gia/tong-hop", "/qlnv-khoach");

  }

  tongHop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/tong-hop`;
    return this.httpClient.post(url, body).toPromise();
  }

  loadToTrinhDeXuat(body: any) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/tong-hop/ds-tt-dx`;
    return this.httpClient.post<any>(url, body).toPromise();
  }
}
