import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
  providedIn: 'root',
})
export class GiaoDuToanChiService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quanLyVonPhi', '');
  }
  urlTest = 'http://localhost:9159';
  urlDefault = environment.SERVICE_API + '/qlnv-khoachphi';


  //search list bao cao giao du toan chi
  timBaoCaoGiao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/bao_cao_du_toan/danh-sach',
      request,
    );
  };

  //search list bao cao giao du toan chi
  timPhuongAnGiao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/giao_du_toan/danh-sach',
      request,
    );
  };

  //search list bao cao giao du toan chi
  timBaoCaoGiao1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/giao_du_toan/danh-sach',
      'http://localhost:9159/bao_cao_du_toan/danh-sach',
      request,
    );
  };


  // call api chi tiết báo cáo giao dự toán chi nsnn
  QDGiaoChiTiet(id: any, maLoai: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/giao_du_toan/chi-tiet/' + id + '?maLoai=' + maLoai,
    );
  };

  // call api chi tiết báo cáo giao dự toán chi nsnn
  QDGiaoChiTiet1(id: any, maLoai: string): Observable<any> {
    return this.httpClient.get(
      'http://localhost:9159/giao_du_toan/chi-tiet/' + id + '?maLoai=' + maLoai,
    );
  };


  // trinh duyet giao du toan chi nsnn
  giaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/giao_du_toan/them-moi',
      request,
    );
  };

  // trinh duyet giao du toan chi nsnn
  giaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://localhost:9159/giao_du_toan/them-moi',
      request,
    );
  };

  // update list giao du toan
  updateLapThamDinhGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/giao_du_toan/cap-nhat',
      request,
    );
  };
  // update list giao du toan
  updateLapThamDinhGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.put(
      'http://localhost:9159/giao_du_toan/cap-nhat',
      request,
    );
  };

  //tong hop giao du toan
  tongHopGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/bao_cao_du_toan/tong-hop',
      // 'http://192.168.1.228:30101/bao_cao_du_toan/tong-hop',
      request,
    );
  };

  //tong hop giao du toan
  tongHopGiaoThucTe(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/giao_du_toan/tong-hop',
      // 'http://192.168.1.228:30101/bao_cao_du_toan/tong-hop',
      request,
    );
  };
  tongHopGiaoThucTe1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://localhost:9159/giao_du_toan/tong-hop',
      request,
    );
  };
  //tong hop giao du toan
  tongHopGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://localhost:9159/bao_cao_du_toan/tong-hop',
      request,
    );
  };

  //tao ma PA giao du toan chi NSNN
  maPhuongAnGiao(maLoai: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/giao_du_toan/sinh-ma?maLoai=' + maLoai
    );
  };
  //tao ma PA giao du toan chi NSNN
  maPhuongAnGiao1(maLoai: string): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.101:8094/giao_du_toan/sinh-ma?maLoai=' + maLoai
    );
  };

  //tao ma giao( giao du toan chi NSNN)
  maGiaoGiaoDuToanChi(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/giao_du_toan/sinh-ma-giao-so'
    );
  };

  //tao ma giao( giao du toan chi NSNN)
  maGiaoGiaoDuToanChi1(): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.105:8094/giao_du_toan/sinh-ma-giao-so'
    );
  };

  // tim kiem danh sach ma phuong an giao dieu chinh du toan NSNN
  timKiemMaPaGiaoNSNN(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/giao_du_toan/danh-sach/phuong-an-duyet'
      // 'http://192.168.1.103:8094/giao_du_toan/danh-sach/phuong-an-duyet'
    );
  };
  // tim kiem danh sach ma phuong an giao dieu chinh du toan NSNN
  timKiemMaPaGiaoNSNN1(): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/giao_du_toan/danh-sach/phuong-an-duyet'
      'http://192.168.1.105:8094/giao_du_toan/danh-sach/phuong-an-duyet'
    );
  };

  //giao so tran chi trong Giao du toan NSNN
  giaoSoTranChiGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/giao_du_toan/giao-so'
      , request);
  };
  //giao so tran chi trong Giao du toan NSNN
  giaoSoTranChiGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://localhost:9159/giao_du_toan/giao-so'
      , request);
  };

  //nhap so QD giao du toan chi NSNN
  themMoiQdCvGiaoNSNN(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/giao_du_toan/them-moi/qd-cv'
      , request);
  };
  //nhap so QD giao du toan chi NSNN
  themMoiQdCvGiaoNSNN1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.228:30101/giao_du_toan/them-moi/qd-cv'
      , request);
  };

  //tim kiem giao danh sách nội dung khoản mục
  xoaBanGhiGiaoBTC(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/bao_cao_du_toan/xoa',
      request
    )
  };
  xoaBanGhiGiaoBTC2(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/giao_du_toan/xoa',
      request
    )
  };

  //tim kiem giao danh sách nội dung khoản mục
  xoaBanGhiGiaoBTC1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://localhost:9159/bao_cao_du_toan/xoa',
      request
    )
  };

  // trinh duyet phuong an giao phan bo du toan NSNN
  trinhDuyetPhuongAnGiao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/giao_du_toan/trang-thai',
      request);
  };
  // trinh duyet phuong an giao phan bo du toan NSNN
  trinhDuyetPhuongAnGiao1(request: any): Observable<any> {
    return this.httpClient.put(
      'http://192.168.1.101:30101/giao_du_toan/trang-thai',
      request);
  };

  //search list phan bo du toan giao chi nsnn
  timDanhSachPhanBo(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qd-giao-phan-bo-dtoan/danh-sach-phan-bo',
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-phan-bo',
      request,
    );
  }

  // call api nút chức năng giao dự toán chi NSNN
  approveGiao(request: any): Observable<any> {
    return this.httpClient.put(
      // 'http://192.168.1.110:8094/lap-tham-dinh-du-toan/chuc-nang',
      // 'http://192.168.1.125:8094/lap-tham-dinh-du-toan/chuc-nang',
      // this.urlDefault + '/lap-tham-dinh-du-toan/chuc-nang',
      "http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/chuc-nang",
      request,
    );
  }
  //tim kiem giao danh sách nội dung khoản mục
  timDanhSachBCGiaoBTCPD(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc'
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc'
    )
  }
  //tim kiem giao danh sách nội dung khoản mục
  timDanhSachBCGiaoBTCPD1(): Observable<any> {
    return this.httpClient.get(
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc',
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc',

    )
  }

  // tim kiem danh sach quyet dinh giao phan bo du toan 3.2.6
  timKiemGiaoPhanBo(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qd-giao-phan-bo-dtoan/danh-sach',
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach',
      request,
    );
  }
  // tim kiem danh sach quyet dinh giao phan bo du toan 3.2.6
  timKiemGiaoPhanBo1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach',
      request,
    );
  }

  // call api chi tiết báo cáo
  chiTietPhanBo(id: any): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/chi-tiet/' + id,
    );
  }
  // tim kiem danh sach quyet dinh giao phan bo du toan 3.2.6
  dsPaTongHop(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/bao_cao_du_toan/danh-sach/phuong-an-tiep-nhan', request
      // 'http://192.168.1.228:30101/bao_cao_du_toan/danh-sach/phuong-an-tiep-nhan', request
    );
  };

  dsPaTongHopGiao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/giao_du_toan/danh-sach/phuong-an-tiep-nhan', request
      // 'http://192.168.1.228:30101/bao_cao_du_toan/danh-sach/phuong-an-tiep-nhan', request
    );
  };

  dsPaTongHop1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://localhost:9159/bao_cao_du_toan/danh-sach/phuong-an-tiep-nhan', request
    );
  };

  // luong bao cao

  // trinh duyet giao du toan chi nsnn
  taoMoiBaoCao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/bao_cao_du_toan/them-moi',
      request,
      // 'http://192.168.1.228:30101/bao_cao_du_toan/them-moi', request
    );
  };
  // trinh duyet giao du toan chi nsnn
  taoMoiBaoCao1(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/bao_cao_du_toan/them-moi', request
      // 'http://192.168.1.228:30101/bao_cao_du_toan/them-moi', request
    );
  };

  chiTietBaoCao(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/bao_cao_du_toan/chi-tiet/' + id,
      // 'http://192.168.1.228:30101/bao_cao_du_toan/chi-tiet/' + id,
    );
  }
  chiTietBaoCao1(id: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/bao_cao_du_toan/chi-tiet/' + id,
      'http://localhost:9159/bao_cao_du_toan/chi-tiet/' + id,
    );
  }

  SinhMaBaoCao(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/bao_cao_du_toan/sinh-ma',
      // 'http://192.168.1.228:30101/bao_cao_du_toan/sinh-ma',
    );
  }

  // call api nút lưu phụ lục
  updateCTietBcao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/bao_cao_du_toan/chi-tiet/cap-nhat',
      // "http://192.168.1.228:30101/bao_cao_du_toan/chi-tiet",
      request,
    );
  }

  // call api nút lưu phụ lục
  approveCtietBcao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/bao_cao_du_toan/chi-tiet/phe-duyet',
      // "http://192.168.1.103:8094/bao_cao_du_toan/chi-tiet/phe-duyet",
      request,
    );
  }
  // update list giao du toan
  updateBaoCaoGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/bao_cao_du_toan/cap-nhat',
      // "http://192.168.1.228:30101/bao_cao_du_toan/cap-nhat",
      request,
    );
  };

  // trinh duyet phuong an giao phan bo du toan NSNN
  approveBcao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/bao_cao_du_toan/trang-thai',
      request);
  };

  ctietBieuMau(id: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/bao_cao_du_toan/chi-tiet/bieu-mau/' + id,
    );
  };

  addHistory(id: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/bao_cao_du_toan/sao-chep/' + id,
    );
  }

  restoreReport(cId: string, rId: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/bao_cao_du_toan/phuc-hoi/currentId=' + cId + '/recoverId=' + rId,
    );
  }

}
