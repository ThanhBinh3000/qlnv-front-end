import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { MESSAGE } from '../../../../constants/message';
import { MESSAGEVALIDATE } from '../../../../constants/messageValidate';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { TRANG_THAI_PHU_LUC, Utils } from "../../../../Utility/utils";
import { PHU_LUC, Role, TRANGTHAIBAOCAO, TRANGTHAIPHULUC } from '../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';


export class ItemData {
	id: any;
	maLoai: string;
	trangThai: string;
	maDviTien: string;
	lyDoTuChoi: string;
	thuyetMinh: string;
	giaoCho: string;
	lstCtietDchinh: any[] ;
	checked: boolean;
}
@Component({
	selector: 'app-giao-nhiem-vu',
	templateUrl: './giao-nhiem-vu.component.html',
	styleUrls: ['./giao-nhiem-vu.component.scss'],
})

export class GiaoNhiemVuComponent implements OnInit {
	//thong tin dang nhap
	id!: any;
	userInfo: any;
	//thong tin chung bao cao
	maBaoCao!: string;
	namHienHanh!: number;
	ngayNhap!: string;
	nguoiNhap!: string;
	congVan!: any;
	ngayTrinhDuyet!: string;
	ngayDuyetTBP!: string;
	ngayDuyetLD!: string;
	ngayCapTrenTraKq!: string;
	trangThai: string = '1';
	maDviTao!: string;
	thuyetMinh: string;
  dotBcao: number = 1
	//danh muc
	lstDieuChinhs: ItemData[] = [];
	phuLucs: any[] = PHU_LUC;
	donVis: any[] = [];
	tabs: any[] = [];
	lstDviTrucThuoc: any[] = [];
	trangThais: any[] = TRANGTHAIBAOCAO;
	trangThaiBieuMaus: any[] = TRANG_THAI_PHU_LUC;
	canBos: any[] = [
		{
			id: "51520",
			fullName: "canbo1",
		},
		{
			id: "51550",
			fullName: "canbo2",
		},
		{
			id: "51480",
			fullName: "canbo",
		}
	];
  lstFiles: any[] = []; //show file ra man hinh
	//file
	lstFile: any = [];
	fileToUpload!: File;
	listFile: File[] = [];
	fileUrl: any;
	fileList: NzUploadFile[] = [];
	//beforeUpload: any;
	listIdFilesDelete: any = [];                        // id file luc call chi tiet
	fileDetail: NzUploadFile;
	//trang thai cac nut
	status: boolean = false;
	statusEdit: boolean = false;
	statusBtnDel: boolean = true;                       // trang thai an/hien nut xoa
	statusBtnSave: boolean = true;                      // trang thai an/hien nut luu
	statusBtnApprove: boolean = true;                   // trang thai an/hien nut trinh duyet
	statusBtnTBP: boolean = true;                       // trang thai an/hien nut truong bo phan
	statusBtnLD: boolean = true;                        // trang thai an/hien nut lanh dao
	statusBtnGuiDVCT: boolean = true;                   // trang thai nut gui don vi cap tren
	statusBtnDVCT: boolean = true;                      // trang thai nut don vi cap tren
	statusBtnCopy: boolean = true;                      // trang thai copy
	statusBtnPrint: boolean = true;                     // trang thai print
	statusBtnClose: boolean = false;
	statusBtnOk: boolean;
	statusBtnFinish: boolean;
	//khac
	data: any;
	selectedIndex: number = 1;
	allChecked = false;                         // check all checkbox

	beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = this.fileList.concat(file);
		return false;
	};

	// before uploaf file
	beforeUploadCV = (file: NzUploadFile): boolean => {
		this.fileDetail = file;
		this.congVan = {
			fileName: file.name,
			fileSize: null,
			fileUrl: null,
		};
		return false;
	};

	// upload file
	addFile() {
		const id = this.fileToUpload?.lastModified.toString();
		this.lstFile.push({ id: id, fileName: this.fileToUpload?.name });
		this.listFile.push(this.fileToUpload);
	}

	handleUpload(): void {
		this.fileList.forEach((file: any) => {
			const id = file?.lastModified.toString();
			this.lstFile.push({ id: id, fileName: file?.name });
			this.listFile.push(file);
		});
		this.fileList = [];
	}


	constructor(private router: Router,
		private routerActive: ActivatedRoute,
		private spinner: NgxSpinnerService,
		private quanLyVonPhiService: QuanLyVonPhiService,
		private datePipe: DatePipe,
		private sanitizer: DomSanitizer,
		private danhMucService: DanhMucHDVService,
		private userService: UserService,
		private notification: NzNotificationService,
		private location: Location,
		private modal: NzModalService,
	) {
		this.ngayNhap = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR,)
	}

	async ngOnInit() {
		this.id = this.routerActive.snapshot.paramMap.get('id');
		this.maDviTao = this.routerActive.snapshot.paramMap.get('maDvi');
		var nam: any = this.routerActive.snapshot.paramMap.get('namHienHanh');
		let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
		if (this.id) {
			await this.getDetailReport();
		} else {
			if (this.maDviTao && nam) {

			} else {
				this.phuLucs.forEach(item => {
					this.lstDieuChinhs.push({
						id: uuid.v4() + 'FE',
						maLoai: item.id,
						trangThai: '3',
						maDviTien: '',
						lyDoTuChoi: "",
						thuyetMinh: "",
						giaoCho: "",
						lstCtietDchinh: [],
						checked: false,
					})
				})
				this.trangThai = "1";
				this.nguoiNhap = this.userInfo?.username;
				this.maDviTao = this.userInfo?.dvql;
				this.spinner.show();
				this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
					(data) => {
						if (data.statusCode == 0) {
							this.maBaoCao = data.data;
						} else {
							this.notification.error(MESSAGE.ERROR, data?.msg);
						}
					},
					(err) => {
						this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
					}
				);
				this.maBaoCao = '';
				if (nam) {
					this.namHienHanh = parseInt(nam, 10);
				} else {
					this.namHienHanh = new Date().getFullYear();
				}
			}

		}

		//lay danh sach danh muc don vi
		await this.danhMucService.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
		this.getStatusButton();
		this.spinner.hide();
	}

	//nhóm các nút chức năng --báo cáo-----
	getStatusButton() {
		if (this.trangThai == Utils.TT_BC_1 ||
			this.trangThai == Utils.TT_BC_3 ||
			this.trangThai == Utils.TT_BC_5 ||
			this.trangThai == Utils.TT_BC_8 ||
			this.trangThai == Utils.TT_BC_10) {
			this.status = false;
		} else {
			this.status = true;
		}
		let checkParent = false;
		let checkChirld = false;
		let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
		if (dVi && dVi.maDvi == this.userInfo.dvql) {
			checkChirld = true;
		}
		if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
			checkParent = true;
		}
		let roleNguoiTao = this.userInfo?.roles[0]?.code;
		const utils = new Utils();
		this.statusBtnDel = utils.getRoleDel(this.trangThai, checkChirld, roleNguoiTao);
		this.statusBtnSave = utils.getRoleSave(this.trangThai, checkChirld, roleNguoiTao);
		this.statusBtnApprove = utils.getRoleApprove(this.trangThai, checkChirld, roleNguoiTao);
		this.statusBtnTBP = utils.getRoleTBP(this.trangThai, checkChirld, roleNguoiTao);
		this.statusBtnLD = utils.getRoleLD(this.trangThai, checkChirld, roleNguoiTao);
		this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThai, checkChirld, roleNguoiTao);
		this.statusBtnDVCT = utils.getRoleDVCT(this.trangThai, checkParent, roleNguoiTao);
		this.statusBtnCopy = utils.getRoleCopy(this.trangThai, checkChirld, roleNguoiTao);
		this.statusBtnPrint = utils.getRolePrint(this.trangThai, checkChirld, roleNguoiTao);
		if ((this.trangThai == Utils.TT_BC_7 && roleNguoiTao == '3' && checkParent) ||
			(this.trangThai == Utils.TT_BC_2 && roleNguoiTao == '2' && checkChirld) ||
			(this.trangThai == Utils.TT_BC_4 && roleNguoiTao == '1' && checkChirld)) {
			this.statusBtnOk = true;
		} else {
			this.statusBtnOk = false;
		}
		if ((this.trangThai == Utils.TT_BC_1 || this.trangThai == Utils.TT_BC_3 || this.trangThai == Utils.TT_BC_5 || this.trangThai == Utils.TT_BC_8)
			&& roleNguoiTao == '3' && checkChirld) {
			this.statusBtnFinish = false;
		} else {
			this.statusBtnFinish = true;
		}

	}

	//get user info
	async getUserInfo(username: string) {
		await this.userService.getUserInfo(username).toPromise().then(
			(data) => {
				if (data?.statusCode == 0) {
					this.userInfo = data?.data
					return data?.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
	}

	//
	selectFile(files: FileList): void {
		this.fileToUpload = files.item(0);
	}

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.maBaoCao + '/' + this.maDviTao);
		let temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
			(data) => {
				let objfile = {
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

	// xoa file trong bang file
	deleteFile(id: string): void {
		this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);

		// set list for delete
		this.listIdFilesDelete.push(id);
	}

	//download file về máy tính
	async downloadFile(id: string) {
		let file!: File;
		file = this.listFile.find(element => element?.lastModified.toString() == id);
		if (!file) {
			let fileAttach = this.lstFile.find(element => element?.id == id);
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
		if (this.congVan?.fileUrl) {
			await this.quanLyVonPhiService.downloadFile(this.congVan?.fileUrl).toPromise().then(
				(data) => {
					fileSaver.saveAs(data, this.congVan?.fileName);
				},
				err => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
		} else {
			let file: any = this.fileDetail;
			const blob = new Blob([file], { type: "application/octet-stream" });
			fileSaver.saveAs(blob, file.name);
		}
	}

	// luu
	async save() {
		//upload file
		let listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}

		// replace nhung ban ghi dc them moi id thanh null
		this.lstDieuChinhs.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

		let request = {
			id: this.id,
			fileDinhKems: listFile,
			listIdDeleteFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstDchinh: this.lstDieuChinhs,
			maBcao: this.maBaoCao,
			maDvi: this.maDviTao,
			namBcao: this.namHienHanh,
			namHienHanh: this.namHienHanh,
      dotBcao: this.dotBcao,
			tongHopTuIds: [],
		};
		this.spinner.show();
		if (this.id == null) {
			this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
				async data => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
						if (!this.id) {
							this.router.navigate([
								'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/' + data.data.id,
							])
						}
						else {
							await this.getDetailReport();
							this.getStatusButton();
						}
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				},
				err => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
		} else {
			this.quanLyVonPhiService.updatePLDieuChinh(request).toPromise().then(
				async data => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
						await this.getDetailReport();
						this.getStatusButton();
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				}, err => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				})
		}
		this.lstDieuChinhs.filter(item => {
			if (!item.id) {
				item.id = uuid.v4() + 'FE';
			}
		});
		this.spinner.hide();
	}

	// chuc nang check role
	async onSubmit(mcn: string, lyDoTuChoi: string) {
		if (this.id) {
			const requestGroupButtons = {
				id: this.id,
				maChucNang: mcn,
				lyDoTuChoi: lyDoTuChoi,
			};
			this.spinner.show();
			await this.quanLyVonPhiService.approveDieuChinh(requestGroupButtons).toPromise().then(async (data) => {
				if (data.statusCode == 0) {
					this.trangThai = mcn;
					this.getStatusButton();
					if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
					} else {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
					}
					this.tabs = [];
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			}, err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			});
			this.spinner.hide();
		} else {
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
		}
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
      modalTuChoi.afterClose.subscribe(async (text) => {
        if (text) {
          this.onSubmit(mcn, text);
        }
      });
    }


// call chi tiet bao cao
async getDetailReport() {
  this.spinner.show();
  await this.quanLyVonPhiService.bCDieuChinhDuToanChiTiet(this.id).toPromise().then(
    (data) => {
      if (data.statusCode == 0) {
        this.lstDieuChinhs = data.data.lstDchinhs;
        this.lstFiles = data.data.lstFiles;
        this.listFile = [];
        // set thong tin chung bao cao
        this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
        this.nguoiNhap = data.data.nguoiTao;
        this.maBaoCao = data.data.maBcao;
        this.maDviTao = data.data.maDvi;
        this.namHienHanh = data.data.namHienHanh;
        this.trangThai = data.data.trangThai;
        this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
        this.ngayDuyetTBP = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
        this.ngayDuyetLD = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
        this.ngayCapTrenTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
        this.congVan = data.data.congVan;
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

	// them phu luc
	addBieuMau() {
		this.phuLucs.forEach(item => item.status = false);
		var danhSach = this.phuLucs.filter(item => this.lstDieuChinhs.findIndex(e => e.maLoai == item.id) == -1);

		const modalIn = this.modal.create({
			nzTitle: 'Danh sách biểu mẫu',
			nzContent: DialogChonThemBieuMauComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '600px',
			nzFooter: null,
			nzComponentParams: {
				danhSachBieuMau: danhSach
			},
		});
		modalIn.afterClose.subscribe((res) => {
			if (res) {
				res.forEach(item => {
					if (item.status) {
						this.lstDieuChinhs.push({
							id: uuid.v4() + 'FE',
							maLoai: item.id,
							trangThai: '3',
							maDviTien: '',
							lyDoTuChoi: "",
							thuyetMinh: "",
							giaoCho: "",
							lstCtietDchinh: [],
							checked: false,
						});
					}
				})
			}
		});
	}

	// xóa với checkbox
	deleteSelected() {
		// delete object have checked = true
		this.lstDieuChinhs = this.lstDieuChinhs.filter(item => item.checked != true)
		this.allChecked = false;
	}

	// click o checkbox all
	updateAllChecked(): void {
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstDieuChinhs.checked = true
			this.lstDieuChinhs = this.lstDieuChinhs.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstDieuChinhs = this.lstDieuChinhs.map(item => ({    // checkboxall == false thi set lai lstDieuChinhs.checked = false
				...item,
				checked: false
			}));
		}
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstDieuChinhs.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
			this.allChecked = false;
		} else if (this.lstDieuChinhs.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		}
	}

	redirectChiTieuKeHoachNam() {
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		this.location.back();

	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	getUnitName(maDvi: string) {
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}

	// lay trang thai cua bieu mau
	getStatusBM(trangThai: string) {
		return this.trangThaiBieuMaus.find(e => e.id == trangThai)?.ten;
	}

	closeTab({ index }: { index: number }): void {
		this.tabs.splice(index - 1, 1);
	}

	newTab(id: any): void {
		var index: number = this.tabs.findIndex(e => e.id === id);
		if (index != -1) {
			this.selectedIndex = index + 1;
		} else {
			let item = this.lstDieuChinhs.find(e => e.maLoai == id);
			this.data = {
				...item,
				namHienHanh: this.namHienHanh,
				trangThai: this.trangThai,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				status: this.status,
			}
			this.tabs = [];
			this.tabs.push(PHU_LUC.find(e => e.id === id));
			this.selectedIndex = this.tabs.length + 1;
      console.log(this.data);

		}
	}

  getNewData(trangThai: any) {
		let index = this.lstDieuChinhs.findIndex(e => e.maLoai == this.tabs[0].id);
		if (trangThai == '-1') {
			this.getDetailReport();
			this.data = {
				...this.lstDieuChinhs[index],
				namHienHanh: this.namHienHanh,
				trangThai: this.trangThai,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				status: this.status,
			}
			this.tabs = [];
			this.tabs.push(PHU_LUC.find(e => e.id == this.lstDieuChinhs[index].maLoai));
			this.selectedIndex = this.tabs.length + 1;
		} else {
			this.lstDieuChinhs[index].trangThai = trangThai;
		}
	}

	close() {
		this.location.back();
	}

// call chi tiet bao cao
async callSynthetic() {
  this.spinner.show();
  let request = {
    maLoaiBcao: this.routerActive.snapshot.paramMap.get('loaiBaoCao'),
    namBcao: Number(this.routerActive.snapshot.paramMap.get('nam')),
    thangBcao: Number(this.routerActive.snapshot.paramMap.get('thang')) == 0 ? null : Number(this.routerActive.snapshot.paramMap.get('thang')),
    dotBcao: null,
    maPhanBcao: '0',
  }
  // await this.quanLyVonPhiService.tongHopDieuChinhDuToan(request).toPromise().then(
  //   async (data) => {
  //     if (data.statusCode == 0) {
  //       this.baoCao = data.data;
  //       await this.baoCao?.lstBcaos?.forEach(item => {
  //         item.maDviTien = '1';   // set defaul ma don vi tien la Dong
  //         item.checked = false;
  //         item.trangThai = '5';
  //         let index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
  //         if (index !== -1) {
  //           item.tieuDe = PHULUCLIST[index].tieuDe;
  //           item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
  //           item.trangThai = '3';
  //           item.nguoiBcao = this.userInfo.username;
  //         }
  //       })
  //       this.listFile = [];
  //       this.baoCao.trangThai = "1";
  //       if (this.baoCao.trangThai == Utils.TT_BC_1 ||
  //         this.baoCao.trangThai == Utils.TT_BC_3 ||
  //         this.baoCao.trangThai == Utils.TT_BC_5 ||
  //         this.baoCao.trangThai == Utils.TT_BC_8) {
  //         this.status = false;
  //       } else {
  //         this.status = true;
  //       }
  //     } else {
  //       this.notification.error(MESSAGE.ERROR, data?.msg);
  //     }
  //   },
  //   (err) => {
  //     this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
  //   }
  // );
  this.spinner.hide();
}

}
