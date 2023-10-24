import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
	providedIn: 'root',
})
export class CapVonMuaBanTtthService extends BaseService {
	constructor(public httpClient: HttpClient) {
		super(httpClient, 'quanLyVonPhi', '');
	}

	urlDefault = environment.SERVICE_API + '/qlnv-khoachphi';

	//danh sach op dong
	dsachHopDong(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/hop-dong/danh-sach/ds-hop-dong',
			request,
		);
	}

	//search list bao cao
	timKiemVonMuaBan(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/cap-von-ghi-nhan/danh-sach',
			request,
		);
	}

	//xóa báo cáo nút xóa Báo cáo
	xoaVonMuaBan(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/cap-von-ghi-nhan/xoa',
			request
		);
	}

	//chi tiet ma phuong an
	ctietVonMuaBan(id: any): Observable<any> {
		return this.httpClient.get(
			this.urlDefault + '/cap-von-ghi-nhan/chi-tiet/' + id
		);
	}

	themMoiVonMuaBan(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/cap-von-ghi-nhan/them-moi',
			request);
	}

	//cap nhat phuong an
	capNhatVonMuaBan(requestUpdate: any): Observable<any> {
		return this.httpClient.put(
			this.urlDefault + '/cap-von-ghi-nhan/cap-nhat'
			, requestUpdate);
	}

	maCapVonUng(): Observable<any> {
		return this.httpClient.get(
			this.urlDefault + '/cap-von-ghi-nhan/sinh-ma'
		);
	}

	trinhDuyetVonMuaBan(request: any): Observable<any> {
		return this.httpClient.put(
			this.urlDefault + '/cap-von-ghi-nhan/trang-thai',
			request);
	}

	//chi tiet ma phuong an
	ctietThuChi(nam: number, maLoai: string): Observable<any> {
		return this.httpClient.get(
			this.urlDefault + '/cap-von-ghi-nhan/chi-tiet-thu-chi/' + nam.toString() + '/' + maLoai
		);
	}

	tongHopVonBan(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/cap-von-ghi-nhan/tong-hop',
			request);
	}

	soQdChiTieu(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/hop-dong/danh-sach/so-qdinh-ctieu',
			request,
		)
	}

	danhSachHopDong(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/hop-dong/danh-sach/so-qd',
			request,
		)
	}
}
