import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCopyGiaoDuToanComponent } from 'src/app/components/dialog/dialog-copy-giao-du-toan/dialog-copy-giao-du-toan.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Roles, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { DanhMucService } from 'src/app/services/danhmuc.service';
// khai báo class data request
export class ItemData {
	id: string;
	stt: string;
	level: number;
	maNdung: number;
	tongCong: number;
	tongCongSoTranChi: number;
	lstCtietDvis: ItemDvi[] = [];
	checked!: boolean;
}

// khai báo class đơn vị
export class ItemDvi {
	id: string;
	maDviNhan: string;
	soTranChi: number;
	trangThai: string;
}

// khai báo class file
export class ItemSoQd {
	fileName: string;
	fileSize: number;
	fileUrl: number;
}

@Component({
	selector: 'app-tao-moi-giao-du-toan',
	templateUrl: './tao-moi-giao-du-toan.component.html',
	styleUrls: ['./tao-moi-giao-du-toan.component.scss']
})
export class TaoMoiGiaoDuToanComponent implements OnInit {
	@Input() data;

	@Output() dataChange = new EventEmitter();
	Op = new Operator("1")
	// khai báo kiểu dữ liệu các nút
	status = false; // trạng thái ẩn hiện thành phần
	statusBtnSave: boolean; // trạng thái ẩn hiện nút lưu
	statusBtnApprove: boolean; // trạng thái ẩn hiện nút trình duyệt
	checkSumUp: boolean; // trạng thái nút tổng hợp
	statusBtnTBP: boolean; // trạng thái nút từ chối/chấp nhận của trưởng bộ phận
	statusBtnLD: boolean; // trạng thái nút từ chối/chấp nhận của lãnh đạo
	statusBtnDVCT: boolean; // trạng thái nút từ chối/chấp nhận của đơn vị cấp trên
	statusBtnGuiDVCT = true; // trạng thái nút gửi đơn vị cấp trên
	allChecked = false; // trạng thái nút chọn tất cả
	statusBtnGiao: boolean; // trạng thái nút giao
	statusGiaoToanBo: boolean; // trạng thái nút giao toàn bộ
	statusBtnCopy: boolean; // trạng thái nút copy
	statusBtnPrint: boolean; // trạng thái nút in
	statusBtnTongHop = true; // trạng thái nút tổng hợp
	isDataAvailable = false;
	Status = Status;
	//===================================================================================

	// khai báo các thành phần
	id: string; // id bản ghi
	soQd: ItemSoQd; // số quyết định
	maPaCha: string; // mã PA/QĐ cha
	maPa: string; // mã PA bản ghi
	namPa: number; // năm tạo PA
	ngayTao: string; // ngày tạo PA
	maDviTien: string; // mã đơn vị tiền
	thuyetMinh: string; // thuyết minh
	idPaBTC: string; // id PA/QĐ cha
	maDonViTao: string; // mã đơn vị tạo PA
	trangThaiBanGhi = '1'; // trạng thái bản ghi
	maGiao: string; // mã Giao
	userInfo: any; // thông tin người dùng
	userRole: string; // role người dùng
	capDvi: string; // cấp đơn vị
	maLoai = '2'; // mã loại báo cáo (1/2)
	maDvi: string; // mã đơn vị lấy từ dữ liệu cha
	namDtoan: number; // năm dự toán
	checkTrangThaiGiao: string; // trạng thái giao
	qdGiaoDuToan: ItemSoQd;
	maDviCha: string;

	//===================================================================================

	// khai báo các list
	lstCtietBcao: ItemData[] = []; // danh sách data trong table
	donViTiens: any[] = Utils.DVI_TIEN; // danh sách đơn vị tiền
	lstDvi: any[] = []; //danh sach don vi da duoc chon
	noiDungs: any[] = []; // danh sách nội dung danh mục
	lstDviTrucThuoc: any[] = []; // danh sách báo cáo của các đơn vị trực thuộc
	fileList: NzUploadFile[] = []; // danh sách file upload
	lstFiles: any[] = []; //list file show ra màn hình
	listIdFilesDelete: any[] = []; // list id file khi xóa file
	donVis: any[] = []; // list đơn vị
	donVis1: any[] = []; // list đơn vị
	trangThais: any[] = Status.TRANG_THAI_FULL; // danh sách trạng thái
	listFile: File[] = []; // list file chua ten va id de hien tai o input
	lstDviChon: any[] = []; //danh sach don vi chua duoc chon
	soLaMa: any[] = Utils.LA_MA; // danh sách ký tự la mã
	isDvi = true;
	// khác
	editMoneyUnit = false;
	// phục vụ nút edit
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
	newDate = new Date();
	fileDetail: NzUploadFile;
	scrollX: string;
	// trước khi upload
	beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = this.fileList.concat(file);
		return false;
	};

	// before upload file
	beforeUploadQdGiaoDuToan = (file: NzUploadFile): boolean => {
		this.fileDetail = file;
		this.qdGiaoDuToan = {
			fileName: file.name,
			fileSize: null,
			fileUrl: null,
		};
		return false;
	};

	// ==================================================================================
	amount = Operator.amount;
	// cú pháp khai báo gọn của TypeScript
	constructor(
		private location: Location,
		private spinner: NgxSpinnerService,
		private userService: UserService,
		private notification: NzNotificationService,
		private danhMuc: DanhMucHDVService,
		private quanLyVonPhiService: QuanLyVonPhiService,
		private giaoDuToanChiService: GiaoDuToanChiService,
		private datePipe: DatePipe,
		private modal: NzModalService,
		public globals: Globals,
		public danhMucService: DanhMucService,
	) { }

	// ===================================================================================

	// render lần lầu khi vào trang
	async ngOnInit() {
		this.action('init');
	};

	async action(code: string) {
		this.spinner.show();
		this.isDataAvailable = false;
		switch (code) {
			case 'init':
				await this.initialization().then(() => {
					this.isDataAvailable = true;
				});
				break;
			case 'detail':
				await this.getDetailReport().then(() => {
					this.isDataAvailable = true;
				});
				break;
			case 'save':
				await this.save().then(() => {
					this.isDataAvailable = true;
				})
				break;
			case 'submit':
				await this.submitReport().then(() => {
					this.isDataAvailable = true;
				})
				break;
			case 'nonpass':
				await this.tuChoi('3').then(() => {
					this.isDataAvailable = true;
				})
				break;
			case 'pass':
				await this.onSubmit('4', null).then(() => {
					this.isDataAvailable = true;
				})
				break;
			case 'nonapprove':
				await this.tuChoi('5').then(() => {
					this.isDataAvailable = true;
				})
				break;
			case 'approve':
				await this.onSubmit('6', null).then(() => {
					this.isDataAvailable = true;
				})
				break;
			case 'approveDVCT':
				await this.onSubmit('7', null).then(() => {
					this.isDataAvailable = true;
				})
				break;
			case 'accept':
				await this.onSubmit('9', null).then(() => {
					this.isDataAvailable = true;
				})
				break;
			case 'nonaccept':
				await this.tuChoi('8').then(() => {
					this.isDataAvailable = true;
				})
				break;
			default:
				break;
		}
		this.spinner.hide();
	}

	async initialization() {

		this.spinner.show();
		const category = await this.danhMucService.danhMucChungGetAll('BC_DC_PL1');
		if (category) {
			this.noiDungs = category.data;
		}

		// lấy id bản ghi từ router
		this.id = this.data.id;

		// lấy mã đơn vị tạo PA
		this.maDonViTao = this.userInfo?.MA_DVI;
		// await this.getChildUnit();
		// lấy role người dùng
		this.userInfo = this.userService.getUserLogin();

		await this.danhMuc.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode === 0) {
					this.donVis1 = data?.data;
					this.capDvi = this.donVis1.find(e => e.maDvi == this.userInfo?.MA_DVI)?.capDvi;
				} else {
					this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE)
				}
			}
		);

		// set năm tạo PA
		this.namPa = this.newDate.getFullYear();
		await this.giaoDuToanChiService.maPhuongAnGiao('1').toPromise().then(
			(res) => {
				if (res.statusCode == 0) {
					this.maGiao = res.data;
				} else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);

		// check trường hợp tạo mới/ cập nhật/ tổng hợp
		if (this.id) {
			// call chi tiết bản ghi khi có id
			await this.getDetailReport();
		} else {
			// khi không có id thì thực hiện tạo mới
			// this.trangThaiBanGhi = '1';
			this.maDonViTao = this.userInfo?.MA_DVI;
			this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
			// this.lstDvi = this.donVis.filter(e => e?.maDviCha === this.maDonViTao && (e.type === "DV"));
			this.maDviTien = '1'
			this.listIdFilesDelete = this.data?.listIdDeleteFiles;
			this.lstCtietBcao = this.data?.lstCtiets;
			this.maDvi = this.data?.maDvi;
			this.maPaCha = this.data?.maPaCha;
			this.maPa = this.data?.maPa;
			this.maDviTien = this.data?.maDviTien;
			this.idPaBTC = this.data?.idPaBTC;
			this.namPa = this.data?.namPa;
			this.trangThaiBanGhi = this.data?.trangThai;



			if (!this.maPa) {
				this.location.back();
			}
		}
		await this.getChildUnit();


		if ((this.donVis1.find(e => e.maDvi == this.maDvi).tenVietTat.includes("CNTT") || this.donVis1.find(e => e.maDvi == this.maDvi).tenVietTat.includes("_VP")) && this.lstDvi.length == 0) {
			this.lstDvi.push(
				{
					maDvi: this.maDvi,
					tenDvi: this.donVis1.find(e => e.maDvi == this.maDvi).tenDvi
				}
			)
		}



		// if (this.userInfo.DON_VI.tenVietTat.includes("CNTT") || this.userInfo.DON_VI.tenVietTat.includes("_VP")) {
		// 	this.isDvi = false;
		// }
		if (this.status) {
			this.scrollX = (460 + 250 * (this.lstDvi.length + 1)).toString() + 'px';
		} else {
			this.scrollX = (400 + 250 * (this.lstDvi.length + 1)).toString() + 'px';
		}
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	};

	async submitReport() {
		this.modal.confirm({
			nzClosable: false,
			nzTitle: 'Xác nhận',
			nzContent: 'Bạn có chắc chắn muốn trình duyệt?<br/>(Trình duyệt trước khi lưu báo cáo có thể gây mất dữ liệu)',
			nzOkText: 'Đồng ý',
			nzCancelText: 'Không',
			nzOkDanger: true,
			nzWidth: 500,
			nzOnOk: () => {
				this.onSubmit(Status.TT_02, '')
			},
		});
	}


	statusDvi() {
		if (this.userInfo.DON_VI.tenVietTat.includes("CNTT") || this.userInfo.DON_VI.tenVietTat.includes("_VP")) {
			return true
		} else {
			return false
		}
	}

	async getChildUnit() {
		this.spinner.show();
		const request = {
			maDviCha: this.maDonViTao,
			trangThai: '01',
		}
		await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					// this.lstDvi = data.data;
					// this.lstDvi = this.lstDvi.filter(e => e.tenVietTat && (e.tenVietTat.includes("CDT") || e.tenVietTat.includes("CNTT") || e.tenVietTat.includes("_VP")))
					// if (this.userInfo.DON_VI.tenVietTat.includes("CNTT") || this.userInfo.DON_VI.tenVietTat.includes("_VP")) {
					// 	this.lstDvi.push(
					// 		{
					// 			tenDvi: this.userInfo.TEN_DVI,
					// 			maDvi: this.userInfo.MA_DVI
					// 		}
					// 	)
					// }
					this.lstDvi = data.data;
					this.lstDvi = this.lstDvi.filter(e => e.tenVietTat && (e.tenVietTat.includes("CDT") || e.tenVietTat.includes("CNTT") || e.tenVietTat.includes("_VP")))

					// this.donVis = this.lstDvi
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		)
		this.spinner.hide();
	}

	// =====================================================================================

	/**
	 * Các hàm xử lý trong màn hình
	 */

	// lấy thông tin tài khoản
	async getUserInfo(userName: string) {
		// call api và gán lại thông tin userInfo
		this.spinner.show()
		await this.userService.getUserInfo(userName).toPromise().then(
			(data) => {
				if (data?.statusCode === 0) {
					this.userInfo = data?.data;
					return data?.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);
		this.spinner.hide()
	};

	// call bản ghi chi tiết
	async getDetailReport() {
		this.spinner.show()
		// call api lấy dữ liệu
		await this.giaoDuToanChiService.QDGiaoChiTiet(this.id, this.maLoai).toPromise().then(
			(data) => {
				if (data.statusCode === 0) {
					this.id = data.data.id;
					this.idPaBTC = data.data.idPaBTC;
					this.lstCtietBcao = data.data.lstCtiets[0];
					this.maDviTien = data.data.maDviTien;
					this.checkTrangThaiGiao = data.data.trangThaiGiao;
					// this.lstDvi = [];
					this.maDviCha = data.data.maDvi.slice(0, (data.data.maDvi.length - 2));
					this.maDvi = data.data.maDvi
					this.namPa = data.data.namPa;
					this.namDtoan = data.data.namDtoan;
					this.trangThaiBanGhi = data.data.trangThai;
					this.maPa = data.data.maPa;
					this.maPaCha = data.data.maPaCha;
					this.maDonViTao = data.data.maDvi;
					this.thuyetMinh = data.data.thuyetMinh;
					this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
					this.soQd = data.data.soQd;
					this.lstFiles = data.data.lstFiles;
					this.listFile = [];
					if (!data.data.lstGiaoDtoanTrucThuocs) {
						this.lstDviTrucThuoc = []
					} else {
						this.lstDviTrucThuoc = data.data?.lstGiaoDtoanTrucThuocs;
						this.lstDviTrucThuoc.forEach(item => {
							item.ngayTrinh = this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR)
							item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR)
						})
					}
					// this.checkSumUp = data.data.checkSumUp;
					// if (this.checkSumUp == true && this.userInfo.CAP_DVI == "1" && this.trangThaiBanGhi == "6") {
					// 	this.statusBtnTongHop = false
					// }
					// if (this.lstCtietBcao[0]?.lstCtietDvis.length > 0) {
					// 	this.lstCtietBcao[0]?.lstCtietDvis.forEach(item => {
					// 		this.lstDvi.push(this.donVis.find(e => e.maDvi == item.maDviNhan))
					// 	})
					// }
					// this.lstCtietBcao.forEach(item => {
					//   item.tongCong = divMoney(item.tongCong, this.maDviTien);
					//   if (item.lstCtietDvis) {
					//     item.lstCtietDvis.forEach(e => {
					//       // e.soTranChi = divMoney(e.soTranChi, this.maDviTien) == 0 ? null : divMoney(e.soTranChi, this.maDviTien);
					//       e.soTranChi = divMoney(e.soTranChi, this.maDviTien);
					//     })
					//   }
					// })
					this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
					this.updateEditCache();
					this.getStatusButton();
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);
		this.spinner.hide();
	}

	// show popup copy
	showDialogCopy() {
		const obj = {
			namBcao: this.namDtoan,
			loaiCopy: '',
			checkDvtt: this.lstDviTrucThuoc.length > 0 ? true : false,
		}
		const modalTuChoi = this.modal.create({
			nzTitle: 'Copy Báo Cáo',
			nzContent: DialogCopyGiaoDuToanComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {
				namBcao: obj.namBcao
			},
		});
		modalTuChoi.afterClose.toPromise().then(async (response) => {
			if (response) {
				this.doCopy(response);
			}
		});
	};

	async doCopy(response) {
		let maBcaoNew: string;
		await this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
			(res) => {
				if (res.statusCode == 0) {
					maBcaoNew = res.data;
					//   let sub = "BTC";
					//  maBcaoNew =maBcaoNew.slice(0, 2) + sub +maBcaoNew.slice(2);
				} else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);

		const tongHopTuIds = [];
		this.lstDviTrucThuoc.forEach(item => {
			tongHopTuIds.push(item.id);
		})

		// gui du lieu trinh duyet len server
		const lstCtietBcaoTemp: any[] = [];
		let checkMoneyRange = true;
		this.lstCtietBcao.forEach(item => {
			if (item.tongCong > Utils.MONEY_LIMIT) {
				checkMoneyRange = false;
				return;
			}
			const data: ItemDvi[] = [];
			item.lstCtietDvis.forEach(e => {
				data.push({
					...e,
					id: null,
				})
			})
			lstCtietBcaoTemp.push({
				...item,
				lstCtietDvis: data,
				id: null,
			})
		})

		const request = {
			id: null,
			idPaBTC: this.idPaBTC,
			fileDinhKems: [],
			listIdDeleteFiles: [],
			lstCtiets: lstCtietBcaoTemp,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maPa: maBcaoNew,
			maPaCha: this.maPaCha,
			namPa: response.namBcao,
			maPhanGiao: "2",
			trangThai: this.trangThaiBanGhi,
			thuyetMinh: this.thuyetMinh,
			ngayTao: this.ngayTao,
			maLoaiDan: "1",
			maGiao: this.maGiao,
			soQd: this.soQd,
			tongHopTuIds: tongHopTuIds,
		};

		this.giaoDuToanChiService.giaoDuToan(request).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
					const modalCopy = this.modal.create({
						nzTitle: MESSAGE.ALERT,
						nzContent: DialogCopyComponent,
						nzMaskClosable: false,
						nzClosable: false,
						nzWidth: '900px',
						nzFooter: null,
						nzComponentParams: {
							maBcao: maBcaoNew
						},
					});
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);
	}

	// đóng
	back() {
		const obj = {
			id: this.data?.idPaBTC,
			tabSelected: this.data?.preTab,
		}
		this.dataChange.emit(obj);
	};

	// in
	doPrint() {
		const WindowPrt = window.open(
			'',
			'',
			'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
		);
		let printContent = '';
		printContent = printContent + '<div>';
		printContent =
			printContent + document.getElementById('tablePrint').innerHTML;
		printContent = printContent + '</div>';
		WindowPrt.document.write(printContent);
		WindowPrt.document.close();
		WindowPrt.focus();
		WindowPrt.print();
		WindowPrt.close();
	};

	// lưu phương án
	async save() {
		let checkSaveEdit;
		if (!this.maDviTien) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.lstCtietBcao.filter(item => {
			if (this.editCache[item.id].edit == true) {
				checkSaveEdit = false;
			}
		})
		if (checkSaveEdit == false) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		const lstCtietBcaoTemp: ItemData[] = [];
		let checkMoneyRange = true;
		let tongTranChi = 0;

		// gui du lieu trinh duyet len server
		this.lstCtietBcao.forEach(item => {
			if (item.tongCong > Utils.MONEY_LIMIT) {
				checkMoneyRange = false;
				return;
			}
			const data: ItemDvi[] = [];
			item.lstCtietDvis.forEach(e => {
				data.push({
					...e,
				})
				tongTranChi += e.soTranChi
			})
			lstCtietBcaoTemp.push({
				...item,
				lstCtietDvis: data,
			})
		})

		if (tongTranChi == 0) {
			this.notification.warning(MESSAGE.WARNING, 'Bảng chưa có dữ liệu, vui lòng nhập!')
			return;
		}

		if (!checkMoneyRange == true) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		lstCtietBcaoTemp.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
			item.lstCtietDvis.forEach(e => {
				if (e.id?.length == 38) {
					e.id = null;
				}
			})
		});

		//get list file url
		let checkFile = true;
		for (const iterator of this.listFile) {
			if (iterator.size > Utils.FILE_SIZE) {
				checkFile = false;
			}
		}
		if (!checkFile) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
			return;
		}
		const listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}

		const tongHopTuIds = [];
		this.lstDviTrucThuoc.forEach(item => {
			tongHopTuIds.push(item.id);
		})

		const request = JSON.parse(JSON.stringify({
			id: this.id,
			idPaBTC: this.idPaBTC,
			fileDinhKems: this.lstFiles,
			listIdFiles: this.listIdFilesDelete, // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstCtiets: lstCtietBcaoTemp,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maPa: this.maPa,
			maPaCha: this.maPaCha,
			namPa: this.namPa,
			maPhanGiao: "2",
			trangThai: this.trangThaiBanGhi,
			thuyetMinh: this.thuyetMinh,
			ngayTao: this.ngayTao,
			maLoaiDan: "1",
			maGiao: this.maGiao,
			soQd: this.soQd,
			tongHopTuIds: tongHopTuIds,
		}));
		const request1 = JSON.parse(JSON.stringify({
			id: null,
			idPaBTC: this.idPaBTC,
			fileDinhKems: this.lstFiles,
			listIdDeleteFiles: this.listIdFilesDelete, // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstCtiets: lstCtietBcaoTemp,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maPa: this.maPa,
			maPaCha: this.maPaCha,
			namPa: this.namPa,
			maPhanGiao: "2",
			trangThai: this.trangThaiBanGhi,
			thuyetMinh: this.thuyetMinh,
			ngayTao: this.ngayTao,
			maLoaiDan: "1",
			maGiao: this.maGiao,
			soQd: this.soQd,
			tongHopTuIds: tongHopTuIds,
		}));
		//get file cong van url
		const file: any = this.fileDetail;
		if (file) {
			if (file.size > Utils.FILE_SIZE) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
				return;
			} else {
				request.soQd = await this.uploadFile(file);
			}
		}
		if (file) {
			request1.soQd = await this.uploadFile(file);
		}

		// =================================================================
		this.spinner.show();
		if (!this.id) {
			this.giaoDuToanChiService.giaoDuToan(request1).toPromise().then(
				async (data) => {
					if (data.statusCode == 0) {
						if (this.trangThaiBanGhi == '1') {
							this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
						} else {
							if (this.userInfo.CAP_DVI == '2') {
								this.notification.success(MESSAGE.SUCCESS, MESSAGE.TAO_BAO_CAO_SUCCESS);
							} else if (this.userInfo.CAP_DVI == '1') {
								this.notification.success(MESSAGE.SUCCESS, MESSAGE.TONG_HOP_SUCCESS);
							}
						}
						this.id = data.data.id;
						await this.getDetailReport();
						await this.getStatusButton();
						this.listFile = [];
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				},
				(err) => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
		} else {
			this.giaoDuToanChiService.updateLapThamDinhGiaoDuToan(request).toPromise().then(
				async (data) => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
						await this.getDetailReport();
						this.getStatusButton();
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				},
				(err) => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
		}
		this.lstCtietBcao.filter(item => {
			if (!item.id) {
				item.id = uuid.v4() + 'FE';
			}
		});
		this.spinner.hide();
	};

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.maPa + '/' + this.maDonViTao);
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

	// xem chi tiết bản ghi
	xemChiTiet(id: string) {
		const obj = {
			id: id,
			preData: this.data,
			tabSelected: 'next' + this.data?.tabSelected,
		}
		this.dataChange.emit(obj);
	}

	//check role cho các nut trinh duyet
	getStatusButton() {
		if ([Status.TT_01, Status.TT_03, Status.TT_05, Status.TT_08].includes(this.trangThaiBanGhi) && this.userService.isAccessPermisson(Roles.GDT.EDIT_REPORT_PA_PBDT)) {
			this.status = false;
		} else {
			this.status = true;
		}
		if (this.checkTrangThaiGiao == "0" || this.checkTrangThaiGiao == "2") {
			this.statusGiaoToanBo = false;
		} else {
			this.statusGiaoToanBo = true;
		}




		const dVi = this.donVis1.find(e => e.maDvi == this.maDonViTao);
		let checkParent = false;
		if (dVi && dVi?.maDviCha == this.userInfo.MA_DVI) {
			checkParent = true;
		}
		// const isParent = this.userInfo.MA_DVI == this.maDviCha;
		const checkChirld = this.maDonViTao == this.userInfo?.MA_DVI;
		const checkSave = this.userService.isAccessPermisson(Roles.GDT.EDIT_REPORT_PA_PBDT);
		// this.statusBtnSave = this.getBtnStatus([Status.TT_01], Roles.GDT.EDIT_REPORT_PA_PBDT, checkChirld);
		this.statusBtnSave = Status.check('saveWOHist', this.trangThaiBanGhi) && checkSave && checkChirld;


		this.statusBtnApprove = this.getBtnStatus([Status.TT_01], Roles.GDT.APPROVE_REPORT_PA_PBDT, checkChirld);
		this.statusBtnTBP = this.getBtnStatus([Status.TT_02], Roles.GDT.DUYET_REPORT_PA_PBDT, checkChirld);
		this.statusBtnLD = this.getBtnStatus([Status.TT_04], Roles.GDT.PHE_DUYET_REPORT_PA_PBDT, checkChirld);
		this.statusBtnCopy = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.GDT.COPY_REPORT_PA_PBDT, checkChirld);
		this.statusBtnPrint = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.GDT.PRINT_REPORT, checkChirld);
		this.statusBtnDVCT = this.getBtnStatus([Status.TT_06, Status.TT_07], Roles.GDT.TIEPNHAN_TUCHOI_PA_PBDT, checkParent);

		if (this.userService.isAccessPermisson(Roles.GDT.GIAO_PA_PBDT) && this.soQd) {
			this.statusBtnGiao = false;
		} else {
			this.statusBtnGiao = true;
			this.statusGiaoToanBo = true;
		}
		if (this.userService.isAccessPermisson(Roles.GDT.GIAODT_TRINHTONGCUC_PA_PBDT) && this.soQd?.fileName != null && this.trangThaiBanGhi == '6' && this.userInfo.CAP_DVI == "2") {
			this.statusBtnGuiDVCT = false;
		}
		if (this.trangThaiBanGhi == "7") {
			this.statusBtnGuiDVCT = true;
			this.statusGiaoToanBo = true;
		}

	}

	getBtnStatus(status: string[], role: string, check: boolean) {
		return !(status.includes(this.trangThaiBanGhi) && this.userService.isAccessPermisson(role) && check);
	}

	// submit các nút chức năng check role
	async onSubmit(mcn: string, lyDoTuChoi: string) {
		if (this.id) {
			const requestGroupButtons = {
				id: this.id,
				maChucNang: mcn,
				lyDoTuChoi: lyDoTuChoi,
				maLoai: this.maLoai,
			};

			let tongGiao = 0;
			let tongCong = 0;
			this.lstCtietBcao.forEach(item => {
				if (item.level == 0) {
					tongGiao += item?.tongCongSoTranChi;
					tongCong += item?.tongCong;
				}
			})

			if (tongGiao !== tongCong) {
				return this.notification.warning(MESSAGE.WARNING, "Chưa giao hết số tiền được giao từ đơn vị cấp trên");
			} else {
				this.spinner.show();
				this.giaoDuToanChiService.trinhDuyetPhuongAnGiao(requestGroupButtons).toPromise().then(async (data) => {
					if (data.statusCode == 0) {
						this.trangThaiBanGhi = mcn;
						this.getStatusButton();
						if (mcn == Status.TT_08 || mcn == Status.TT_05 || mcn == Status.TT_03) {
							this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
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
			}

			// this.spinner.show();
			// await this.giaoDuToanChiService.trinhDuyetPhuongAnGiao(requestGroupButtons).toPromise().then(async (data) => {
			// 	if (data.statusCode == 0) {
			// 		this.trangThaiBanGhi = mcn;
			// 		this.getStatusButton();
			// 		if (mcn == Status.TT_08 || mcn == Status.TT_05 || mcn == Status.TT_03) {
			// 			this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
			// 		} else {
			// 			this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
			// 		}
			// 		// if (this.userInfo?.roles[0]?.code == 'C_KH_VP_LD' && this.soQd) {
			// 		//   this.statusBtnGuiDVCT = false;
			// 		// }
			// 	} else {
			// 		this.notification.error(MESSAGE.ERROR, data?.msg);
			// 	}
			// }, err => {
			// 	this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			// });
			// this.spinner.hide();
		} else {
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
		}
	};

	// từ chối
	async tuChoi(mcn: string) {
		const modalTuChoi = this.modal.create({
			nzTitle: 'Từ chối',
			nzContent: DialogTuChoiComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {},
		});
		modalTuChoi.afterClose.subscribe(async (text) => {
			if (text) {
				this.onSubmit(mcn, text);
			}
		});
	};

	// xem chi tiết PA cha
	// xemCtietPaBTC() {
	//   if (!this.idPaBTC) {
	//     return;
	//   }
	//   const capDviUser = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
	//   let url: string;
	//   if (capDviUser == Utils.TONG_CUC) {
	//     url = '/' + MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/' + this.idPaBTC;
	//   } else if (this.maPaCha.includes('BTC')) {
	//     url = '/' + MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/' + this.idPaBTC;
	//   } else {
	//     if (capDviUser == Utils.CUC_KHU_VUC) {
	//       url = '/' + MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/nhan-du-toan-chi-NSNN-cho-cac-don-vi/' + this.idPaBTC;
	//     } else {
	//       url = '/' + MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/' + this.idPaBTC;
	//     }
	//   }
	//   window.open(url, '_blank');
	// };
	// xem chi tiết PA cha
	xemCtietPaBTC() {
		if (!this.idPaBTC) {
			return;
		}
		if (this.userService.isTongCuc()) {
			const obj = {
				id: this.idPaBTC,
				preData: this.data,
				tabSelected: 'quyetDinhBTC',
			}
			this.dataChange.emit(obj);
		}
		else {
			// url = '/' + MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/nhan-du-toan-chi-NSNN-cho-cac-don-vi/' + this.idPaBTC;
			// window.open(url, '_blank')
			const obj = {
				id: this.idPaBTC,
				preData: this.data,
				tabSelected: 'giaoTuCapTren',
			}
			this.dataChange.emit(obj);
		}
	};

	// lấy tên đơn vị
	getUnitName(maDvi: string) {
		return this.lstDvi.find((item) => item.maDvi == maDvi)?.tenDvi;
	}

	// lấy thông tin trạng thái PA
	getStatusName() {
		if (this.trangThaiBanGhi == Status.TT_06) {
			return "Phê duyệt"
		}
		return this.trangThais.find(e => e.id == this.trangThaiBanGhi)?.tenDm;
	};

	// tạo số thứ tự
	getChiMuc(str: string) {
		str = str.substring(str.indexOf('.') + 1, str.length);
		let xau = "";
		const chiSo: any = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		if (n == 0) {
			for (let i = 0; i < this.soLaMa.length; i++) {
				while (k >= this.soLaMa[i].gTri) {
					xau += this.soLaMa[i].kyTu;
					k -= this.soLaMa[i].gTri;
				}
			}
		}
		if (n == 1) {
			xau = chiSo[n];
		}
		if (n == 2) {
			xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
		}
		if (n == 3) {
			xau = String.fromCharCode(k + 96);
		}
		if (n == 4) {
			xau = "-";
		}
		return xau;
	};

	// lấy phần đuôi của stt
	getTail(str: string): number {
		return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
	}

	//tìm vị trí cần để thêm mới
	findVt(str: string): number {
		const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
		let index: number = start;
		for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
			if (this.lstCtietBcao[i].stt.startsWith(str)) {
				index = i;
			}
		}
		return index;
	}

	//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
	replaceIndex(lstIndex: number[], heSo: number) {
		//thay doi lai stt cac vi tri vua tim duoc
		lstIndex.forEach(item => {
			const str = Table.preIndex(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
			const nho = this.lstCtietBcao[item].stt;
			this.lstCtietBcao.forEach(item => {
				item.stt = item.stt.replace(nho, str);
			})
		})
	}

	// kiểm tra cấp quyền sửa nếu phần tử chọn có phần tử con
	getLowStatus(stt: string) {
		const index: number = this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == stt);
		if (index == -1) {
			return false;
		}
		return true;
	};

	// chỉnh sửa phần tử
	startEdit(id: string): void {
		this.editCache[id].edit = true;
	}

	// lưu chỉnh sửa
	saveEdit(id: string): void {
		// set checked editCache = checked lstCtietBcao
		this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked;
		// lay vi tri hang minh sua
		const index = this.lstCtietBcao.findIndex(item => item.id === id);
		const data: ItemDvi[] = [];

		// check dòng có số âm, chưa có dữ liệu
		let tongTranChi = 0;
		for (let itm of this.editCache[id].data.lstCtietDvis) {
			if (itm.soTranChi < 0) {
				this.notification.warning(MESSAGE.WARNING, 'giá trị nhập không được âm')
				return;
			}
			tongTranChi += itm.soTranChi;
		}
		if (tongTranChi == null) {
			this.notification.warning(MESSAGE.WARNING, 'Dòng chưa có dữ liệu, vui lòng nhập!')
			return;
		}
		if (tongTranChi !== this.editCache[id].data.tongCong) {
			this.notification.warning(MESSAGE.WARNING, 'Tổng số tiền phân bổ phải bằng số tiền được giao!')
			return;
		}

		this.editCache[id].data.lstCtietDvis.forEach(item => {
			data.push({
				id: item.id,
				maDviNhan: item.maDviNhan,
				soTranChi: item.soTranChi,
				trangThai: item.trangThai,
			})
		})
		this.lstCtietBcao[index] = {
			...this.editCache[id].data,
			lstCtietDvis: data,
		}
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.updateEditCache();
		this.sum(this.lstCtietBcao[index].stt);
	}

	// hủy chỉnh sửa
	cancelEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);
		// lay vi tri hang minh sua
		const data: ItemDvi[] = [];
		this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
			data.push({
				id: item.id,
				maDviNhan: item.maDviNhan,
				soTranChi: item.soTranChi,
				trangThai: item.trangThai,
			})
		})
		this.editCache[id] = {
			data: {
				...this.lstCtietBcao[index],
				lstCtietDvis: data,
			},
			edit: false
		};
	}



	//kiểm tra các phần tử con có cùng được đánh dấu hay ko
	checkAllChild(str: string): boolean {
		let nho = true;
		this.lstCtietBcao.forEach(item => {
			if ((Table.preIndex(item.stt) == str) && (!item.checked) && (item.stt != str)) {
				nho = item.checked;
			}
		})
		return nho;
	}

	// update lại list obj được chọn
	updateChecked(id: string) {
		const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
		//đặt các phần tử con có cùng trạng thái với nó
		this.lstCtietBcao.forEach(item => {
			if (item.stt.startsWith(data.stt)) {
				item.checked = data.checked;
			}
		})
		//thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
		let index: number = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(data.stt));
		if (index == -1) {
			this.allChecked = this.checkAllChild('0');
		} else {
			let nho: boolean = this.lstCtietBcao[index].checked;
			while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
				this.lstCtietBcao[index].checked = !nho;
				index = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(this.lstCtietBcao[index].stt));
				if (index == -1) {
					this.allChecked = !nho;
					break;
				}
				nho = this.lstCtietBcao[index].checked;
			}
		}
	};

	// lắng nghe thay đổi của dòng
	changeModel(id: string) {
		this.editCache[id].data.tongCongSoTranChi = 0;
		this.editCache[id].data.lstCtietDvis.forEach(item => {
			this.editCache[id].data.tongCongSoTranChi += item.soTranChi;
		})
	};

	// call api giao số liệu trong cột được chọn
	giaoSoTranChi(maDviNhan: any) {
		this.spinner.show();
		const lstGiao: any[] = [];
		if (maDviNhan) {
			const lstCtiet: any[] = [];
			this.lstCtietBcao.forEach(item => {
				lstCtiet.push({
					stt: item.stt,
					maNdung: item.maNdung,
					soTien: item.lstCtietDvis.find(e => e.maDviNhan == maDviNhan).soTranChi,
				})
			});
			if (this.userInfo.CAP_DVI == "1") {
				lstGiao.push({
					maGiao: this.maGiao,
					maPa: this.maPa,
					maPaCha: this.maPa,
					maDvi: this.maDonViTao,
					maDviNhan: maDviNhan,
					trangThai: '1',
					maDviTien: this.maDviTien,
					soQd: this.soQd,
					listCtiet: lstCtiet,
					maLoaiDan: "1",
					namDtoan: this.namPa,
					ngayGiao: this.ngayTao,
					ngayTao: this.ngayTao,
				});
			} else {
				lstGiao.push({
					maGiao: this.maGiao,
					maPa: this.maPa,
					maPaCha: this.maPaCha,
					maDvi: this.maDonViTao,
					maDviNhan: maDviNhan,
					trangThai: '1',
					maDviTien: this.maDviTien,
					soQd: this.soQd,
					listCtiet: lstCtiet,
					maLoaiDan: "1",
					namDtoan: this.namPa,
					ngayGiao: this.ngayTao,
					ngayTao: this.ngayTao,
				});
			}

		} else {
			if (this.lstCtietBcao.length > 0) {
				this.lstCtietBcao[0].lstCtietDvis.forEach(item => {
					if (item.trangThai == null) {
						const lstCtiet: any[] = [];

						this.lstCtietBcao.forEach(data => {
							const soTien = data.lstCtietDvis.find(e => e.maDviNhan == item.maDviNhan).soTranChi
							lstCtiet.push({
								stt: data.stt,
								maNdung: data.maNdung,
								soTien: soTien,
							})
						});
						if (this.userInfo.CAP_DVI == "1") {
							lstGiao.push({
								maGiao: this.maGiao,
								maPa: this.maPa,
								maPaCha: this.maPa,
								maDvi: this.maDonViTao,
								maDviNhan: item.maDviNhan,
								trangThai: '1',
								maDviTien: this.maDviTien,
								soQd: this.soQd,
								listCtiet: lstCtiet,
								maLoaiDan: "1",
								namDtoan: this.namPa,
								ngayGiao: this.ngayTao,
								ngayTao: this.ngayTao,
							});
						} else {
							lstGiao.push({
								maGiao: this.maGiao,
								maPa: this.maPa,
								maPaCha: this.maPaCha,
								maDvi: this.maDonViTao,
								maDviNhan: item.maDviNhan,
								trangThai: '1',
								maDviTien: this.maDviTien,
								soQd: this.soQd,
								listCtiet: lstCtiet,
								maLoaiDan: "1",
								namDtoan: this.namPa,
								ngayGiao: this.ngayTao,
								ngayTao: this.ngayTao,
							});
						}
					}
				});
			}
		}
		this.giaoDuToanChiService.giaoSoTranChiGiaoDuToan(lstGiao).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					if (maDviNhan) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_SUCCESS);
					} else {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_TOAN_BO);
					}
					this.getDetailReport();
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		)
		this.spinner.hide();
	}

	// lấy tên đơn vị trực thuộc
	getUnitNameDviTT(maDviTT: string) {
		return this.lstDvi.find(e => e.maDvi == maDviTT)?.tenDvi;
	}

	// hiển thị trạng thái báo cáo của đơn vị trực thuộc
	getStatusNameDviTT(trangThaiDVTT: string) {
		return this.trangThais.find(e => e.id == trangThaiDVTT)?.tenDm;
	};

	// upload danh sách văn bản đính kèm
	handleUpload() {
		this.fileList.forEach((file: any) => {
			const id = file?.lastModified.toString();
			this.lstFiles.push({ id: id, fileName: file?.name });
			this.listFile.push(file);
		});
		this.fileList = [];
	};

	// download file về máy tính
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
	};

	// download file công văn
	async downloadFileCv() {
		if (this.soQd?.fileUrl) {
			await this.quanLyVonPhiService.downloadFile(this.soQd?.fileUrl).toPromise().then(
				(data) => {
					fileSaver.saveAs(data, this.soQd?.fileName);
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
	};

	// xóa file
	deleteFile(id: string) {
		this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
		this.listIdFilesDelete.push(id);
	};

	// update list checked
	updateAllChecked() {
		this.lstCtietBcao.forEach(item => {
			item.checked = this.allChecked;
		})
	};

	// xóa cột
	deleteCol(maDvi: string) {
		this.lstCtietBcao.forEach(data => {
			data.lstCtietDvis = data.lstCtietDvis.filter(e => e.maDviNhan != maDvi);
		})
		this.lstDviChon.push(this.lstDvi.find(e => e.maDvi == maDvi));
		this.lstDvi = this.lstDvi.filter(e => e.maDvi != maDvi);

	};

	// thêm cột
	addCol(maDvi: string) {
		this.lstDvi.push(this.lstDviChon.find(e => e.maDvi == maDvi));
		this.lstDviChon = this.lstDviChon.filter(e => e.maDvi != maDvi);
		this.lstCtietBcao.forEach(data => {
			data.lstCtietDvis.push({
				id: uuid.v4() + 'FE',
				maDviNhan: maDvi,
				soTranChi: 0,
				trangThai: "0",
			})
		})
	}

	// thêm nhiều cột
	addAllCol() {
		const obj = {
			danhSachDonVi: this.lstDviChon,
			multi: true,
		}
		const modalIn = this.modal.create({
			nzTitle: 'Danh sách đơn vị',
			nzContent: DialogLuaChonThemDonViComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '65%',
			nzFooter: null,
			nzComponentParams: {
				obj: obj
			},
		});
		modalIn.afterClose.subscribe((res) => {
			if (res) {
				res.forEach(item => {
					if (item.status) {
						this.addCol(item.maDvi);
					}
				})
				this.updateEditCache();
			}
		});
	}

	// gán editCache.data = lstCtietBcao
	updateEditCache(): void {
		this.lstCtietBcao.forEach(item => {
			const data: ItemDvi[] = [];
			if (item.lstCtietDvis) {
				item.lstCtietDvis.forEach(e => {
					data.push({
						id: e.id,
						maDviNhan: e.maDviNhan,
						soTranChi: e.soTranChi,
						trangThai: e.trangThai,
					});
				})
			}
			this.editCache[item.id] = {
				edit: false,
				data: {
					id: item.id,
					stt: item.stt,
					level: item.level,
					maNdung: item.maNdung,
					tongCongSoTranChi: item.tongCongSoTranChi,
					tongCong: item.tongCong,
					lstCtietDvis: data,
					checked: false,
				}
			}
		})
	}

	// tính tổng
	sum(stt: string) {
		stt = Table.preIndex(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			const data = this.lstCtietBcao[index];
			const mm: any[] = [];
			data.lstCtietDvis.forEach(item => {
				mm.push({
					...item,
					soTranChi: 0,
				})
			});
			this.lstCtietBcao[index] = {
				id: data.id,
				stt: data.stt,
				level: data.level,
				maNdung: data.maNdung,
				tongCong: data.tongCong,
				tongCongSoTranChi: 0,
				lstCtietDvis: mm,
				checked: false,
			};
			this.lstCtietBcao.forEach(item => {
				if (Table.preIndex(item.stt) == stt) {
					item.lstCtietDvis.forEach(e => {
						const ind = this.lstCtietBcao[index].lstCtietDvis.findIndex(i => i.maDviNhan == e.maDviNhan);
						this.lstCtietBcao[index].lstCtietDvis[ind].soTranChi += Number(e.soTranChi);
					})
					this.lstCtietBcao[index].tongCongSoTranChi = Operator.sum([this.lstCtietBcao[index].tongCongSoTranChi, item.tongCongSoTranChi])
				}
			});
			stt = Table.preIndex(stt);
		};
	};

	// sum1() {
	//   this.lstCtietBcao.forEach(itm => {
	//     let stt = Table.preIndex(itm.stt);
	//     while (stt != '0') {
	//       const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
	//       const data = this.lstCtietBcao[index];
	//       const mm: any[] = [];
	//       data.lstCtietDvis.forEach(item => {
	//         mm.push({
	//           ...item,
	//           soTranChi: 0,
	//         })
	//       });
	//       this.lstCtietBcao[index] = {
	//         id: data.id,
	//         stt: data.stt,
	//         level: data.level,
	//         maNdung: data.maNdung,
	//         tongCong: 0,
	//         lstCtietDvis: mm,
	//         checked: false,
	//       };
	//       this.lstCtietBcao.forEach(item => {
	//         if (Table.preIndex(item.stt) == stt) {
	//           item.lstCtietDvis.forEach(e => {
	//             const ind = this.lstCtietBcao[index].lstCtietDvis.findIndex(i => i.maDviNhan == e.maDviNhan);
	//             if (e.soTranChi) {
	//               this.lstCtietBcao[index].lstCtietDvis[ind].soTranChi += Number(e?.soTranChi);
	//             }
	//           })
	//         }
	//       })
	//       this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
	//         this.lstCtietBcao[index].tongCong += Number(item.soTranChi);
	//       })
	//       stt = Table.preIndex(stt);
	//     };
	//   })
	// };

	// tính tổng
	// tinhTong() {
	//   this.lstCtietBcao.forEach(item => {
	//     const sttItem = item.stt
	//     const index = this.lstCtietBcao.findIndex(e => e.stt == sttItem);
	//     this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
	//       this.lstCtietBcao[index].tongCong = 0
	//       this.lstCtietBcao[index].tongCong += Number(item.soTranChi);
	//     })
	//   })
	// };

	getMoneyUnit() {
		return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
	}

	deleteQdCv() {
		this.soQd.fileName = null;
		this.soQd.fileSize = null;
		this.soQd.fileUrl = null;
		const request = JSON.parse(JSON.stringify(
			{
				id: null,
				namDtoan: this.namPa,
				maPa: this.maPa,
				soQd: this.soQd,
				maGiao: this.maGiao,
			}
		))

		this.giaoDuToanChiService.themMoiQdCvGiaoNSNN(request).toPromise().then(async data => {
			if (data.statusCode == 0) {
				this.notification.success(MESSAGE.SUCCESS, 'Xóa thành công');
				this.getStatusButton();
			} else {
				this.notification.error(MESSAGE.ERROR, data?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
		})
	}

	statusDeleteCv() {
		if (!this.userService.isAccessPermisson(Roles.GDT.EDIT_REPORT_CV_QD_GIAO_PA_PBDT)) {
			return false;
		}
		if (!this.soQd?.fileName) {
			return false;
		}
		let check = true;
		this.lstDviTrucThuoc.forEach(item => {
			if (item.trangThai == '1') {
				check = false;
				return;
			}
		})
		return check;
	};



}

