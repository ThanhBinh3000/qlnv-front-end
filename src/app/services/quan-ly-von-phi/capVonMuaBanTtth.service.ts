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

	urlDefault = environment.SERVICE_API;

	//danh sach op dong
	dsachHopDong(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/qlnv-khoachphi/hop-dong/danh-sach/ds-hop-dong',
			// 'http://192.168.1.107:30101/hop-dong/danh-sach/ds-hop-dong',
			request,
		);
	}

	//search list bao cao
	timKiemVonMuaBan(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/qlnv-khoachphi/cap-von-ghi-nhan/danh-sach',
			// 'http://192.168.1.107:30101/cap-von-ghi-nhan/danh-sach',
			request,
		);
	}

	//xóa báo cáo nút xóa Báo cáo
	xoaVonMuaBan(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/qlnv-khoachphi/cap-von-ghi-nhan/xoa',
			// 'http://192.168.1.107:30101/cap-von-ghi-nhan/xoa',
			request
		);
	}

	// maNopTienVon(): Observable<any> {
	// 	return this.httpClient.get(
	// 		this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/sinh-ma/nop-tien-von'
	// 	);
	// }

	//chi tiet ma phuong an
	ctietVonMuaBan(id: any): Observable<any> {
		return this.httpClient.get(
			this.urlDefault + '/qlnv-khoachphi/cap-von-ghi-nhan/chi-tiet/' + id
			// 'http://192.168.1.107:30101/cap-von-ghi-nhan/chi-tiet/' + id,
		);
	}

	themMoiVonMuaBan(request: any): Observable<any> {
		return this.httpClient.post(
			this.urlDefault + '/qlnv-khoachphi/cap-von-ghi-nhan/them-moi',
			// 'http://192.168.1.107:30101/cap-von-ghi-nhan/them-moi',
			request);
	}

	//cap nhat phuong an
	capNhatVonMuaBan(requestUpdate: any): Observable<any> {
		return this.httpClient.put(
			this.urlDefault + '/qlnv-khoachphi/cap-von-ghi-nhan/cap-nhat'
			// 'http://192.168.1.107:30101/cap-von-ghi-nhan/cap-nhat'
			, requestUpdate);
	}

	// //search list bao cao
	// timKiemCapVon(request: any): Observable<any> {
	// 	return this.httpClient.post(
	// 		this.urlDefault + '/qlnv-khoachphi/cap-ung-von/danh-sach',
	// 		request,
	// 	);
	// }

	maCapVonUng(): Observable<any> {
		return this.httpClient.get(
			this.urlDefault + '/qlnv-khoachphi/cap-von-ghi-nhan/sinh-ma'
			// 'http://192.168.1.107:30101/cap-von-ghi-nhan/sinh-ma'
		);
	}

	// //xóa báo cáo nút xóa Báo cáo
	// xoaCapVon(request: any): Observable<any> {
	// 	return this.httpClient.post(
	// 		this.urlDefault + '/qlnv-khoachphi/cap-ung-von/xoa',
	// 		request
	// 	);
	// }

	// //chi tiet ma phuong an
	// ctietCapVon(id: any): Observable<any> {
	// 	return this.httpClient.get(
	// 		this.urlDefault + '/qlnv-khoachphi/cap-ung-von/chi-tiet/' + id
	// 		// 'http://192.168.1.142:30101/cap-ung-von-dvi-cap-duoi/chi-tiet/' + id
	// 	);
	// }

	trinhDuyetVonMuaBan(request: any): Observable<any> {
		return this.httpClient.put(
			this.urlDefault + '/qlnv-khoachphi/cap-von-ghi-nhan/trang-thai',
			// 'http://192.168.1.107:30101/cap-von-ghi-nhan/trang-thai',
			request);
	}

	// trinhDuyetCapVon(request: any): Observable<any> {
	// 	return this.httpClient.put(
	// 		this.urlDefault + '/qlnv-khoachphi/cap-ung-von/trang-thai',
	// 		request);
	// }

	// taoMoiCapVon(request: any): Observable<any> {
	// 	return this.httpClient.post(
	// 		this.urlDefault + '/qlnv-khoachphi/cap-ung-von/them-moi',
	// 		// 'http://192.168.1.142:30101/cap-ung-von-dvi-cap-duoi/them-moi',
	// 		request);
	// }

	// updateCapVon(request: any): Observable<any> {
	// 	return this.httpClient.put(
	// 		this.urlDefault + '/qlnv-khoachphi/cap-ung-von/cap-nhat',
	// 		// 'http://192.168.1.142:30101/cap-ung-von-dvi-cap-duoi/cap-nhat',
	// 		request,
	// 	);
	// }

	// capTatCa(request: any): Observable<any> {
	// 	return this.httpClient.post(
	// 		this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/them-moi/danh-sach',
	// 		request);
	// }

	// maThanhToan(): Observable<any> {
	// 	return this.httpClient.get(
	// 		this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/sinh-ma/thanh-toan'
	// 	);
	// }
}
