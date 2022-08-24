import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyThongTinQuyetToanVonPhiHangDTQGService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quanLyThongTinQuyetToanVonPhiHangDTQGService','');
  }

  urlDefault = environment.SERVICE_API;

 
    tonghopsolieuquyettoanvonmuahangDTQG(request:any):Observable<any>{
        return this.httpClient.post('http://192.168.1.125:8094/quyet-toan/them-moi',request);
    }

    chitiettonghopsolieuquyettoanvonmuahangDTQG(id:any):Observable<any>{
      return this.httpClient.get('http://192.168.1.125:8094/quyet-toan/chi-tiet/'+id);
    }

    capnhattonghopsolieuquyettoanvonmuahangDTQG(request:any):Observable<any>{
      return this.httpClient.put('http://192.168.1.125:8094/quyet-toan/cap-nhat/',request);
    }

    //search list danh sach de nghi cap von
    timDsachTongHopSoLieuQuyetToan(request: any): Observable<any> {
      return this.httpClient.post('http://192.168.1.125:8094/quyet-toan/danh-sach', request);
    }

    //tim danh sach dieu chinh so lieu sau quyet toan
    timDsachDieuChinhSoLieuSauQuyetToan(request:any):Observable<any>{
      return this.httpClient.post('http://192.168.1.125:8094/dieu-chinh-sau-quyet-toan/danh-sach',request);
    }

    //them moi dieu chinh so lieu sau quyet toan
    dieuchinhsolieusauquyettoan(request:any):Observable<any>{
      return this.httpClient.post('http://192.168.1.125:8094/dieu-chinh-sau-quyet-toan/them-moi',request);
    }

    //cập nhật điều chỉnh so lieu sau quyet toan
    capnhatdieuchinhsolieusauquyettoan(request:any):Observable<any>{
      return this.httpClient.put('http://192.168.1.125:8094/dieu-chinh-sau-quyet-toan/cap-nhat',request);
    }

    //chi tiet dieu chinh so lieu sau quyet toan
    chitietdieuchinhsolieu(id:any):Observable<any>{
      return this.httpClient.get('http://192.168.1.125:8094/dieu-chinh-sau-quyet-toan/chi-tiet/'+id);
    }

    //xoa dieu chinh so lieu sau quyet toan

    xoadieuchinhsolieu(id:any):Observable<any>{
      return this.httpClient.delete('http://192.168.1.125:8094/dieu-chinh-sau-quyet-toan/xoa/'+id);
    }

    //xoa tong hop so lieu quyet toan

    xoatonghopsolieu(id:any):Observable<any>{
      return this.httpClient.delete('http://192.168.1.125:8094/quyet-toan/xoa/'+id)
    }
}