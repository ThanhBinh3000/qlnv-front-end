import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogDieuChinhCopyComponent } from './../../../../components/dialog/dialog-dieu-chinh-copy/dialog-dieu-chinh-copy.component';
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
import { TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from "../../../../Utility/utils";
import { PHU_LUC } from '../quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';


// export class ItemData {
// 	id: any;
// 	maLoai: string;
// 	trangThai: string;
// 	maDviTien: string;
// 	lyDoTuChoi: string;
// 	thuyetMinh: string;
// 	giaoCho: string;
// 	lstCtietLapThamDinhs: any[];
// 	checked: boolean;
// }
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

export class ItemCongVan {
	fileName: string;
	fileSize: number;
	fileUrl: number;
}
@Component({
	selector: 'app-giao-nhiem-vu',
	templateUrl: './giao-nhiem-vu.component.html',
	styleUrls: ['./giao-nhiem-vu.component.scss'],
})

export class GiaoNhiemVuComponent implements OnInit {
	//thong tin dang nhap
	id!: any;
  loai!: string;
	userInfo: any;
	//thong tin chung bao cao
	maBaoCao!: string;
	namHienHanh: number = new Date().getFullYear();
	ngayNhap!: string;
	nguoiNhap!: string;
	congVan: ItemCongVan = new ItemCongVan();
	ngayTrinhDuyet!: string;
	ngayDuyetTBP!: string;
	ngayDuyetLD!: string;
	ngayCapTrenTraKq!: string;
	trangThaiBaoCao: string = '1';
	maDviTao!: string;
	thuyetMinh: string;
	lyDoTuChoi: string;
  dotBcao: number = 1;
	//danh muc
	lstDieuChinhs: ItemData[] = [];
	phuLucs: any[] = JSON.parse(JSON.stringify(PHU_LUC)) ;
	donVis: any[] = [];
	tabs: any[] = [];
	lstDviTrucThuoc: any[] = [];
	trangThaiBaoCaos: any[] = [
		{
			id: Utils.TT_BC_1,
			tenDm: "Đang soạn",
		},
		{
			id: Utils.TT_BC_2,
			tenDm: "Trình duyệt",
		},
		{
			id: Utils.TT_BC_3,
			tenDm: "Trưởng BP từ chối",
		},
		{
			id: Utils.TT_BC_4,
			tenDm: "Trưởng BP chấp nhận",
		},
		{
			id: Utils.TT_BC_5,
			tenDm: "Lãnh đạo từ chối",
		},
		{
			id: Utils.TT_BC_7,
			tenDm: "Lãnh đạo chấp nhận",
		},
		{
			id: Utils.TT_BC_8,
			tenDm: "Từ chối",
		},
		{
			id: Utils.TT_BC_9,
			tenDm: "Tiếp nhận",
		},
	];;
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
	listFile: File[] = [];                      // list file chua ten va id de hien tai o input
	fileList: NzUploadFile[] = [];
	fileDetail: NzUploadFile;
	//beforeUpload: any;
	listIdFilesDelete: any = [];                        // id file luc call chi tiet
	//trang thai cac nut
	status: boolean = false;
	statusEdit: boolean = false;
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

	// before uploaf file
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

	// them file vao danh sach
	handleUpload(): void {
		this.fileList.forEach((file: any) => {
			const id = file?.lastModified.toString();
			this.lstFiles.push({ id: id, fileName: file?.name });
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
    this.loai = this.routerActive.snapshot.paramMap.get('loai');
		this.maDviTao = this.routerActive.snapshot.paramMap.get('maDvi');
		var dotBcaoDieuChinh = this.routerActive.snapshot.paramMap.get('dotBcao');
		var nam: any = this.routerActive.snapshot.paramMap.get('namHienHanh');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		if (this.id) {
			await this.getDetailReport();
		} else {
			if (dotBcaoDieuChinh && nam) {
        this.loai = "1";
				this.namHienHanh = parseInt(nam, 10);
				await this.tongHop();
				this.trangThaiBaoCao = "1";
				this.nguoiNhap = this.userInfo?.username;
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
			} else {
        this.loai = "0";
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

				this.trangThaiBaoCao = "1";
				this.nguoiNhap = this.userInfo?.username;
				this.maDviTao = this.userInfo?.dvql;
				this.spinner.show();
				this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
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
					// this.namHienHanh = new Date().getFullYear();
          // this.phuLucs.forEach(item => {
          //   item.tenDm = item.tenDm.replace("N",  this.namHienHanh)
          // })
				}
			}

		}
    this.changeNam();
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

  changeNam(){
    this.phuLucs.forEach(item => {
      item.tenDm = PHU_LUC.find(el => el.id == item.id)?.tenDm + this.namHienHanh;
    })
  }

	//nhóm các nút chức năng --báo cáo-----
	getStatusButton() {
		if (this.trangThaiBaoCao == Utils.TT_BC_1 ||
			this.trangThaiBaoCao == Utils.TT_BC_3 ||
			this.trangThaiBaoCao == Utils.TT_BC_5 ||
			this.trangThaiBaoCao == Utils.TT_BC_8 ||
			this.trangThaiBaoCao == Utils.TT_BC_10) {
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
		this.statusBtnSave = utils.getRoleSave(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnLD = utils.getRoleLD(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBaoCao, checkParent, roleNguoiTao);
		this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnPrint = utils.getRolePrint(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		if ((this.trangThaiBaoCao == Utils.TT_BC_7 && roleNguoiTao == '3' && checkParent) ||
			(this.trangThaiBaoCao == Utils.TT_BC_2 && roleNguoiTao == '2' && checkChirld) ||
			(this.trangThaiBaoCao == Utils.TT_BC_4 && roleNguoiTao == '1' && checkChirld)) {
			this.statusBtnOk = true;
		} else {
			this.statusBtnOk = false;
		}
		if ((this.trangThaiBaoCao == Utils.TT_BC_1 || this.trangThaiBaoCao == Utils.TT_BC_3 || this.trangThaiBaoCao == Utils.TT_BC_5 || this.trangThaiBaoCao == Utils.TT_BC_8)
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
		this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
		this.listIdFilesDelete.push(id);
	}

	//download file về máy tính
  async downloadFile(id: string) {
    let file!: File;
    file = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      let fileAttach = this.lstFiles.find(element => element?.id == id);
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
    // check lưu trong bảng trước khi nhấn lưu
    let checkSave = true;
    this.lstDieuChinhs.forEach(e => {
      if (!e.giaoCho) {
        checkSave = false;
      }
    })
    if (!checkSave) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }

		// replace nhung ban ghi dc them moi id thanh null
		this.lstDieuChinhs.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

    // thêm cac dvi trực thuộc vào danh sách thêm mới sau khi tổng hợp
		let tongHopTuIds = [];
		this.lstDviTrucThuoc.forEach(item => {
			tongHopTuIds.push(item.id);
		})

    //get list file url
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

		let request = JSON.parse(JSON.stringify({
			id: this.id,
			fileDinhKems: this.lstFiles,
			listIdDeleteFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstDchinh: this.lstDieuChinhs,
			maBcao: this.maBaoCao,
			maDvi: this.maDviTao,
			namBcao: this.namHienHanh,
			namHienHanh: this.namHienHanh,
      dotBcao: this.dotBcao,
      congVan: this.congVan,
			tongHopTuIds: tongHopTuIds,
		}));
    if (request.congVan.fileName == null){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return;
    }
    //get file cong van url
		let file: any = this.fileDetail;
		if (file) {
			request.congVan = await this.uploadFile(file);
		}

		//call service them moi
		this.spinner.show();
		if (this.id == null) {
			this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
				async data => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
						if (!this.id) {
							this.router.navigate([
								'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/'+ data.data.id
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
			this.quanLyVonPhiService.updateDieuChinh(request).toPromise().then(
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
		if (mcn == Utils.TT_BC_2){
			let check = true;
			this.lstDieuChinhs.forEach(item => {
				if (item.trangThai != '5'){
					check = false;
				}
			})
			if (!check){
				this.notification.warning(MESSAGE.ERROR, "Vui lòng hoàn tất nhập liệu các biểu mẫu trước khi thực hiện thao tác!");
				return;
			}
		}
		if (this.id) {
			const requestGroupButtons = {
				id: this.id,
				maChucNang: mcn,
				lyDoTuChoi: lyDoTuChoi,
			};
			this.spinner.show();
			await this.quanLyVonPhiService.approveDieuChinh(requestGroupButtons).toPromise().then(async (data) => {
				if (data.statusCode == 0) {
					this.trangThaiBaoCao = mcn;
					this.getStatusButton();
          // this.getStatusButtonOk();
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
					this.lstDviTrucThuoc = data.data.lstDchinhDviTrucThuocs;
          this.lstFiles = data.data.lstFiles;
					this.listFile = [];
					// set thong tin chung bao cao
					this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
					this.nguoiNhap = data.data.nguoiTao;
					this.maBaoCao = data.data.maBcao;
					this.maDviTao = data.data.maDvi;
					this.namHienHanh = data.data.namHienHanh;
					this.trangThaiBaoCao = data.data.trangThai;
					this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
					this.ngayDuyetTBP = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
					this.ngayDuyetLD = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					this.ngayCapTrenTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
					this.congVan = data.data.congVan;
					this.lstDviTrucThuoc.forEach(item => {
						item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
						item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					})
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

	// call tong hop dieu chinh
	async tongHop() {
		let request = {
			dotBcao: this.dotBcao,
			namBcao: this.namHienHanh,
		}
		this.spinner.show();
		await this.quanLyVonPhiService.tongHopDieuChinhDuToan(request).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.lstDieuChinhs = data.data.lstDchinhs;
					this.lstDviTrucThuoc = data.data.lstDchinhDviTrucThuocs;
					this.lstDieuChinhs.forEach(item => {
						if (!item.id){
							item.id = uuid.v4() + 'FE';
						}
						item.giaoCho = this.userInfo?.username;
						item.maDviTien = '1';
					})
					this.lstDviTrucThuoc.forEach(item => {
						item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
						item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					})
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
		this.lstDieuChinhs.forEach(item => {
			if (this.tabs.findIndex(e => e.id == item.maLoai) != -1) {
				this.tabs = [];
			}
		})
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
			'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu-/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThaiBaoCaos.find(e => e.id == trangThai)?.tenDm;
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
				trangThaiBaoCao: this.trangThaiBaoCao,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				status: this.status,
			}
			this.tabs = [];
			this.tabs.push(PHU_LUC.find(e => e.id === id));
			this.selectedIndex = this.tabs.length + 1;
		}

	}

	getNewData(obj: any) {
		let index = this.lstDieuChinhs.findIndex(e => e.maLoai == this.tabs[0].id);
		if (obj?.trangThai == '-1') {
			this.getDetailReport();
			this.data = {
				...this.lstDieuChinhs[index],
				namHienHanh: this.namHienHanh,
				trangThaiBaoCao: this.trangThaiBaoCao,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				status: this.status,
			}
			this.tabs = [];
			this.tabs.push(PHU_LUC.find(e => e.id == this.lstDieuChinhs[index].maLoai));
			this.selectedIndex = this.tabs.length + 1;
		} else {
			this.lstDieuChinhs[index].trangThai = obj?.trangThai;
			this.lstDieuChinhs[index].lyDoTuChoi = obj?.lyDoTuChoi;
		}
	}

	close() {
		if (this.loai == "0") {
			this.router.navigate(['/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/tim-kiem-dieu-chinh-du-toan-chi-NSNN']);
		} else {
			if (this.loai == "1"){
				this.router.navigate(['/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/tong-hop-dieu-chinh-du-toan-chi-NSNN']);
			} else {
				this.location.back();
			}
		}
	}

  async doCopy() {
		var maBcaoNew: string;
		await this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					maBcaoNew = data.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
					return;
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
				return;
			}
		);
		let lstDieuChinhTemps: any[] = [];
		this.lstDieuChinhs.forEach(data => {
			let lstCtietTemp: any[] = [];
			data.lstCtietDchinh.forEach(item => {
				lstCtietTemp.push({
					...item,
					id: null,
				})
			})
			lstDieuChinhTemps.push({
				...data,
				giaoCho: this.userInfo?.username,
				lstCtietDchinh: lstCtietTemp,
				id: null,
			})
		})
		let request = {
			id: null,
			fileDinhKems: [],
			listIdDeleteFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstDchinh: lstDieuChinhTemps,
			maBcao: maBcaoNew,
			maDvi: this.maDviTao,
			namBcao: this.namHienHanh,
			namHienHanh: this.namHienHanh,
			congVan: null,
      dotBcao: this.dotBcao,
			tongHopTuIds: [],
		};

		this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
					this.router.navigate([
						'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/' + data.data.id,
					])
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);
	}

  // action print
  doPrint() {
    let WindowPrt = window.open(
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
  }

  // doShowDialogCopy() {
  //   const modalTuChoi = this.modal.create({
  //     nzTitle: 'Copy Báo Cáo',
  //     nzContent: DialogDieuChinhCopyComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '900px',
  //     nzFooter: null,
  //     nzComponentParams: {
  //       namBcao: this.namHienHanh,
  //       dotBcao: null,
  //     },
  //   });
  //   modalTuChoi.afterClose.toPromise().then(async (response) => {
  //     if (response) {
  //       this.doCopy(response);
  //     }
  //   });
  // }
  // async doCopy(response) {

  //   this.spinner.show();
  //   var maBcaoNew: string;
  //   this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
  //     (data) => {
  //       if (data.statusCode == 0) {
  //         maBcaoNew = data.data;
  //       } else {
  //         this.notification.error(MESSAGE.ERROR, data?.msg);
  //       }
  //     },
  //     (err) => {
  //       this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
  //       return null
  //     }
  //   );
  //   this.spinner.hide();
  //   if(!maBcaoNew){
  //     return
  //   }

  //   let lstDieuChinhTemps: any[] = [];
  //   	this.lstDieuChinhs.forEach(data => {
  //   		let lstCtietTemp: any[] = [];
  //   		data.lstCtietDchinh.forEach(item => {
  //   			lstCtietTemp.push({
  //   				...item,
  //   				id: null,
  //   			})
  //   		})
  //   		lstDieuChinhTemps.push({
  //   			...data,
  //   			giaoCho: this.userInfo?.username,
  //   			lstCtietDchinh: lstCtietTemp,
  //   			id: null,
  //   		})
  //   	})
  //     if (response.loaiCopy == 'D') {
  //       //xoa lst don vi truc thuoc theo lua chon tu dialog
  //       this.lstDviTrucThuoc = [];
  //     }
  //   	let request = {
  //   		id: null,
  //   		fileDinhKems: [],
  //   		listIdFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
  //   		lstDchinh: lstDieuChinhTemps,
  //   		maBcao: maBcaoNew,
  //   		maDvi: this.maDviTao,
  //   		namBcao: response.namBcao,
  //   		namHienHanh:response.namBcao,
  //   		congVan: null,
  //       dotBcao: response.dotBcao,
  //   		tongHopTuIds: this.lstDviTrucThuoc,
  //   	};
  //     this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
  //       async data => {
  //         if (data.statusCode == 0) {
  //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
  //           // this.router.navigate([
  //           //   '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/' + data.data.id,
  //           // ])
  //           const modalCopy = this.modal.create({
  //                       nzTitle: MESSAGE.ALERT,
  //                       nzContent: DialogCopyComponent,
  //                       nzMaskClosable: false,
  //                       nzClosable: false,
  //                       nzWidth: '900px',
  //                       nzFooter: null,
  //                       nzComponentParams: {
  //                         maBcao: maBcaoNew
  //                       },
  //                     });
  //         } else {
  //           this.notification.error(MESSAGE.ERROR, data?.msg);
  //           this.spinner.hide();
  //         }
  //       },
  //       err => {
  //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //         this.spinner.hide();
  //       },
  //     );
  //     this.spinner.hide();
  // }

  // async doCopy(response) {
  //   this.spinner.show();
  //   let maBaoCao = await this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
  //     (data) => {
  //       if (data.statusCode == 0) {
  //         return data.data;
  //       } else {
  //         this.notification.error(MESSAGE.ERROR, data?.msg);
  //         return null;
  //       }
  //     },
  //     (err) => {
  //       this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
  //       return null;
  //     }
  //   );
  //   this.spinner.hide();
  //   if (!maBaoCao) {
  //     return;
  //   }

  //   // set ma don vi tien trong list chinh = ma don vi tien vua chon tai man hinh
  //   this.baoCao?.lstBcaos.find(item => { if (item.maLoai == this.tabSelected) { item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh } });
  //   let baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
  //   baoCaoTemp.congVan = null;
  //   // set nambao,dot bao cao tu dialog gui ve
  //   baoCaoTemp.namBcao = response.namBcao;
  //   baoCaoTemp.thangBcao = response.thangBcao;
  //   if (response.loaiCopy == 'D') {
  //     //xoa lst don vi truc thuoc theo lua chon tu dialog
  //     baoCaoTemp.lstBcaoDviTrucThuocs = [];
  //   }
  //   let checkMoneyRange = true;
  //   // replace nhung ban ghi dc them moi id thanh null
  //   baoCaoTemp?.lstBcaos?.filter(item => {
  //     item.id = null;
  //     item.listIdDelete = null;
  //     item.trangThai = '3'; // set trang thai phu luc la chua danh gia
  //     item?.lstCtietBcaos.filter(data => {
  //       data.id = null;
  //       switch (item.maLoai) {
  //         // phu luc 1
  //         case PHULUCLIST[0].maPhuLuc:
  //           data.kphiSdungTcong = mulMoney(data.kphiSdungTcong, item.maDviTien);
  //           data.kphiSdungDtoan = mulMoney(data.kphiSdungDtoan, item.maDviTien);
  //           data.kphiSdungNguonKhac = mulMoney(data.kphiSdungNguonKhac, item.maDviTien);
  //           data.kphiSdungNguonQuy = mulMoney(data.kphiSdungNguonQuy, item.maDviTien);
  //           data.kphiSdungNstt = mulMoney(data.kphiSdungNstt, item.maDviTien);
  //           data.kphiSdungCk = mulMoney(data.kphiSdungCk, item.maDviTien);
  //           data.kphiChuyenSangTcong = mulMoney(data.kphiChuyenSangTcong, item.maDviTien);
  //           data.kphiChuyenSangDtoan = mulMoney(data.kphiChuyenSangDtoan, item.maDviTien);
  //           data.kphiChuyenSangNguonKhac = mulMoney(data.kphiChuyenSangNguonKhac, item.maDviTien);
  //           data.kphiChuyenSangNguonQuy = mulMoney(data.kphiChuyenSangNguonQuy, item.maDviTien);
  //           data.kphiChuyenSangNstt = mulMoney(data.kphiChuyenSangNstt, item.maDviTien);
  //           data.kphiChuyenSangCk = mulMoney(data.kphiChuyenSangCk, item.maDviTien);
  //           data.dtoanGiaoTcong = mulMoney(data.dtoanGiaoTcong, item.maDviTien);
  //           data.dtoanGiaoDtoan = mulMoney(data.dtoanGiaoDtoan, item.maDviTien);
  //           data.dtoanGiaoNguonKhac = mulMoney(data.dtoanGiaoNguonKhac, item.maDviTien);
  //           data.dtoanGiaoNguonQuy = mulMoney(data.dtoanGiaoNguonQuy, item.maDviTien);
  //           data.dtoanGiaoNstt = mulMoney(data.dtoanGiaoNstt, item.maDviTien);
  //           data.dtoanGiaoCk = mulMoney(data.dtoanGiaoCk, item.maDviTien);
  //           data.giaiNganThangBcaoTcong = mulMoney(data.giaiNganThangBcaoTcong, item.maDviTien);
  //           data.giaiNganThangBcaoDtoan = mulMoney(data.giaiNganThangBcaoDtoan, item.maDviTien);
  //           data.giaiNganThangBcaoNguonKhac = mulMoney(data.giaiNganThangBcaoNguonKhac, item.maDviTien);
  //           data.giaiNganThangBcaoNguonQuy = mulMoney(data.giaiNganThangBcaoNguonQuy, item.maDviTien);
  //           data.giaiNganThangBcaoNstt = mulMoney(data.giaiNganThangBcaoNstt, item.maDviTien);
  //           data.giaiNganThangBcaoCk = mulMoney(data.giaiNganThangBcaoCk, item.maDviTien);
  //           data.luyKeGiaiNganTcong = mulMoney(data.luyKeGiaiNganTcong, item.maDviTien);
  //           data.luyKeGiaiNganDtoan = mulMoney(data.luyKeGiaiNganDtoan, item.maDviTien);
  //           data.luyKeGiaiNganNguonKhac = mulMoney(data.luyKeGiaiNganNguonKhac, item.maDviTien);
  //           data.luyKeGiaiNganNguonQuy = mulMoney(data.luyKeGiaiNganNguonQuy, item.maDviTien);
  //           data.luyKeGiaiNganNstt = mulMoney(data.luyKeGiaiNganNstt, item.maDviTien);
  //           data.luyKeGiaiNganCk = mulMoney(data.luyKeGiaiNganCk, item.maDviTien);
  //           if (data.kphiSdungTcong > MONEY_LIMIT || data.kphiSdungDtoan > MONEY_LIMIT || data.kphiSdungNguonKhac > MONEY_LIMIT ||
  //             data.kphiSdungNguonQuy > MONEY_LIMIT || data.kphiSdungNstt > MONEY_LIMIT || data.kphiSdungCk > MONEY_LIMIT ||
  //             data.kphiChuyenSangTcong > MONEY_LIMIT || data.kphiChuyenSangDtoan > MONEY_LIMIT || data.kphiChuyenSangNguonKhac > MONEY_LIMIT ||
  //             data.kphiChuyenSangNguonQuy > MONEY_LIMIT || data.kphiChuyenSangNstt > MONEY_LIMIT || data.kphiChuyenSangCk > MONEY_LIMIT ||
  //             data.dtoanGiaoTcong > MONEY_LIMIT || data.dtoanGiaoDtoan > MONEY_LIMIT || data.dtoanGiaoNguonKhac > MONEY_LIMIT ||
  //             data.dtoanGiaoNguonQuy > MONEY_LIMIT || data.dtoanGiaoNstt > MONEY_LIMIT || data.dtoanGiaoCk > MONEY_LIMIT ||
  //             data.giaiNganThangBcaoTcong > MONEY_LIMIT || data.giaiNganThangBcaoDtoan > MONEY_LIMIT || data.giaiNganThangBcaoNguonKhac > MONEY_LIMIT ||
  //             data.giaiNganThangBcaoNguonQuy > MONEY_LIMIT || data.giaiNganThangBcaoNstt > MONEY_LIMIT || data.giaiNganThangBcaoCk > MONEY_LIMIT ||
  //             data.luyKeGiaiNganTcong > MONEY_LIMIT || data.luyKeGiaiNganDtoan > MONEY_LIMIT || data.luyKeGiaiNganNguonKhac > MONEY_LIMIT ||
  //             data.luyKeGiaiNganNguonQuy > MONEY_LIMIT || data.luyKeGiaiNganNstt > MONEY_LIMIT || data.luyKeGiaiNganCk > MONEY_LIMIT) {
  //             checkMoneyRange = false;
  //             return;
  //           }
  //           break;

  //         // phu luc 2
  //         case PHULUCLIST[1].maPhuLuc:
  //           data.dtoanSdungNamTcong = mulMoney(data.dtoanSdungNamTcong, item.maDviTien);
  //           data.dtoanSdungNamNguonNsnn = mulMoney(data.dtoanSdungNamNguonNsnn, item.maDviTien);
  //           data.dtoanSdungNamNguonSn = mulMoney(data.dtoanSdungNamNguonSn, item.maDviTien);
  //           data.dtoanSdungNamNguonQuy = mulMoney(data.dtoanSdungNamNguonQuy, item.maDviTien);
  //           data.giaiNganThangTcong = mulMoney(data.giaiNganThangTcong, item.maDviTien);
  //           data.giaiNganThangNguonNsnn = mulMoney(data.giaiNganThangNguonNsnn, item.maDviTien);
  //           data.giaiNganThangNguonSn = mulMoney(data.giaiNganThangNguonSn, item.maDviTien);
  //           data.giaiNganThangNguonQuy = mulMoney(data.giaiNganThangNguonQuy, item.maDviTien);
  //           data.luyKeGiaiNganTcong = mulMoney(data.luyKeGiaiNganTcong, item.maDviTien);
  //           data.luyKeGiaiNganNguonNsnn = mulMoney(data.luyKeGiaiNganNguonNsnn, item.maDviTien);
  //           data.luyKeGiaiNganNguonSn = mulMoney(data.luyKeGiaiNganNguonSn, item.maDviTien);
  //           data.luyKeGiaiNganNguonQuy = mulMoney(data.luyKeGiaiNganNguonQuy, item.maDviTien);

  //           if (data.dtoanSdungNamTcong > MONEY_LIMIT || data.dtoanSdungNamNguonNsnn > MONEY_LIMIT || data.dtoanSdungNamNguonSn > MONEY_LIMIT ||
  //             data.dtoanSdungNamNguonQuy > MONEY_LIMIT || data.giaiNganThangTcong > MONEY_LIMIT || data.giaiNganThangNguonNsnn > MONEY_LIMIT ||
  //             data.giaiNganThangNguonSn > MONEY_LIMIT || data.giaiNganThangNguonQuy > MONEY_LIMIT || data.luyKeGiaiNganTcong > MONEY_LIMIT ||
  //             data.luyKeGiaiNganNguonNsnn > MONEY_LIMIT || data.luyKeGiaiNganNguonSn > MONEY_LIMIT || data.luyKeGiaiNganNguonQuy > MONEY_LIMIT) {
  //             checkMoneyRange = false;
  //             return;
  //           }
  //           break;

  //         // phu luc 3
  //         case PHULUCLIST[2].maPhuLuc:
  //           data.qddtTmdtTso = mulMoney(data.qddtTmdtTso, item.maDviTien);
  //           data.qddtTmdtNsnn = mulMoney(data.qddtTmdtNsnn, item.maDviTien);
  //           data.luyKeVonTso = mulMoney(data.luyKeVonTso, item.maDviTien);
  //           data.luyKeVonNsnn = mulMoney(data.luyKeVonNsnn, item.maDviTien);
  //           data.luyKeVonDt = mulMoney(data.luyKeVonDt, item.maDviTien);
  //           data.luyKeVonThue = mulMoney(data.luyKeVonThue, item.maDviTien);
  //           data.luyKeVonScl = mulMoney(data.luyKeVonScl, item.maDviTien);
  //           data.luyKeGiaiNganHetNamTso = mulMoney(data.luyKeGiaiNganHetNamTso, item.maDviTien);
  //           data.luyKeGiaiNganHetNamNsnnTso = mulMoney(data.luyKeGiaiNganHetNamNsnnTso, item.maDviTien);
  //           data.luyKeGiaiNganHetNamNsnnKhNamTruoc = mulMoney(data.luyKeGiaiNganHetNamNsnnKhNamTruoc, item.maDviTien);
  //           data.khoachVonNamTruocKeoDaiTso = mulMoney(data.khoachVonNamTruocKeoDaiTso, item.maDviTien);
  //           data.khoachVonNamTruocKeoDaiDtpt = mulMoney(data.khoachVonNamTruocKeoDaiDtpt, item.maDviTien);
  //           data.khoachVonNamTruocKeoDaiVonKhac = mulMoney(data.khoachVonNamTruocKeoDaiVonKhac, item.maDviTien);
  //           data.khoachNamVonTso = mulMoney(data.khoachNamVonTso, item.maDviTien);
  //           data.khoachNamVonNsnn = mulMoney(data.khoachNamVonNsnn, item.maDviTien);
  //           data.khoachNamVonDt = mulMoney(data.khoachNamVonDt, item.maDviTien);
  //           data.khoachNamVonThue = mulMoney(data.khoachNamVonThue, item.maDviTien);
  //           data.khoachNamVonScl = mulMoney(data.khoachNamVonScl, item.maDviTien);
  //           data.giaiNganTso = mulMoney(data.giaiNganTso, item.maDviTien);
  //           data.giaiNganNsnn = mulMoney(data.giaiNganNsnn, item.maDviTien);
  //           data.giaiNganNsnnVonDt = mulMoney(data.giaiNganNsnnVonDt, item.maDviTien);
  //           data.giaiNganNsnnVonThue = mulMoney(data.giaiNganNsnnVonThue, item.maDviTien);
  //           data.giaiNganNsnnVonScl = mulMoney(data.giaiNganNsnnVonScl, item.maDviTien);
  //           data.luyKeGiaiNganDauNamTso = mulMoney(data.luyKeGiaiNganDauNamTso, item.maDviTien);
  //           data.luyKeGiaiNganDauNamNsnn = mulMoney(data.luyKeGiaiNganDauNamNsnn, item.maDviTien);
  //           data.luyKeGiaiNganDauNamNsnnVonDt = mulMoney(data.luyKeGiaiNganDauNamNsnnVonDt, item.maDviTien);
  //           data.luyKeGiaiNganDauNamNsnnVonThue = mulMoney(data.luyKeGiaiNganDauNamNsnnVonThue, item.maDviTien);
  //           data.luyKeGiaiNganDauNamNsnnVonScl = mulMoney(data.luyKeGiaiNganDauNamNsnnVonScl, item.maDviTien);

  //           if (data.qddtTmdtTso > MONEY_LIMIT || data.qddtTmdtNsnn > MONEY_LIMIT || data.luyKeVonTso > MONEY_LIMIT ||
  //             data.luyKeVonNsnn > MONEY_LIMIT || data.luyKeVonDt > MONEY_LIMIT || data.luyKeVonThue > MONEY_LIMIT ||
  //             data.luyKeVonScl > MONEY_LIMIT || data.luyKeGiaiNganHetNamTso > MONEY_LIMIT || data.luyKeGiaiNganHetNamNsnnTso > MONEY_LIMIT ||
  //             data.luyKeGiaiNganHetNamNsnnKhNamTruoc > MONEY_LIMIT || data.khoachVonNamTruocKeoDaiTso > MONEY_LIMIT || data.khoachVonNamTruocKeoDaiDtpt > MONEY_LIMIT ||
  //             data.khoachVonNamTruocKeoDaiVonKhac > MONEY_LIMIT || data.khoachNamVonTso > MONEY_LIMIT || data.khoachNamVonNsnn > MONEY_LIMIT ||
  //             data.khoachNamVonDt > MONEY_LIMIT || data.khoachNamVonThue > MONEY_LIMIT || data.khoachNamVonScl > MONEY_LIMIT ||
  //             data.giaiNganTso > MONEY_LIMIT || data.giaiNganNsnn > MONEY_LIMIT || data.giaiNganNsnnVonDt > MONEY_LIMIT ||
  //             data.giaiNganNsnnVonThue > MONEY_LIMIT || data.giaiNganNsnnVonScl > MONEY_LIMIT || data.luyKeGiaiNganDauNamTso > MONEY_LIMIT ||
  //             data.luyKeGiaiNganDauNamNsnn > MONEY_LIMIT || data.luyKeGiaiNganDauNamNsnnVonDt > MONEY_LIMIT || data.luyKeGiaiNganDauNamNsnnVonThue > MONEY_LIMIT ||
  //             data.luyKeGiaiNganDauNamNsnnVonScl > MONEY_LIMIT) {
  //             checkMoneyRange = false;
  //             return;
  //           }
  //           break;
  //         default:
  //           break;
  //       }
  //     })
  //     if (!checkMoneyRange == true) {
  //       this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
  //     }
  //   })

  //   if (checkMoneyRange != true) {
  //     return;
  //   } else {
  //     // replace nhung ban ghi dc them moi id thanh null
  //     baoCaoTemp.id = null;
  //     baoCaoTemp.maBcao = maBaoCao;
  //     baoCaoTemp.tongHopTuIds = [];
  //     baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
  //       baoCaoTemp.tongHopTuIds.push(item.id);
  //     })
  //     baoCaoTemp.fileDinhKems = [];
  //     baoCaoTemp.listIdFiles = null;
  //     baoCaoTemp.trangThai = "1";
  //     baoCaoTemp.maDvi = this.maDonViTao;
  //     baoCaoTemp.maPhanBcao = '0';

  //     //call service them moi
  //     this.spinner.show();
  //     this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
  //       async data => {
  //         if (data.statusCode == 0) {
  //           const modalCopy = this.modal.create({
  //             nzTitle: MESSAGE.ALERT,
  //             nzContent: DialogCopyComponent,
  //             nzMaskClosable: false,
  //             nzClosable: false,
  //             nzWidth: '900px',
  //             nzFooter: null,
  //             nzComponentParams: {
  //               maBcao: maBaoCao
  //             },
  //           });
  //         } else {
  //           this.notification.error(MESSAGE.ERROR, data?.msg);
  //           this.spinner.hide();
  //         }
  //       },
  //       err => {
  //         this.spinner.hide();
  //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //       },
  //     );

  //   }
  //   this.spinner.hide();
  // }
}
