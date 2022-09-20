import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogBaoCaoCopyComponent } from 'src/app/components/dialog/dialog-bao-cao-copy/dialog-bao-cao-copy.component';
import { DialogChonThemBieuMauBaoCaoComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { BAO_CAO_DOT, BAO_CAO_NAM, BCVP, DON_VI_TIEN, NOT_OK, OK, TRANG_THAI_PHU_LUC, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { BAO_CAO_KET_QUA, MAIN_ROUTE_BAO_CAO, MAIN_ROUTE_KE_HOACH } from '../../bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.constant';
import { BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG, KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG, LISTBIEUMAUDOT, LISTBIEUMAUNAM, SOLAMA, TAB_SELECTED } from './bao-cao.constant';

export class ItemDanhSach {
	id!: any;
	maBcao!: string;
	namBcao!: number;
	dotBcao!: number;
	thangBcao!: number;
	trangThai!: string;
	ngayTao!: string;
	nguoiTao!: string;
	maDviTien!: string;
	maDvi: number;
	congVan!: ItemCongVan;
	ngayTrinh!: string;
	ngayDuyet!: string;
	ngayPheDuyet!: string;
	ngayTraKq!: string;
	// dung cho request
	fileDinhKems!: any[];
	listIdDeletes!: string;
	listIdDeleteFiles = '';
	maPhanBcao = "1";

	maLoaiBcao!: string;
	stt!: string;
	checked!: boolean;
	lstBcaos: ItemData[] = [];
	lstFile: any[] = [];
	lstBcaoDviTrucThuocs: any[] = [];
	tongHopTuIds!: [];
}

export class ItemCongVan {
	fileName: string;
	fileSize: number;
	fileUrl: number;
}
export class ItemData {
	id!: any;
	maLoai!: string;
	maDviTien!: any;
	lstCtietBcaos!: any;
	trangThai!: string;
	checked!: boolean;
	tieuDe!: string;
	tenPhuLuc!: string;
	thuyetMinh!: string;
	lyDoTuChoi!: string;
	lstIdDeletes!: [];
	nguoiBcao!: string;
	bcaoId!: string;
	tuNgay: string;
	denNgay: string;
}

@Component({
	selector: 'app-bao-cao',
	templateUrl: './bao-cao.component.html',
	styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent implements OnInit {
	@Input() idDialog: any;

	constructor(
		private userService: UserService,
		private notification: NzNotificationService,
		private router: ActivatedRoute,
		private danhMucService: DanhMucHDVService,
		private quanLyVonPhiService: QuanLyVonPhiService,
		private datePipe: DatePipe,
		private modal: NzModalService,
		private spinner: NgxSpinnerService,
		private location: Location,
	) { }

	statusBtnDel = true;                       // trang thai an/hien nut xoa
	statusBtnSave = true;                      // trang thai an/hien nut luu
	statusBtnApprove = true;                   // trang thai an/hien nut trinh duyet
	statusBtnTBP = true;                       // trang thai an/hien nut truong bo phan
	statusBtnLD = true;                        // trang thai an/hien nut lanh dao
	statusBtnGuiDVCT = true;                   // trang thai nut gui don vi cap tren
	statusBtnDVCT = true;                      // trang thai nut don vi cap tren
	statusBtnCopy = true;                      // trang thai copy
	statusBtnPrint = true;                     // trang thai print
	statusBtnClose = false;                        // trang thai ok/ not ok

	statusBtnFinish = true;                    // trang thai hoan tat nhap lieu
	statusBtnOk = true;                        // trang thai ok/ not ok
	statusBtnExport = true;                        // trang thai export
	lstFiles: any = [];                          // list File de day vao api

	maDviTien = "1";                    // ma don vi tien
	thuyetMinh: string;                         // thuyet minh
	listIdDelete: any = [];                  // list id delete
	trangThaiChiTiet!: any;
	listIdFilesDelete: any = [];                        // id file luc call chi tiet
	donViTiens: any = DON_VI_TIEN;                        // danh muc don vi tien
	tuNgay: any;
	denNgay: any;

	donVis: any[] = [];
	userInfo: any;
	maDonViTao: any;
	donvitien: string;
	listFile: File[] = [];
	lstFile: any[] = [];
	trangThaiBanGhi: any;
	status = false;
	fileList: NzUploadFile[] = [];
	fileDetail: NzUploadFile;
	lstDeleteCTietBCao: any = [];

	//nhóm biến router
	id: any; // id của bản ghi

	baoCao: ItemDanhSach = new ItemDanhSach();
	luyKes: ItemData[] = [];
	currentday = new Date();
	maPhanBcao = '1'; //phân biệt phần giữa 3.2.9 và 3.2.8 
	maLoaiBaocao: any;

	//nhóm biến biểu mẫu
	allChecked: any;
	indeterminate: boolean;
	tabSelected: string;
	tab = TAB_SELECTED;

	vt: number;
	stt: number;
	kt: boolean;
	disable = false;
	soLaMa: any[] = SOLAMA;
	lstCTietBaoCaoTemp: any[] = [];
	tabs: any[] = [];

	nguoiBcaos: any[];
	allUsers: any[];
	data: any;
	selectedIndex = 1;

	async ngOnInit() {
		this.id = this.router.snapshot.paramMap.get('id');
		const lbc = this.router.snapshot.paramMap.get('baoCao');

		this.userInfo = this.userService.getUserLogin();

		this.getListUser();
		if (this.idDialog) {
			this.id = this.idDialog;
			this.statusBtnClose = true;
			this.statusBtnSave = true;
		}

		if (this.id) {
			await this.getDetailReport();
		} else if (lbc == 'tong-hop') {
			await this.callSynthetic();
			this.baoCao.maDvi = this.userInfo?.MA_DVI;
			this.spinner.show();
			this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
				(data) => {
					if (data.statusCode == 0) {
						this.baoCao.maBcao = data.data;
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				},
				(err) => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
				}
			);
			this.baoCao.nguoiTao = this.userInfo?.sub;
			this.baoCao.ngayTao = new Date().toDateString();
			this.baoCao.trangThai = "1";
		} else {
			this.baoCao.maDvi = this.userInfo?.MA_DVI;
			//tạo mã báo cáo
			this.spinner.show();
			this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
				(res) => {
					if (res.statusCode == 0) {
						this.baoCao.maBcao = res.data;
					} else {
						this.notification.error(MESSAGE.ERROR, res?.msg);
					}
				},
				(err) => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
			this.baoCao.namBcao = this.currentday.getFullYear();
			this.baoCao.ngayTao = this.datePipe.transform(this.currentday, Utils.FORMAT_DATE_STR);
			this.baoCao.trangThai = '1';
			this.baoCao.maLoaiBcao = this.router.snapshot.paramMap.get('loaiBaoCao');
			this.baoCao.namBcao = Number(this.router.snapshot.paramMap.get('nam'));
			this.baoCao.dotBcao = Number(this.router.snapshot.paramMap.get('dot')) == 0 ? null : Number(this.router.snapshot.paramMap.get('dot'));
			this.baoCao.nguoiTao = this.userInfo?.sub;

			if (this.baoCao.maLoaiBcao == BAO_CAO_DOT) {
				this.maLoaiBaocao = BAO_CAO_DOT;
				LISTBIEUMAUDOT.forEach(e => {
					this.baoCao.lstBcaos.push(
						{
							id: uuid.v4() + 'FE',
							checked: false,
							tieuDe: e.tieuDe + this.baoCao.dotBcao,
							maLoai: e.maPhuLuc,
							tenPhuLuc: e.tenPhuLuc,
							trangThai: '3',
							lstCtietBcaos: [],
							maDviTien: '1',
							thuyetMinh: null,
							lyDoTuChoi: null,
							lstIdDeletes: [],
							nguoiBcao: null,
							bcaoId: this.id,
							tuNgay: '',
							denNgay: '',
						}
					)
				})
			} else {
				this.maLoaiBaocao = BAO_CAO_NAM;
				LISTBIEUMAUNAM.forEach(e => {
					this.baoCao.lstBcaos.push(
						{
							id: uuid.v4() + 'FE',
							checked: false,
							tieuDe: e.tieuDe + this.baoCao.namBcao,
							maLoai: e.maPhuLuc,
							tenPhuLuc: e.tenPhuLuc,
							trangThai: '3',
							lstCtietBcaos: [],
							maDviTien: '1',
							thuyetMinh: null,
							lyDoTuChoi: null,
							lstIdDeletes: [],
							nguoiBcao: null,
							bcaoId: this.id,
							tuNgay: '',
							denNgay: '',
						}
					)
				})
			}
		}
		this.getLuyKe();

		//lay danh sach cac đơn vị quản lý (chi cục, cục khu vực,...)
		await this.danhMucService.dMDviCon().toPromise().then(res => {
			if (res.statusCode == 0) {
				this.donVis = res.data;
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			})
		this.getStatusButton();
		this.spinner.hide();
	}

	getLuyKe() {
		const request = {
			dotBcao: this.baoCao?.dotBcao,
			maPhanBcao: "1",
			namBcao: this.baoCao?.namBcao,
			thangBcao: null
		}
		this.quanLyVonPhiService.getLuyKe(request).toPromise().then(res => {
			if (res.statusCode == 0) {
				this.luyKes = res.data.lstBcaos;
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, (err) => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
	}

	getListUser() {
		// const request = {
		// 	dvql: this.userInfo?.MA_DVI,
		// 	fullName: "",
		// 	paggingReq: {
		// 		limit: 1000,
		// 		page: 1
		// 	},
		// 	roleId: "",
		// 	status: "",
		// 	sysType: "",
		// 	username: ""
		// }
		// this.quanLyVonPhiService.getListUserByManage(request).toPromise().then(res => {
		// 	if (res.statusCode == 0) {
		// 		this.allUsers = res.data?.content;
		// 	} else {
		// 		this.notification.error(MESSAGE.ERROR, res?.msg);
		// 	}
		// }, (err) => {
		// 	this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		// })
		this.quanLyVonPhiService.getListUser().toPromise().then(res => {
			if (res.statusCode == 0) {
				this.nguoiBcaos = res.data;
			}
		}, (err) => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
	}

	getStatusButton() {
		const isSynthetic = this.baoCao.lstBcaoDviTrucThuocs.length != 0;
		const checkSave = isSynthetic ? this.userService.isAccessPermisson(BCVP.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.EDIT_REPORT);
		const checkApprove = isSynthetic ? this.userService.isAccessPermisson(BCVP.APPROVE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.APPROVE_REPORT);
		const checkDuyet = isSynthetic ? this.userService.isAccessPermisson(BCVP.DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.DUYET_REPORT);
		const checkPheDuyet = isSynthetic ? this.userService.isAccessPermisson(BCVP.PHE_DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.PHE_DUYET_REPORT);
		const checkTiepNhan = this.userService.isAccessPermisson(BCVP.TIEP_NHAN_REPORT);
		const checkCopy = isSynthetic ? this.userService.isAccessPermisson(BCVP.COPY_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.COPY_REPORT);
		const checkPrint = isSynthetic ? this.userService.isAccessPermisson(BCVP.PRINT_SYTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.PRINT_REPORT);
		const checkExport = this.userService.isAccessPermisson(BCVP.EXPORT_EXCEL_REPORT);
		if (Utils.statusSave.includes(this.baoCao.trangThai) && checkSave) {
			this.status = false;
		} else {
			this.status = true;
		}

		const checkChirld = this.baoCao.maDvi == this.userInfo?.MA_DVI;
		const checkParent = this.donVis.findIndex(e => e.maDvi == this.baoCao.maDvi) != -1;

		this.statusBtnSave = !(Utils.statusSave.includes(this.baoCao.trangThai) && checkSave && checkChirld);
		this.statusBtnApprove = !(Utils.statusApprove.includes(this.baoCao.trangThai) && checkApprove && checkChirld);
		this.statusBtnTBP = !(Utils.statusDuyet.includes(this.baoCao.trangThai) && checkDuyet && checkChirld);
		this.statusBtnLD = !(Utils.statusPheDuyet.includes(this.baoCao.trangThai) && checkPheDuyet && checkChirld);
		this.statusBtnDVCT = !(Utils.statusTiepNhan.includes(this.baoCao.trangThai) && checkTiepNhan && checkParent);
		this.statusBtnCopy = !(Utils.statusCopy.includes(this.baoCao.trangThai) && checkCopy && checkChirld);
		this.statusBtnPrint = !(Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && checkChirld);
		this.statusBtnExport = !(Utils.statusExport.includes(this.baoCao.trangThai) && checkExport && checkChirld);

		if (!this.statusBtnDVCT || !this.statusBtnLD || !this.statusBtnTBP) {
			this.statusBtnOk = true;
		} else {
			this.statusBtnOk = false;
		}
		if (!this.statusBtnSave) {
			this.statusBtnFinish = false;
		} else {
			this.statusBtnFinish = true;
		}
	}

	// lay ten don vi tao
	getUnitName(dvitao: any) {
		return this.donVis.find(item => item.maDvi == dvitao)?.tenDvi;
	}

	//call service xem chi tiết
	async getDetailReport() {
		this.spinner.show();
		await this.quanLyVonPhiService.baoCaoChiTiet(this.id).toPromise().then(data => {
			if (data.statusCode == 0) {
				this.baoCao = data.data;
				this.baoCao?.lstBcaos?.forEach(item => {
					if (this.baoCao.maLoaiBcao == BAO_CAO_DOT) {
						const index = LISTBIEUMAUDOT.findIndex(data => data.maPhuLuc == item.maLoai);
						if (index !== -1) {
							item.checked = false;
							item.tieuDe = LISTBIEUMAUDOT[index].tieuDe + this.baoCao.dotBcao;
							item.tenPhuLuc = LISTBIEUMAUDOT[index].tenPhuLuc;
						}
					} else {
						const index = LISTBIEUMAUNAM.findIndex(data => data.maPhuLuc == item.maLoai);
						if (index !== -1) {
							item.checked = false;
							item.tieuDe = LISTBIEUMAUNAM[index].tieuDe + this.baoCao.namBcao;
							item.tenPhuLuc = LISTBIEUMAUNAM[index].tenPhuLuc;
						}
					}
				})

				this.lstFiles = data.data.lstFiles;
				this.listFile = [];
				//this.maDonViTao = data.data.maDvi;
				this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
				this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
				this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
				this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
				this.baoCao.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
			} else {
				this.notification.error(MESSAGE.ERROR, data?.msg);
			}
		}, (err) => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
		})
		this.spinner.hide();
	}

	// chuc nang check role
	async onSubmit(mcn: string, lyDoTuChoi: string) {
		if (this.id) {
			if (!this.baoCao?.congVan?.fileUrl) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
				return;
			}
			const checkStatusReport = this.baoCao?.lstBcaos?.findIndex(item => item.trangThai != '5');
			if (checkStatusReport != -1 && mcn == Utils.TT_BC_2) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WARNING_FINISH_INPUT);
				return;
			}
			const requestGroupButtons = {
				id: this.id,
				maChucNang: mcn,
				lyDoTuChoi: lyDoTuChoi,
			};
			this.spinner.show();
			await this.quanLyVonPhiService.approveBaoCao(requestGroupButtons).toPromise().then(async (data) => {
				if (data.statusCode == 0) {
					await this.getDetailReport();
					this.getStatusButton();
					if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
					} else {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
					}
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			}, err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			});
			this.spinner.hide();
		} else {
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
		}
	}

	//nhóm chức năng phụ vụ cho table biểu mẫu (phụ lục) ------------------------------------------
	updateAllDanhSachMauBcao(): void {
		this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstCtietBcaos.checked = true
			this.baoCao.lstBcaos = this.baoCao?.lstBcaos.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.baoCao.lstBcaos = this.baoCao?.lstBcaos.map(item => ({    // checkboxall == false thi set lai lstCtietBcaos.checked = false
				...item,
				checked: false
			}));
		}
	}
	getStatusNameBieuMau(Status: any) {
		return TRANG_THAI_PHU_LUC.find(item => item.id == Status)?.ten;
	}

	newTab(maPhuLuc: any): void {
		const index: number = this.tabs.findIndex(e => e.id === maPhuLuc);
		if (index != -1) {
			this.selectedIndex = index + 1;
		} else {
			const item = this.baoCao.lstBcaos.find(e => e.maLoai == maPhuLuc);
			this.data = {
				...item,
				trangThaiBaoCao: this.baoCao.trangThai,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				statusBtnExport: this.statusBtnExport,
				status: this.status,
				idBaoCao: this.baoCao.id,
				luyKes: this.luyKes,
				namBcao: this.baoCao.namBcao,
			}
			this.tabs = [];
			this.tabs.push(this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc));
			this.selectedIndex = this.tabs.length + 1;
		}
	}

	getNewData(obj: any) {
		const index = this.baoCao?.lstBcaos.findIndex(e => e.maLoai == this.tabs[0].maLoai);
		if (obj?.lstCtietBcaos) {
			this.baoCao.lstBcaos[index].maDviTien = obj.maDviTien;
			this.baoCao.lstBcaos[index].lstCtietBcaos = obj.lstCtietBcaos;
			this.baoCao.lstBcaos[index].trangThai = obj.trangThai;
			this.baoCao.lstBcaos[index].thuyetMinh = obj.thuyetMinh;
			this.baoCao.lstBcaos[index].lyDoTuChoi = obj.lyDoTuChoi;
			this.baoCao.lstBcaos[index].tuNgay = obj.tuNgay;
			this.baoCao.lstBcaos[index].denNgay = obj.denNgay;
			this.tabs = [];
			this.tabs.push(this.baoCao?.lstBcaos.find(e => e.maLoai == this.baoCao?.lstBcaos[index].maLoai));
			this.selectedIndex = this.tabs.length + 1;
		} else {
			this.baoCao.lstBcaos[index].trangThai = obj?.trangThai;
			this.baoCao.lstBcaos[index].lyDoTuChoi = obj?.lyDoTuChoi;
		}
		// this.closeTab();
	}

	updateSingleChecked() {
		if (this.baoCao?.lstBcaos.every((item) => !item.checked)) {
			this.allChecked = false;
			this.indeterminate = false;
		} else if (this.baoCao?.lstBcaos.every((item) => item.checked)) {
			this.allChecked = true;
			this.indeterminate = false;
		} else {
			this.indeterminate = true;
		}
	}

	addPhuLuc() {
		let danhSach: any;
		if (this.baoCao.maLoaiBcao == BAO_CAO_DOT) {
			LISTBIEUMAUDOT.forEach(item => item.status = false);
			danhSach = LISTBIEUMAUDOT.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);
		} else {
			LISTBIEUMAUNAM.forEach(item => item.status = false);
			danhSach = LISTBIEUMAUNAM.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);
		}

		const modalIn = this.modal.create({
			nzTitle: 'Danh sách mẫu báo cáo',
			nzContent: DialogChonThemBieuMauBaoCaoComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '600px',
			nzFooter: null,
			nzComponentParams: {
				ChonThemBieuMauBaoCao: danhSach
			},
		});
		modalIn.afterClose.subscribe((res) => {
			if (res) {
				res.forEach(item => {
					if (item.status) {
						this.baoCao.lstBcaos.push({
							id: uuid.v4() + 'FE',
							checked: false,
							tieuDe: item.tieuDe,
							maLoai: item.maPhuLuc,
							tenPhuLuc: item.tenPhuLuc,
							trangThai: '3',
							lstCtietBcaos: [],
							maDviTien: '1',
							thuyetMinh: null,
							lyDoTuChoi: null,
							lstIdDeletes: [],
							nguoiBcao: null,
							bcaoId: this.id,
							tuNgay: '',
							denNgay: '',
						});
					}
				})
			}
		});
	}


	deletePhuLucList() {
		this.baoCao.lstBcaos = this.baoCao?.lstBcaos.filter(item => item.checked == false);
		if (this.baoCao?.lstBcaos?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
			this.tabSelected = null;
		}
		this.allChecked = false;
	}

	// them file vao danh sach
	handleUpload(): void {
		this.fileList.forEach((file: any) => {
			const id = file?.lastModified.toString();
			this.lstFiles.push({ id: id, fileName: file?.name });
			this.listFile.push(file);
		});
		this.fileList = [];
	}

	//download file về máy tính
	async downloadFile(id: string) {
		const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
		if (!file) {
			const fileAttach = this.lstFiles.find(element => element?.id == id);
			if (fileAttach) {
				await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
					(data) => {
						fileSaver.saveAs(data, fileAttach.fileName);
					},
					err => {
						this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
					},
				);
			}
		} else {
			const blob = new Blob([file], { type: "application/octet-stream" });
			fileSaver.saveAs(blob, file.name);
		}
	}

	//download file về máy tính
	async downloadFileCv() {
		if (this.baoCao?.congVan?.fileUrl) {
			await this.quanLyVonPhiService.downloadFile(this.baoCao?.congVan?.fileUrl).toPromise().then(
				(data) => {
					fileSaver.saveAs(data, this.baoCao?.congVan?.fileName);
				},
				err => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
		} else {
			const file: any = this.fileDetail;
			const blob = new Blob([file], { type: "application/octet-stream" });
			fileSaver.saveAs(blob, file.name);
		}
	}

	// xoa file trong bang file
	deleteFile(id: string): void {
		this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
		this.listIdFilesDelete.push(id);
	}


	// before uploaf file
	beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = this.fileList.concat(file);
		return false;
	};

	// before uploaf file
	beforeUploadCV = (file: NzUploadFile): boolean => {
		this.fileDetail = file;
		this.baoCao.congVan = {
			fileName: file.name,
			fileSize: null,
			fileUrl: null,
		};
		return false;
	};

	async save() {
		this.baoCao?.lstBcaos.find(item => {
			if (item.maLoai == this.tabSelected) {
				item.lstCtietBcaos = Object.assign([], this.lstCTietBaoCaoTemp),
					item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.lstIdDeletes = this.listIdDelete,
					item.tuNgay = this.tuNgay, item.denNgay = this.denNgay
			}
		});
		const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
		//get list file url
		const listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}
		//get file cong van url
		const file: any = this.fileDetail;
		if (file) {
			baoCaoTemp.congVan = await this.uploadFile(file);
		}
		if (!baoCaoTemp.congVan) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
			return;
		}

		let checkMoneyRange = true;
		let checkPersonReport = true;
		/////////////////////////////
		baoCaoTemp.lstBcaos.forEach((item) => {
			item.tuNgay = typeof item.tuNgay == 'string' ? new Date(item.tuNgay) : item.tuNgay;
			item.denNgay = typeof item.denNgay == 'string' ? new Date(item.denNgay) : item.denNgay;
			if (!item.nguoiBcao) {
				checkPersonReport = false;
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
				return;
			}
			if (item.id?.length == 38) {
				item.id = null;
			}
			if (this.id == null) {
				item.trangThai = '3'; // set trang thai phu luc la chua danh gia
			}
			item.lstCtietBcaos.forEach(data => {
				if (data?.id.length == 38) {
					data.id = null;
				}
				if (data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG || data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG ||
					data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO || data.maLoai == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
					data.listCtiet.forEach(element => {
						if (element?.id.length == 38) {
							element.id = null;
						}
					})
				}
			})
		});

		if (!checkPersonReport) {
			return;
		} else {
			// replace nhung ban ghi dc them moi id thanh null
			baoCaoTemp.tongHopTuIds = [];
			baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
				baoCaoTemp.tongHopTuIds.push(item.id);
			})

			baoCaoTemp.fileDinhKems = listFile;
			baoCaoTemp.listIdFiles = this.listIdFilesDelete;
			baoCaoTemp.trangThai = "1";
			//baoCaoTemp.maDvi = this.maDonViTao;
			baoCaoTemp.maPhanBcao = '1';

			//call service them moi
			this.spinner.show();
			if (this.id == null) {
				//net la tao bao cao moi thi khong luu lstCtietBcaos, con la tong hop thi khong luu
				const lbc = this.router.snapshot.paramMap.get('baoCao');
				if (lbc == 'bao-cao') {
					baoCaoTemp?.lstBcaos?.filter(item => item.lstCtietBcaos = []);
				}
				await this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
					async data => {
						if (data.statusCode == 0) {
							this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
							this.id = data.data.id
							await this.getDetailReport();
							this.getStatusButton();
						} else {
							this.notification.error(MESSAGE.ERROR, data?.msg);
							this.spinner.hide();
						}
					},
					err => {
						this.spinner.hide();
						this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
					},
				);
			} else {
				await this.quanLyVonPhiService.updateBaoCaoThucHienDTC(baoCaoTemp).toPromise().then(async res => {
					if (res.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
						this.id = res.data.id
						await this.getDetailReport();
						this.getStatusButton();
					} else {
						this.spinner.hide();
						this.notification.error(MESSAGE.ERROR, res?.msg);
					}
				}, err => {
					this.spinner.hide();
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				})
			}
		}
		this.spinner.hide();
	}

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.baoCao.maDvi + '/' + this.baoCao?.maBcao);
		const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
			(data) => {
				const objfile = {
					// fileName: data.filename,
					// fileSize: data.size,
					// fileUrl: data.url,
					fileName: file.name,
					fileSize: file.size,
					fileUrl: this.baoCao.maDvi + '/' + this.baoCao?.maBcao,
				}
				return objfile;
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);
		return temp;
	}

	getStatusName(Status: any) {
		const utils = new Utils();
		if (this.baoCao.maDvi == this.userInfo?.MA_DVI) {
			return utils.getStatusName(Status == '7' ? '6' : Status);
		}
		if (this.donVis.findIndex(e => e.maDvi == this.baoCao.maDvi) != -1) {
			return utils.getStatusNameParent(Status == '7' ? '6' : Status);
		}
	}

	getStatusAppendixName(id) {
		const utils = new Utils();
		return utils.getStatusAppendixName(id);
	}

	//show popup tu choi
	tuChoi(mcn: string) {
		const modalTuChoi = this.modal.create({
			nzTitle: 'Từ chối',
			nzContent: DialogTuChoiComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {},
		});
		modalTuChoi.afterClose.toPromise().then(async (text) => {
			if (text) {
				this.onSubmit(mcn, text);
			}
		});
	}

	//show popup tu choi dùng cho nut ok - not ok
	async pheDuyetChiTiet(mcn: string, maLoai: any) {
		this.spinner.show();
		if (mcn == OK) {
			await this.pheDuyetBieuMau(mcn, maLoai, null);
		} else if (mcn == NOT_OK) {
			const modalTuChoi = this.modal.create({
				nzTitle: 'Not OK',
				nzContent: DialogTuChoiComponent,
				nzMaskClosable: false,
				nzClosable: false,
				nzWidth: '900px',
				nzFooter: null,
				nzComponentParams: {},
			});
			modalTuChoi.afterClose.toPromise().then(async (text) => {
				if (text) {
					await this.pheDuyetBieuMau(mcn, maLoai, text);
				}
			});
		}
		this.spinner.hide();
	}

	//call api duyet bieu mau
	async pheDuyetBieuMau(trangThai: any, maLoai: any, lyDo: string) {
		const idBieuMau: any = this.baoCao.lstBcaos.find((item) => item.maLoai == maLoai).id;
		const requestPheDuyetBieuMau = {
			id: idBieuMau,
			trangThai: trangThai,
			lyDoTuChoi: lyDo,
		};
		this.spinner.show();

		await this.quanLyVonPhiService.approveBieuMau(requestPheDuyetBieuMau).toPromise().then(async res => {
			if (res.statusCode == 0) {
				if (trangThai == NOT_OK) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
				} else {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
				}
				this.trangThaiChiTiet = trangThai;
				this.baoCao?.lstBcaos?.filter(item => {
					if (item.maLoai == maLoai) {
						item.trangThai = trangThai;
						item.lyDoTuChoi = lyDo;
					}
				})
				this.getStatusButton();
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
		this.spinner.hide();
	}

	viewDetail(id) {
		const url = MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_BAO_CAO + '/' + BAO_CAO_KET_QUA + '/bao-cao/' + id;
		window.open(url, '_blank');
	}

	// call chi tiet bao cao
	async callSynthetic() {
		this.spinner.show();
		const maLoaiBcao = this.router.snapshot.paramMap.get('loaiBaoCao');
		const namBcao = Number(this.router.snapshot.paramMap.get('nam'));
		const dotBcao = Number(this.router.snapshot.paramMap.get('dot')) == 0 ? null : Number(this.router.snapshot.paramMap.get('dot'));
		const request = {
			maLoaiBcao: maLoaiBcao,
			namBcao: namBcao,
			thangBcao: null,
			dotBcao: dotBcao,
			maPhanBcao: '1',
		}
		await this.quanLyVonPhiService.tongHopBaoCaoKetQua(request).toPromise().then(
			async (data) => {
				if (data.statusCode == 0) {
					this.baoCao = data.data;
					await this.baoCao?.lstBcaos?.forEach(item => {
						item.maDviTien = '1';   // set defaul ma don vi tien la Dong
						item.checked = false;
						item.trangThai = '3';
						this.baoCao.maLoaiBcao = maLoaiBcao;
						this.baoCao.namBcao = namBcao;
						this.baoCao.dotBcao = dotBcao;
						item.lyDoTuChoi = null;
						item.bcaoId = null;
						item.thuyetMinh = null;
						item.tuNgay = '';
						item.denNgay = '';
						if (maLoaiBcao == BAO_CAO_DOT) {
							const index = LISTBIEUMAUDOT.findIndex(data => data.maPhuLuc == item.maLoai);
							if (index !== -1) {
								item.tieuDe = LISTBIEUMAUDOT[index].tieuDe + this.baoCao.dotBcao;
								item.tenPhuLuc = LISTBIEUMAUDOT[index].tenPhuLuc;
								item.nguoiBcao = this.userInfo.sub;
							}
						} else {
							const index = LISTBIEUMAUNAM.findIndex(data => data.maPhuLuc == item.maLoai);
							if (index !== -1) {
								item.tieuDe = LISTBIEUMAUNAM[index].tieuDe + this.baoCao.namBcao;
								item.tenPhuLuc = LISTBIEUMAUNAM[index].tenPhuLuc;
								item.nguoiBcao = this.userInfo.sub;
							}
						}
					})
					this.listFile = [];
					this.baoCao.trangThai = "1";
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
		this.spinner.hide();
	}


	doShowDialogCopy() {
		const modalTuChoi = this.modal.create({
			nzTitle: 'Copy Báo Cáo',
			nzContent: DialogBaoCaoCopyComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {
				maPhanBcao: '1',
				maLoaiBcao: this.baoCao.maLoaiBcao,
				namBcao: this.baoCao.namBcao,
				dotBcao: this.baoCao.dotBcao,
				thangBcao: this.baoCao.thangBcao,
				checkDvtt: this.baoCao.lstBcaoDviTrucThuocs.length > 0 ? true : false,
			},
		});
		modalTuChoi.afterClose.toPromise().then(async (response) => {
			if (response) {
				this.doCopy(response);
			}
		});
	}

	async doCopy(response) {
		this.spinner.show();
		const maBaoCao = await this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					return data.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
					return null;
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
				return null;
			}
		);
		this.spinner.hide();
		if (!maBaoCao) {
			return;
		}

		// set ma don vi tien trong list chinh = ma don vi tien vua chon tai man hinh
		this.baoCao?.lstBcaos.find(item => {
			if (item.maLoai == this.tabSelected) {
				item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.tuNgay = this.tuNgay, item.denNgay = this.denNgay
			}
		});
		const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
		baoCaoTemp.congVan = null;
		// set nambao,dot bao cao tu dialog gui ve
		baoCaoTemp.namBcao = response.namBcao;
		baoCaoTemp.dotBcao = response.dotBcao;
		if (response.loaiCopy == 'D') {
			//xoa lst don vi truc thuoc theo lua chon tu dialog
			baoCaoTemp.lstBcaoDviTrucThuocs = [];
		}
		let checkMoneyRange = true;
		// replace nhung ban ghi dc them moi id thanh null
		baoCaoTemp?.lstBcaos?.filter(item => {
			item.id = null;
			item.listIdDelete = null;
			item.trangThai = '3'; // set trang thai phu luc la chua danh gia
			item?.lstCtietBcaos.filter(data => {
				data.id = null;
			})
		})
		// replace nhung ban ghi dc them moi id thanh null
		baoCaoTemp.id = null;
		baoCaoTemp.maBcao = maBaoCao;
		baoCaoTemp.tongHopTuIds = [];
		baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
			baoCaoTemp.tongHopTuIds.push(item.id);
		})
		baoCaoTemp.fileDinhKems = [];
		baoCaoTemp.listIdFiles = null;
		baoCaoTemp.trangThai = "1";
		//baoCaoTemp.maDvi = this.maDonViTao;
		baoCaoTemp.maPhanBcao = '1';

		//call service them moi
		this.spinner.show();
		this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
					const modalCopy = this.modal.create({
						nzTitle: MESSAGE.ALERT,
						nzContent: DialogCopyComponent,
						nzMaskClosable: false,
						nzClosable: false,
						nzWidth: '900px',
						nzFooter: null,
						nzComponentParams: {
							maBcao: maBaoCao
						},
					});
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
					this.spinner.hide();
				}
			},
			err => {
				this.spinner.hide();
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);
		this.spinner.hide();
	}

	close() {
		this.location.back();
	}

	// update all
	updateAllChecked(): void {
		this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
		this.baoCao?.lstBcaos.filter(item =>
			item.checked = this.allChecked
		);
	}

	closeTab(): void {
		this.tabs = []
	}

}
