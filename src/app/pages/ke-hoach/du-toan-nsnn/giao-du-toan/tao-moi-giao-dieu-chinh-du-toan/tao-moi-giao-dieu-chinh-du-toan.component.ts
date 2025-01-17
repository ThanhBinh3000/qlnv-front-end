import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Operator, Utils, Status } from 'src/app/Utility/utils';
import { DialogCopyGiaoDuToanComponent } from 'src/app/components/dialog/dialog-copy-giao-du-toan/dialog-copy-giao-du-toan.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTongHopGiaoComponent } from 'src/app/components/dialog/dialog-tong-hop-giao/dialog-tong-hop-giao.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';

export const TRANG_THAI_TIM_KIEM = [
    {
        id: "1",
        tenDm: 'Đang soạn'
    },
    {
        id: "2",
        tenDm: 'Trình duyệt'
    },
    {
        id: "3",
        tenDm: 'Từ chối duyệt'
    },
    {
        id: "4",
        tenDm: 'Duyệt'
    },
    {
        id: "5",
        tenDm: 'Từ chối phê duyệt'
    },
    {
        id: "6",
        tenDm: 'Phê duyệt',
    },
    {
        id: "7",
        tenDm: 'Phê duyệt'
    },
    {
        id: "8",
        tenDm: 'Từ chối tiếp nhận'
    },
    {
        id: "9",
        tenDm: 'Tiếp nhận'
    },
    // {
    //     id: "10",
    //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
    // },
]

// khai báo class data request
export class ItemData {
    id: string;
    stt: string;
    level: number;
    maNdung: number;
    tongCong: number;
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
    selector: 'app-tao-moi-giao-dieu-chinh-du-toan',
    templateUrl: './tao-moi-giao-dieu-chinh-du-toan.component.html',
    styleUrls: ['./tao-moi-giao-dieu-chinh-du-toan.component.scss']
})
export class TaoMoiGiaoDieuChinhDuToanComponent implements OnInit {
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
    Status = Status
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
    trangThais: any[] = TRANG_THAI_TIM_KIEM; // danh sách trạng thái
    listFile: File[] = []; // list file chua ten va id de hien tai o input
    lstDviChon: any[] = []; //danh sach don vi chua duoc chon
    soLaMa: any[] = Utils.LA_MA; // danh sách ký tự la mã

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
            case 'receive':
                await this.onSubmit('9', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'refuse':
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

        // lấy role người dùng
        this.userInfo = this.userService.getUserLogin();

        // set năm tạo PA
        this.namPa = this.newDate.getFullYear();

        // lấy danh sách đơn vị
        await this.danhMuc.dMDonVi().toPromise().then(
            (data) => {
                if (data.statusCode === 0) {
                    this.donVis = data?.data;
                    this.capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.MA_DVI)?.capDvi;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE)
                }
            }
        );

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
            this.trangThaiBanGhi = '1';
            this.maDonViTao = this.userInfo?.MA_DVI;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.lstDvi = this.donVis.filter(e => e?.maDviCha === this.maDonViTao && (e.type === "DV"));
            this.maDviTien = '1'
            // lấy dữ liệu từ PA cha qua dataSource
            // await this.dataSource.currentData.subscribe(obj => {
            //   if (obj) {
            //     this.listIdFilesDelete = obj?.listIdDeleteFiles;
            //     this.lstCtietBcao = obj?.lstCtiets;
            //     this.maDvi = obj?.maDvi;
            //     this.maPaCha = obj?.maPaCha;
            //     this.maPa = obj?.maPa;
            //     this.maDviTien = obj?.maDviTien;
            //     this.idPaBTC = obj?.idPaBTC;
            //     this.namPa = obj?.namPa;
            //     this.trangThaiBanGhi = obj?.trangThai;
            //     this.updateEditCache();
            //   }
            // });
            debugger
            this.listIdFilesDelete = this.data?.listIdDeleteFiles;
            this.lstCtietBcao = this.data?.lstCtiets;
            this.maDvi = this.data?.maDvi;
            this.maPaCha = this.data?.maPaCha;
            this.maPa = this.data?.maPa;
            this.maDviTien = this.data?.maDviTien;
            this.idPaBTC = this.data?.idPaBTC;
            this.namPa = this.data?.namPa;
            this.trangThaiBanGhi = this.data?.trangThai;
            this.updateEditCache();

            if (!this.maPa) {
                this.location.back();
            }
        }
        if (this.status) {
            this.scrollX = (460 + 250 * (this.lstDvi.length + 1)).toString() + 'px';
        } else {
            this.scrollX = (400 + 250 * (this.lstDvi.length + 1)).toString() + 'px';
        }
        this.sum1()
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
                    this.lstDvi = [];
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
                        }
                        )
                    }
                    if (this.lstCtietBcao[0].lstCtietDvis.length > 0) {
                        this.lstCtietBcao[0]?.lstCtietDvis.forEach(item => {
                            this.lstDvi.push(this.donVis.find(e => e.maDvi == item.maDviNhan))
                        })
                    }
                    // this.lstCtietBcao.forEach(item => {
                    //   item.tongCong = divMoney(item.tongCong, this.maDviTien);
                    //   if (item.lstCtietDvis) {
                    //     item.lstCtietDvis.forEach(e => {
                    //       // e.soTranChi = divMoney(e.soTranChi, this.maDviTien) == 0 ? null : divMoney(e.soTranChi, this.maDviTien);
                    //       e.soTranChi = divMoney(e.soTranChi, this.maDviTien);
                    //     })
                    //   }
                    // })
                    this.sortByIndex();
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

    // quay lại
    redirectkehoachvonphi() {
        this.location.back();
    };

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
            maLoaiDan: "3",
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
            maLoaiDan: "3",
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
        // if (!request.soQd) {
        //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        //   return;
        // }
        this.spinner.show();
        if (!this.id) {
            this.giaoDuToanChiService.giaoDuToan(request1).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        const capDviUser = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
                        if (this.trangThaiBanGhi == '1') {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        } else {
                            if (capDviUser == 2) {
                                this.notification.success(MESSAGE.SUCCESS, MESSAGE.TAO_BAO_CAO_SUCCESS);
                            } else if (capDviUser == 1) {
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
        // const url = MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/' + id
        // window.open(url, '_blank');
        const obj = {
            id: id,
            preData: this.data,
            tabSelected: 'next' + this.data?.tabSelected,
        }
        this.dataChange.emit(obj);
    }

    // set lại level
    setDetail() {
        this.lstCtietBcao.forEach(item => {
            item.level = this.noiDungs.find(e => e.id == item.maNdung)?.level;
        })
    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    // sắp xếp lại thứ tự
    sortByIndex() {
        this.setLevel();
        this.lstCtietBcao.sort((item1, item2) => {
            if (item1.level > item2.level) {
                return 1;
            }
            if (item1.level < item2.level) {
                return -1;
            }
            if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
                return -1;
            }
            if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
                return 1;
            }
            return 0;
        });
        const lstTemp: any[] = [];
        this.lstCtietBcao.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        this.lstCtietBcao = lstTemp;
    }

    // tổng hợp
    async tongHop() {
        const request = {
            id: this.id,
            namDtoan: Number(this.namDtoan),
        }

        this.spinner.show();
        await this.giaoDuToanChiService.tongHopGiaoDuToan(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    const modalCopy = this.modal.create({
                        nzTitle: MESSAGE.ALERT,
                        nzContent: DialogTongHopGiaoComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzWidth: '900px',
                        nzFooter: null,
                        nzComponentParams: {
                            maBcao: data.data.maPa
                        },
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );


        this.spinner.hide();
    };

    //check role cho các nut trinh duyet
    getStatusButton() {
        if (Status.TT_01 == this.trangThaiBanGhi && this.userService.isAccessPermisson(Roles.GSTC.SUA_PA_GIAO_SOKIEMTRA)) {
            this.status = false;
        } else {
            this.status = true;
        }
        if (this.checkTrangThaiGiao == "0" || this.checkTrangThaiGiao == "2") {
            this.statusGiaoToanBo = false;
        } else {
            this.statusGiaoToanBo = true;
        }



        const dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);


        let checkParent = false;
        if (dVi && dVi?.maDviCha == this.userInfo.MA_DVI) {
            checkParent = true;
        }
        const utils = new Utils();
        const checkChirld = this.maDonViTao == this.userInfo?.MA_DVI;

        this.statusBtnSave = this.getBtnStatus([Status.TT_01], Roles.GSTC.SUA_PA_GIAO_SOKIEMTRA, checkChirld);
        this.statusBtnApprove = this.getBtnStatus([Status.TT_01], Roles.GSTC.TRINHDUYET_PA_GIAO_SKT, checkChirld);
        this.statusBtnTBP = this.getBtnStatus([Status.TT_02], Roles.GSTC.DUYET_TUCHOI_PA_GIAO_SKT, checkChirld);
        this.statusBtnLD = this.getBtnStatus([Status.TT_04], Roles.GSTC.PHEDUYET_TUCHOI_PA_GIAO_SKT, checkChirld);
        this.statusBtnCopy = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.GSTC.COPY_PA_GIAO_SOKIEMTRA, checkChirld);
        this.statusBtnPrint = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.GSTC.IN_PA_GIAO_SOKIEMTRA, checkChirld);
        // this.statusBtnDVCT = this.getBtnStatus([Status.TT_06, Status.TT_07], Roles.GSTC.TRINHDUYET_PA_GIAO_SKT, checkParent);

        if (this.userService.isAccessPermisson(Roles.GSTC.GIAO_SOKIEMTRA) && this.soQd) {
            this.statusBtnGiao = false;
        } else {
            this.statusBtnGiao = true;
            this.statusGiaoToanBo = true;
        }
        // if (this.userService.isAccessPermisson(Roles.GSTC.GIAODT_TRINHTONGCUC_PA_PBDT) && this.soQd?.fileName != null && this.trangThaiBanGhi == '6' && this.userInfo.CAP_DVI == "2") {
        //     this.statusBtnGuiDVCT = false;
        // }
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
            this.spinner.show();
            await this.giaoDuToanChiService.trinhDuyetPhuongAnGiao(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiBanGhi = mcn;
                    this.getStatusButton();
                    if (Status.check('reject', mcn)) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                    } else {
                        if (mcn == Status.TT_02) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUBMIT_SUCCESS);
                        } else if (mcn == Status.TT_04) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                        } else if (mcn == Status.TT_06) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
                        } else if (mcn == Status.TT_07) {
                            this.notification.success(MESSAGE.SUCCESS, "Gửi đơn vị cấp trên thành công");
                        } else if (mcn == Status.TT_09) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TRANG_THAI_TIEP_NHAN);
                        }
                    }
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
    xemCtietPaBTC() {
        // debugger
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
            const obj = {
                id: this.idPaBTC,
                preData: this.data,
                tabSelected: 'giaoTuCapTren',
            }
            this.dataChange.emit(obj);
        }
    };

    // lấy tên đơn vị
    getUnitName() {
        return this.donVis.find((item) => item.maDvi == this.maDonViTao)?.tenDvi;
    };

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

    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }

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
            const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    // kiểm tra cấp quyền sửa nếu phần tử chọn có phần tử con
    getLowStatus(stt: string) {
        const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == stt);
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
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
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

    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(khoanMuc: any) {
        // them moi phan tu
        const data: ItemDvi[] = [];
        const data1: ItemDvi[] = [];
        this.lstDvi.forEach(item => {
            const mm: ItemDvi = {
                id: uuid.v4() + 'FE',
                maDviNhan: item.maDvi,
                soTranChi: 0,
                trangThai: "0",
            }
            const mm1: ItemDvi = {
                id: mm.id,
                maDviNhan: item.Dvi,
                soTranChi: 0,
                trangThai: "0",
            }
            data.push(mm);
            data1.push(mm1);
        })
        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: '0.1',
            maNdung: khoanMuc.id,
            level: khoanMuc.level,
            tongCong: 0,
            lstCtietDvis: data,
            checked: false,
        };
        const item1: ItemData = {
            id: item.id,
            stt: item.stt,
            maNdung: khoanMuc.id,
            level: khoanMuc.level,
            tongCong: 0,
            lstCtietDvis: data1,
            checked: false,
        };
        this.lstCtietBcao.push(item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item1 }
        };
    }

    //thêm ngang cấp
    addSame(id: any, khoanMuc: any) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
        const ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i > ind; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1);
        // them moi phan tu
        const data: ItemDvi[] = [];
        const data1: ItemDvi[] = [];
        this.lstDvi.forEach(item => {
            const mm: ItemDvi = {
                id: uuid.v4() + 'FE',
                maDviNhan: item.maDvi,
                soTranChi: 0,
                trangThai: "0",
            }
            const mm1: ItemDvi = {
                id: mm.id,
                maDviNhan: item.Dvi,
                soTranChi: 0,
                trangThai: "0",
            }
            data.push(mm);
            data1.push(mm1);
        })
        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: head + "." + (tail + 1).toString(),
            maNdung: khoanMuc.id,
            level: khoanMuc.level,
            tongCong: 0,
            lstCtietDvis: data,
            checked: false,
        };
        const item1: ItemData = {
            id: item.id,
            stt: item.stt,
            maNdung: khoanMuc.id,
            level: khoanMuc.level,
            tongCong: 0,
            lstCtietDvis: data1,
            checked: false,
        };
        this.lstCtietBcao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item1 }
        };
    }

    //thêm cấp thấp hơn
    addLow(id: any, khoanMuc: any) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        let index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        let stt: string;
        if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
            this.sum(stt);
        } else {
            index = this.findVt(data.stt);
            for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
                if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
                    break;
                }
            }
        }

        const obj: ItemDvi[] = [];
        const obj1: ItemDvi[] = [];
        this.lstDvi.forEach(item => {
            const mm: ItemDvi = {
                id: uuid.v4() + 'FE',
                maDviNhan: item.maDvi,
                soTranChi: 0,
                trangThai: "0",
            }
            const mm1: ItemDvi = {
                id: mm.id,
                maDviNhan: item.Dvi,
                soTranChi: 0,
                trangThai: "0",
            }
            obj.push(mm);
            obj1.push(mm1);
        })
        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: stt,
            maNdung: khoanMuc.id,
            level: khoanMuc.level,
            tongCong: 0,
            lstCtietDvis: obj,
            checked: false,
        };
        const item1: ItemData = {
            id: item.id,
            stt: item.stt,
            maNdung: khoanMuc.id,
            level: khoanMuc.level,
            tongCong: 0,
            lstCtietDvis: obj1,
            checked: false,
        };
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item1 }
        };
    };

    // thêm dòng
    addLine(id: string) {
        const maNdung: any = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
        const obj = {
            maKhoanMuc: maNdung,
            lstKhoanMuc: this.noiDungs,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nhóm',
            nzContent: DialogThemKhoanMucComponent,
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
                const index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.maKhoanMuc);
                if (index == -1) {
                    const data: any = this.noiDungs.find(e => e.id == res.maKhoanMuc);
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNdung == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maNdung == item.id) == -1) {
                        this.addLow(id, item);
                    }
                })
                this.updateEditCache();
            }
        });
    };

    // xóa dòng
    deleteLine(id: string) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const stt: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, -1);
        this.sum(stt);
        this.updateEditCache();
    };

    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean {
        let nho = true;
        this.lstCtietBcao.forEach(item => {
            if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
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
        let index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
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
        this.editCache[id].data.tongCong = 0;
        this.editCache[id].data.lstCtietDvis.forEach(item => {
            this.editCache[id].data.tongCong += item.soTranChi;
        })
    };

    // call api giao số liệu trong cột được chọn
    giaoSoTranChi(maDviNhan: any) {
        this.spinner.show();
        if (maDviNhan == null) {
            this.statusGiaoToanBo = !this.statusGiaoToanBo
        }
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
            lstGiao.push({
                maGiao: this.maGiao,
                maPa: this.maPa,
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

                        lstGiao.push({
                            maGiao: this.maGiao,
                            maPa: this.maPa,
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
        return this.donVis.find(e => e.maDvi == maDviTT)?.tenDvi;
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

    // xóa tất cả các phần tử được chọn trong bảng
    deleteAllChecked() {
        const lstId: any[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item);
            }
        })
    };

    // xóa cột
    deleteCol(maDvi: string) {
        this.lstCtietBcao.forEach(data => {
            data.lstCtietDvis = data.lstCtietDvis.filter(e => e.maDviNhan != maDvi);
        })
        this.lstDviChon.push(this.lstDvi.find(e => e.maDvi == maDvi));
        this.lstDvi = this.lstDvi.filter(e => e.maDvi != maDvi);
        this.tinhTong()
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
                    tongCong: item.tongCong,
                    lstCtietDvis: data,
                    checked: false,
                }
            }
        })
    }

    // tính tổng
    sum(stt: string) {
        stt = this.getHead(stt);
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
                tongCong: 0,
                lstCtietDvis: mm,
                checked: false,
            };
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    item.lstCtietDvis.forEach(e => {
                        const ind = this.lstCtietBcao[index].lstCtietDvis.findIndex(i => i.maDviNhan == e.maDviNhan);
                        this.lstCtietBcao[index].lstCtietDvis[ind].soTranChi += Number(e.soTranChi);
                    })
                }
            });
            this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
                this.lstCtietBcao[index].tongCong += Number(item.soTranChi);
            })
            stt = this.getHead(stt);
        };
    };

    sum1() {
        this.lstCtietBcao.forEach(itm => {
            let stt = this.getHead(itm.stt);
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
                    tongCong: 0,
                    lstCtietDvis: mm,
                    checked: false,
                };
                this.lstCtietBcao.forEach(item => {
                    if (this.getHead(item.stt) == stt) {
                        item.lstCtietDvis.forEach(e => {
                            const ind = this.lstCtietBcao[index].lstCtietDvis.findIndex(i => i.maDviNhan == e.maDviNhan);
                            if (e.soTranChi) {
                                this.lstCtietBcao[index].lstCtietDvis[ind].soTranChi += Number(e?.soTranChi);
                            }
                        })
                    }
                })
                this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
                    this.lstCtietBcao[index].tongCong += Number(item.soTranChi);
                })
                stt = this.getHead(stt);
            };
        })
    };

    // tính tổng
    tinhTong() {
        this.lstCtietBcao.forEach(item => {
            const sttItem = item.stt
            const index = this.lstCtietBcao.findIndex(e => e.stt == sttItem);
            this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
                this.lstCtietBcao[index].tongCong = 0
                this.lstCtietBcao[index].tongCong += Number(item.soTranChi);
            })
        })
    };

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
        if (!this.userService.isAccessPermisson(Roles.GSTC.SUA_CV_QD_GIAO_SOKIEMTRA)) {
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

    // statusClass() {
    //     if (Utils.statusSave.includes(this.trangThaiBanGhi)) {
    //         return 'du-thao-va-lanh-dao-duyet';
    //     } else {
    //         return 'da-ban-hanh';
    //     }
    // };


}

