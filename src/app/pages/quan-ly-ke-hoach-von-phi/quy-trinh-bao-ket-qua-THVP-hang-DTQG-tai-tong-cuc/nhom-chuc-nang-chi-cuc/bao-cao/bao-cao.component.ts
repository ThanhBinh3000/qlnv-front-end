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
import { BAO_CAO_DOT, BAO_CAO_NAM, divMoney, DON_VI_TIEN, MONEY_LIMIT, mulMoney, NOT_OK, OK, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, TRANG_THAI_PHU_LUC, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG, BAO_CAO_NHAP_HANG_DTQG, BAO_CAO_XUAT_HANG_DTQG, KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG, LISTBIEUMAUDOT, LISTBIEUMAUNAM, NOI_DUNG, SOLAMA, TAB_SELECTED } from './bao-cao.constant';

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

export class ItemDataMau02 {
	id = null;
	header = null;
	stt = '0';
	checked = false;
	level = 0;
	maVtu = null;
	maDviTinh = null;
	soQd = null;
	khSoLuong = 0;
	khGiaMuaTd = 0;
	khTtien = 0;
	thSoLuong = 0;
	thGiaMuaTd = 0;
	thTtien = 0;
	ghiChu = null;

}

export class ItemDataMau03 {
	id = null;
	header = null;
	stt = '0';
	checked = false;
	level = 0;

	maVtu = null;
	maDviTinh = null;
	soLuongKhoach = 0;
	soLuongTte = 0;
	dgGiaKhoach = 0;
	dgGiaBanTthieu = 0;
	dgGiaBanTte = 0;
	ttGiaHtoan = 0;
	ttGiaBanTte = 0;
	ttClechGiaTteVaGiaHtoan = 0;
	ghiChu = null;

}


export class ItemDataMau0405 {
	id = null;
	header = null;
	stt = '0';
	checked = false;
	level = 0;

	maNdungChi = null;
	trongDotTcong = 0;
	trongDotThoc = 0;
	trongDotGao = 0;
	luyKeTcong = 0;
	luyKeThoc = 0;
	luyKeGao = 0;
	listCtiet: vatTu[] = [];
	ghiChu = null;
	maNdungChiCha = null;
}

export class vatTu {
	id: number;
	maVtu: any;
	loaiMatHang: any;
	sl: any;
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
	userInfor: any;
	maDonViTao: any;
	donvitien: string;
	listFile: File[] = [];
	lstFile: any[] = [];
	trangThaiBanGhi: any;
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}
	status = false;
	fileList: NzUploadFile[] = [];
	fileDetail: NzUploadFile;
	lstDeleteCTietBCao: any = [];

	//nhóm biến router
	id: any; // id của bản ghi

	//----
	listVattu: any[] = [];
	lstVatTuFull = [];

	baoCao: ItemDanhSach = new ItemDanhSach();
	luyKes: ItemData[] = [];
	currentday = new Date();
	maPhanBcao = '1'; //phân biệt phần giữa 3.2.9 và 3.2.8 
	maLoaiBaocao: any;
	listDonvitinh: any[] = [];

	//nhóm biến biểu mẫu
	allChecked: any;
	indeterminate: boolean;
	tabSelected: string;
	tab = TAB_SELECTED;


	//nhóm biến biểu mẫu 02------------------
	allChecked02: any;
	indeterminate02: boolean;
	lstCtietBcao021: ItemDataMau02[] = [];
	lstCtietBcao022: ItemDataMau02[] = [];
	lstIdDeleteMau02 = '';


	//nhóm biến biểu mẫu 03----------
	allChecked03: any;
	indeterminate03: boolean;
	lstCtietBcao031: ItemDataMau03[] = [];
	lstCtietBcao032: ItemDataMau03[] = [];
	lstCtietBcao033: ItemDataMau03[] = [];

	lstIdDeleteMau03 = '';

	//nhóm biến biểu mẫu 04ax
	lstCtietBcao4axI1: ItemDataMau0405[] = [];
	lstCtietBcao4axI2: ItemDataMau0405[] = [];
	lstCtietBcao4axI3: ItemDataMau0405[] = [];
	lstCtietBcao4axII11: ItemDataMau0405[] = [];
	lstCtietBcao4axII12: ItemDataMau0405[] = [];
	lstCtietBcao4axII2: ItemDataMau0405[] = [];
	lstCtietBcao4axII3: ItemDataMau0405[] = [];
	lstCtietBcao4axIII1: ItemDataMau0405[] = [];
	lstCtietBcao4axIII2: ItemDataMau0405[] = [];
	lstCtietBcao4axIII3: ItemDataMau0405[] = [];
	lstCtietBcao4axB: ItemDataMau0405[] = [];

	//nhóm biến biểu mẫu 04an
	lstCtietBcao4anI1: ItemDataMau0405[] = [];
	lstCtietBcao4anI2: ItemDataMau0405[] = [];
	lstCtietBcao4anI3: ItemDataMau0405[] = [];
	lstCtietBcao4anII11: ItemDataMau0405[] = [];
	lstCtietBcao4anII12: ItemDataMau0405[] = [];
	lstCtietBcao4anII2: ItemDataMau0405[] = [];
	lstCtietBcao4anII3: ItemDataMau0405[] = [];
	lstCtietBcao4anIII1: ItemDataMau0405[] = [];
	lstCtietBcao4anIII2: ItemDataMau0405[] = [];
	lstCtietBcao4anIII3: ItemDataMau0405[] = [];
	lstCtietBcao4anB: ItemDataMau0405[] = [];

	//nhóm biến biểu mẫu 04b
	lstCtietBcao4bI1: ItemDataMau0405[] = [];
	lstCtietBcao4bI2: ItemDataMau0405[] = [];
	lstCtietBcao4bI3: ItemDataMau0405[] = [];
	lstCtietBcao4bII11: ItemDataMau0405[] = [];
	lstCtietBcao4bII12: ItemDataMau0405[] = [];
	lstCtietBcao4bII2: ItemDataMau0405[] = [];
	lstCtietBcao4bII3: ItemDataMau0405[] = [];
	lstCtietBcao4bII21: ItemDataMau0405[] = [];
	lstCtietBcao4bII22: ItemDataMau0405[] = [];
	lstCtietBcao4bII23: ItemDataMau0405[] = [];
	lstCtietBcao4bII24: ItemDataMau0405[] = [];
	lstCtietBcao4bIII1: ItemDataMau0405[] = [];
	lstCtietBcao4bIII2: ItemDataMau0405[] = [];
	lstCtietBcao4bIII3: ItemDataMau0405[] = [];
	lstCtietBcao4bB: ItemDataMau0405[] = [];

	//nhóm biến biểu mẫu 05
	lstCtietBcao5I1: ItemDataMau0405[] = [];
	lstCtietBcao5I2: ItemDataMau0405[] = [];
	lstCtietBcao5II11: ItemDataMau0405[] = [];
	lstCtietBcao5II12: ItemDataMau0405[] = [];
	lstCtietBcao5II2: ItemDataMau0405[] = [];
	lstCtietBcao5III1: ItemDataMau0405[] = [];
	lstCtietBcao5III2: ItemDataMau0405[] = [];
	lstCtietBcao5B: ItemDataMau0405[] = [];

	vt: number;
	stt: number;
	kt: boolean;
	disable = false;
	soLaMa: any[] = SOLAMA;
	lstCTietBaoCaoTemp: any[] = [];
	tabs: any[] = [];
	lstCtietBcao04bx: ItemDataMau0405[] = [];
	lstCtietBcao05: ItemDataMau0405[] = [];
	editCache: { [key: string]: { edit: boolean; data: any } } = {};
	allChecked1: any;

	cols = 0;
	lstIdDeleteCols = '';

	nguoiBcaos: any[];
	allUsers: any[];
	vatTusBC02 = NOI_DUNG;
	vatTusBC03 = NOI_DUNG;
	noiDungChisBC04 = NOI_DUNG;
	noiDungChisBC05 = NOI_DUNG;
	data: any;
	listColTemp: any[] = [];
	selectedIndex = 1;
	async ngOnInit() {
		this.cols = 3;
		this.id = this.router.snapshot.paramMap.get('id');
		const lbc = this.router.snapshot.paramMap.get('baoCao');
		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		this.getListUser();
		if (this.idDialog) {
			this.id = this.idDialog;
			this.statusBtnClose = true;
			this.statusBtnSave = true;
		}

		if (this.id != null) {
			// gọi xem chi tiết
			await this.getDetailReport();
		} else if (lbc == 'tong-hop') {
			await this.callSynthetic();
			this.maDonViTao = this.userInfor?.dvql;
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
			this.baoCao.nguoiTao = userName;
			this.baoCao.ngayTao = new Date().toDateString();
			this.baoCao.trangThai = "1";

		} else {

			this.maDonViTao = this.userInfor?.dvql;
			//tạo mã báo cáo
			this.spinner.show();
			this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
				(res) => {
					if (res.statusCode == 0) {
						this.baoCao.maBcao = res.data;
						// this.notification.success(MESSAGE.SUCCESS, res?.msg);
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
			this.baoCao.nguoiTao = userName;

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
		//lấy danh sách vật tư
		await this.danhMucService.dMVatTu().toPromise().then(res => {
			if (res.statusCode == 0) {
				this.listVattu = res.data;
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
		this.addListVatTu(this.listVattu);
		//danh sách đơn vị tính (đơn vị đo lường )
		this.quanLyVonPhiService.dmDonvitinh().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.listDonvitinh = data.data?.content;

				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);

		//lay danh sach cac đơn vị quản lý (chi cục, cục khu vực,...)
		await this.danhMucService.dMDonVi().toPromise().then(res => {
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

	addListVatTu(listVattu) {
		listVattu.forEach(item => {
			this.lstVatTuFull.push(item);
			if (item.child) {
				this.addListVatTu(item.child);
			}
		});
	}

	//nhóm các nút chức năng --báo cáo-----
	// getStatusButton() {
	//   let checkParent = false;
	//   let checkChirld = false;
	//   let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
	//   if (dVi && dVi.maDvi == this.userInfor.dvql) {
	//     checkChirld = true;
	//   }
	//   if (dVi && dVi.parent?.maDvi == this.userInfor.dvql) {
	//     checkParent = true;
	//   }
	//   const utils = new Utils();
	//   this.statusBtnDel = utils.getRoleDel(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
	//   this.statusBtnSave = utils.getRoleSave(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
	//   this.statusBtnApprove = utils.getRoleApprove(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
	//   this.statusBtnTBP = utils.getRoleTBP(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
	//   this.statusBtnLD = utils.getRoleLD(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
	//   this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
	//   this.statusBtnDVCT = utils.getRoleDVCT(this.baoCao?.trangThai, checkParent, this.userInfor?.roles[0]?.code);
	//   this.statusBtnCopy = utils.getRoleCopy(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
	//   this.statusBtnPrint = utils.getRolePrint(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
	// }
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
		const request = {
			dvql: this.userInfor?.dvql,
			fullName: "",
			paggingReq: {
				limit: 1000,
				page: 1
			},
			roleId: "",
			status: "",
			sysType: "",
			username: ""
		}
		this.quanLyVonPhiService.getListUserByManage(request).toPromise().then(res => {
			if (res.statusCode == 0) {
				this.allUsers = res.data?.content;
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, (err) => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
		this.quanLyVonPhiService.getListUser().toPromise().then(res => {
			if (res.statusCode == 0) {
				this.nguoiBcaos = res.data;
			}
		}, (err) => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
	}

	getStatusButton() {
		let checkParent = false;
		let checkChirld = false;
		const dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
		if (dVi && dVi.maDvi == this.userInfor.dvql) {
			checkChirld = true;
		}
		if (dVi && dVi.maDviCha == this.userInfor.dvql) {
			checkParent = true;
		}
		const utils = new Utils();
		this.statusBtnDel = utils.getRoleDel(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
		this.statusBtnSave = utils.getRoleSave(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
		this.statusBtnApprove = utils.getRoleApprove(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
		this.statusBtnTBP = utils.getRoleTBP(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
		this.statusBtnLD = utils.getRoleLD(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
		this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
		this.statusBtnDVCT = utils.getRoleDVCT(this.baoCao?.trangThai, checkParent, this.userInfor?.roles[0]?.code);
		this.statusBtnCopy = utils.getRoleCopy(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
		this.statusBtnPrint = utils.getRolePrint(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
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
					switch (item.maLoai) {
						// bm 02
						case BAO_CAO_NHAP_HANG_DTQG:
							item?.lstCtietBcaos.filter(el => {
								el.khTtien = divMoney(el.khTtien, item.maDviTien);
								el.khGiaMuaTd = divMoney(el.khGiaMuaTd, item.maDviTien);
								el.thTtien = divMoney(el.thTtien, item.maDviTien);
								el.thGiaMuaTd = divMoney(el.thGiaMuaTd, item.maDviTien);
							})
							break;
						// bm 03

						case BAO_CAO_XUAT_HANG_DTQG:
							item?.lstCtietBcaos.filter(el => {
								el.dgGiaKhoach = divMoney(el.dgGiaKhoach, item.maDviTien);
								el.dgGiaBanTthieu = divMoney(el.dgGiaBanTthieu, item.maDviTien);
								el.dgGiaBanTte = divMoney(el.dgGiaBanTte, item.maDviTien);
								el.ttGiaHtoan = divMoney(el.ttGiaHtoan, item.maDviTien);
								el.ttGiaBanTte = divMoney(el.ttGiaBanTte, item.maDviTien);
								el.ttClechGiaTteVaGiaHtoan = divMoney(el.ttClechGiaTteVaGiaHtoan, item.maDviTien);
							})
							break;

						// 04a/BCPN-X_x
						case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:
							// nhan tien va validate
							break;

						// 04a/BCPN-X_n
						case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG:
							// nhan tien va validate
							break;

						// 04b/BCPN-X
						case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
							// nhan tien va validate
							break;

						// 05/BCPBQ
						case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
							// nhan tien va validate
							break;
						default:
							break;
					}
				})

				this.lstFiles = data.data.lstFiles;
				this.listFile = [];
				this.maDonViTao = data.data.maDvi;
				this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
				this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
				this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
				this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
				this.baoCao.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);

				if (this.baoCao.trangThai == Utils.TT_BC_1 ||
					this.baoCao.trangThai == Utils.TT_BC_3 ||
					this.baoCao.trangThai == Utils.TT_BC_5 ||
					this.baoCao.trangThai == Utils.TT_BC_8) {
					this.status = false;
				} else {
					this.status = true;
				}
			} else {
				this.notification.error(MESSAGE.ERROR, data?.msg);
			}
		}, (err) => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
		})
		this.spinner.hide();
	}

	//doi so trang
	onPageIndexChange(page) {
		this.pages.page = page;
	}

	//doi so luong phan tu tren 1 trang
	onPageSizeChange(size) {
		this.pages.size = size;
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
					this.getStatusButtonOk();
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

	//lay thong tin nguoi dang nhap
	async getUserInfo(username: string) {
		const userInfo = await this.userService.getUserInfo(username).toPromise().then(
			(data) => {
				if (data?.statusCode == 0) {
					this.userInfor = data?.data
					return data?.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
		return userInfo;
	}

	resetList() {
		//nhóm biến biểu mẫu 02
		this.lstCtietBcao021 = [];
		this.lstCtietBcao022 = [];
		//nhóm biến biểu mẫu 03
		this.lstCtietBcao031 = [];
		this.lstCtietBcao032 = [];
		this.lstCtietBcao033 = [];
		//nhóm biến biểu mẫu 04ax
		this.lstCtietBcao4axI1 = [];
		this.lstCtietBcao4axI2 = [];
		this.lstCtietBcao4axI3 = [];
		this.lstCtietBcao4axII11 = [];
		this.lstCtietBcao4axII12 = [];
		this.lstCtietBcao4axII2 = [];
		this.lstCtietBcao4axII3 = [];
		this.lstCtietBcao4axIII1 = [];
		this.lstCtietBcao4axIII2 = [];
		this.lstCtietBcao4axIII3 = [];
		this.lstCtietBcao4axB = [];

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

	sortMaVtu(a, b) {
		const nameA = a.name.toUpperCase(); // ignore upper and lowercase
		const nameB = b.name.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		// names must be equal
		return 0;
	}

	newTab(maPhuLuc: any): void {
		this.getStatusButtonOk();
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
		this.closeTab();
	}

	// getStatusButtonOk() {
	//   const utils = new Utils();
	//   let checkParent = false;
	//   let checkChirld = false;
	//   let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
	//   if (dVi && dVi.maDvi == this.userInfor.dvql) {
	//     checkChirld = true;
	//   }
	//   if (dVi && dVi.parent?.maDvi == this.userInfor.dvql) {
	//     checkParent = true;
	//   }
	//   let roleNguoiTao = this.userInfor?.roles[0]?.code;
	//   let trangThaiBaoCao = this.baoCao?.trangThai;
	//   if (trangThaiBaoCao == Utils.TT_BC_7 && roleNguoiTao == '3' && checkParent && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
	//     this.statusBtnOk = false;
	//   } else if (trangThaiBaoCao == Utils.TT_BC_2 && roleNguoiTao == '2' && checkChirld && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
	//     this.statusBtnOk = false;
	//   } else if (trangThaiBaoCao == Utils.TT_BC_4 && roleNguoiTao == '1' && checkChirld && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
	//     this.statusBtnOk = false;
	//   } else {
	//     this.statusBtnOk = true;
	//   }

	//   if ((trangThaiBaoCao == Utils.TT_BC_1 || trangThaiBaoCao == Utils.TT_BC_3 || trangThaiBaoCao == Utils.TT_BC_5 || trangThaiBaoCao == Utils.TT_BC_8)
	//     && roleNguoiTao == '3' && checkChirld) {
	//     this.statusBtnFinish = false;
	//   } else {
	//     this.statusBtnFinish = true;
	//   }
	// }

	getStatusButtonOk() {
		const utils = new Utils();
		let checkParent = false;
		let checkChirld = false;
		const dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
		if (dVi && dVi.maDvi == this.userInfor.dvql) {
			checkChirld = true;
		}
		if (dVi && dVi.maDviCha == this.userInfor.dvql) {
			checkParent = true;
		}
		const roleNguoiTao = this.userInfor?.roles[0]?.code;
		const trangThaiBaoCao = this.baoCao?.trangThai;
		if (trangThaiBaoCao == Utils.TT_BC_7 && ROLE_CAN_BO.includes(roleNguoiTao) && checkParent && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
			this.statusBtnOk = false;
		} else if (trangThaiBaoCao == Utils.TT_BC_2 && ROLE_TRUONG_BO_PHAN.includes(roleNguoiTao) && checkChirld && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
			this.statusBtnOk = false;
		} else if (trangThaiBaoCao == Utils.TT_BC_4 && ROLE_LANH_DAO.includes(roleNguoiTao) && checkChirld && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
			this.statusBtnOk = false;
		} else {
			this.statusBtnOk = true;
		}

		if ((trangThaiBaoCao == Utils.TT_BC_1 || trangThaiBaoCao == Utils.TT_BC_3 || trangThaiBaoCao == Utils.TT_BC_5 || trangThaiBaoCao == Utils.TT_BC_8)
			&& ROLE_CAN_BO.includes(roleNguoiTao) && checkChirld) {
			this.statusBtnFinish = false;
		} else {
			this.statusBtnFinish = true;
		}
		this.statusBtnExport = utils.getRoleExport(trangThaiBaoCao, true, roleNguoiTao);
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
				switch (item.maLoai) {
					// bm 02
					case BAO_CAO_NHAP_HANG_DTQG:
						// nhan tien va validate
						data.khTtien = mulMoney(data.khTtien, item.maDviTien);
						data.khGiaMuaTd = mulMoney(data.khGiaMuaTd, item.maDviTien);
						data.thTtien = mulMoney(data.thTtien, item.maDviTien);
						data.thGiaMuaTd = mulMoney(data.thGiaMuaTd, item.maDviTien);
						if (data.khTtien > MONEY_LIMIT || data.khGiaMuaTd > MONEY_LIMIT || data.thTtien > MONEY_LIMIT || data.thGiaMuaTd > MONEY_LIMIT) {
							checkMoneyRange = false;
							return;
						}
						break;
					// bm 03

					case BAO_CAO_XUAT_HANG_DTQG:
						// nhan tien va validate
						data.dgGiaKhoach = mulMoney(data.dgGiaKhoach, item.maDviTien);
						data.dgGiaBanTthieu = mulMoney(data.dgGiaBanTthieu, item.maDviTien);
						data.dgGiaBanTte = mulMoney(data.dgGiaBanTte, item.maDviTien);
						data.ttGiaHtoan = mulMoney(data.ttGiaHtoan, item.maDviTien);
						data.ttGiaBanTte = mulMoney(data.ttGiaBanTte, item.maDviTien);
						data.ttClechGiaTteVaGiaHtoan = mulMoney(data.ttClechGiaTteVaGiaHtoan, item.maDviTien);
						if (data.dgGiaKhoach > MONEY_LIMIT || data.dgGiaBanTthieu > MONEY_LIMIT || data.dgGiaBanTte > MONEY_LIMIT
							|| data.ttGiaHtoan > MONEY_LIMIT || data.ttGiaBanTte > MONEY_LIMIT || data.thGittClechGiaTteVaGiaHtoanaMuaTd > MONEY_LIMIT) {
							checkMoneyRange = false;
							return;
						}
						break;

					// 04a/BCPN-X_x
					case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:
						// nhan tien va validate
						break;

					// 04a/BCPN-X_n
					case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG:
						// nhan tien va validate
						break;

					// 04b/BCPN-X
					case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
						// nhan tien va validate
						break;

					// 05/BCPBQ
					case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
						// nhan tien va validate
						break;
					default:
						break;
				}
			})
			if (!checkMoneyRange == true) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			}
		});

		if (checkMoneyRange != true || checkPersonReport != true) {
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
			baoCaoTemp.maDvi = this.maDonViTao;
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
		upfile.append('folder', this.baoCao?.maBcao + '/' + this.maDonViTao);
		const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
			(data) => {
				const objfile = {
					fileName: data.filename,
					fileSize: data.size,
					fileUrl: data.url,
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
		const dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
		if (dVi && dVi.maDvi == this.userInfor.dvql) {
			return utils.getStatusName(Status == '7' ? '6' : Status);
		}
		if (dVi && dVi.maDviCha == this.userInfor.dvql) {
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
				this.getStatusButtonOk();
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
		this.spinner.hide();
	}

	viewDetail(id) {
		const modalIn = this.modal.create({
			nzTitle: 'Danh sách phụ lục',
			nzContent: BaoCaoComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '1200px',
			nzFooter: [
				{
					label: 'Đóng',
					shape: 'round',
					onClick: () => this.modal.closeAll()
				},
			],
			nzComponentParams: {
				idDialog: id
			},
		});
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
								item.nguoiBcao = this.userInfor.username;
							}
						} else {
							const index = LISTBIEUMAUNAM.findIndex(data => data.maPhuLuc == item.maLoai);
							if (index !== -1) {
								item.tieuDe = LISTBIEUMAUNAM[index].tieuDe + this.baoCao.namBcao;
								item.tenPhuLuc = LISTBIEUMAUNAM[index].tenPhuLuc;
								item.nguoiBcao = this.userInfor.username;
							}
						}
						// voi loai bc 02 thi chi tong hop so luong
						if (item.maLoai == '4') {
							item?.lstCtietBcaos.forEach(element => {
								element.khGiaMuaTd = null;
								element.khTtien = null;
								element.thGiaMuaTd = null;
								element.thTtien = null;
							});
						} else if (item.maLoai == '5') {     // voi loai bc 03 thi chi tong hop so luong
							item?.lstCtietBcaos.forEach(element => {
								element.dgGiaBanTte = null;
								element.dgGiaBanTthieu = null;
								element.dgGiaKhoach = null;
							});
						}
					})
					this.listFile = [];
					this.baoCao.trangThai = "1";
					if (this.baoCao.trangThai == Utils.TT_BC_1 ||
						this.baoCao.trangThai == Utils.TT_BC_3 ||
						this.baoCao.trangThai == Utils.TT_BC_5 ||
						this.baoCao.trangThai == Utils.TT_BC_8) {
						this.status = false;
					} else {
						this.status = true;
					}
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
				switch (item.maLoai) {
					// bm 02
					case BAO_CAO_NHAP_HANG_DTQG:
						// nhan tien va validate
						data.khTtien = mulMoney(data.khTtien, item.maDviTien);
						data.khGiaMuaTd = mulMoney(data.khGiaMuaTd, item.maDviTien);
						data.thTtien = mulMoney(data.thTtien, item.maDviTien);
						data.thGiaMuaTd = mulMoney(data.thGiaMuaTd, item.maDviTien);
						if (data.khTtien > MONEY_LIMIT || data.khGiaMuaTd > MONEY_LIMIT || data.thTtien > MONEY_LIMIT || data.thGiaMuaTd > MONEY_LIMIT) {
							checkMoneyRange = false;
							return;
						}
						break;

					// bm 03
					case BAO_CAO_XUAT_HANG_DTQG:
						// nhan tien va validate
						data.dgGiaKhoach = mulMoney(data.dgGiaKhoach, item.maDviTien);
						data.dgGiaBanTthieu = mulMoney(data.dgGiaBanTthieu, item.maDviTien);
						data.dgGiaBanTte = mulMoney(data.dgGiaBanTte, item.maDviTien);
						data.ttGiaHtoan = mulMoney(data.ttGiaHtoan, item.maDviTien);
						data.ttGiaBanTte = mulMoney(data.ttGiaBanTte, item.maDviTien);
						data.ttClechGiaTteVaGiaHtoan = mulMoney(data.ttClechGiaTteVaGiaHtoan, item.maDviTien);
						if (data.dgGiaKhoach > MONEY_LIMIT || data.dgGiaBanTthieu > MONEY_LIMIT || data.dgGiaBanTte > MONEY_LIMIT
							|| data.ttGiaHtoan > MONEY_LIMIT || data.ttGiaBanTte > MONEY_LIMIT || data.thGittClechGiaTteVaGiaHtoanaMuaTd > MONEY_LIMIT) {
							checkMoneyRange = false;
							return;
						}
						break;

					// 04a/BCPN-X_x
					case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:
						// nhan tien va validate
						data?.listCtiet.filter(el => el.id = null);
						break;

					// 04a/BCPN-X_n
					case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG:
						// nhan tien va validate
						data?.listCtiet.filter(el => el.id = null);
						break;

					// 04b/BCPN-X
					case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
						// nhan tien va validate
						data?.listCtiet.filter(el => el.id = null);
						break;

					// 05/BCPBQ
					case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
						// nhan tien va validate
						data?.listCtiet.filter(el => el.id = null);
						break;
					default:
						break;
				}
			})
			if (!checkMoneyRange == true) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			}
		})

		if (checkMoneyRange != true) {
			return;
		} else {
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
			baoCaoTemp.maDvi = this.maDonViTao;
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

		}
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
