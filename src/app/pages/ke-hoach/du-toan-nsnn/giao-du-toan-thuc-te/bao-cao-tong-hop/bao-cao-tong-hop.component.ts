import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Operator, Utils, Status, Table } from 'src/app/Utility/utils';
import { DialogCopyGiaoDuToanComponent } from 'src/app/components/dialog/dialog-copy-giao-du-toan/dialog-copy-giao-du-toan.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as XLSX from 'xlsx-js-style';
import { Doc } from '../giao-du-toan-thuc-te.constant';


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
    chenhLech: number;
    dviCapDuoiTh: number;
    checked!: boolean;
}


// khai báo class file
export class ItemSoQd {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-bao-cao-tong-hop',
    templateUrl: './bao-cao-tong-hop.component.html',
    styleUrls: ['./bao-cao-tong-hop.component.scss']
})
export class BaoCaoTongHopComponent implements OnInit {
    @Input() data;

    @Output() dataChange = new EventEmitter();
    Op = new Operator("1");
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
    maLoaiDan: string; // loại phương án 
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
    Status = Status;
    path: string;
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
                await this.onSubmit('8', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'refuse':
                await this.tuChoi('9').then(() => {
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
        this.capDvi = this.userInfo?.DON_VI.capDvi;
        this.maLoaiDan = this.data?.maLoaiDan;
        this.spinner.show();
        const request = {
            maDviCha: this.maDonViTao,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.lstDvi = data.data;
                    this.donVis = this.lstDvi.filter(e => e.tenVietTat && (e.tenVietTat.includes("CDT") || e.tenVietTat.includes("CNTT") || e.tenVietTat.includes("_VP")))
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
        this.spinner.hide();

        // check trường hợp tạo mới/ cập nhật/ tổng hợp
        if (this.id) {
            // call chi tiết bản ghi khi có id
            await this.getDetailReport();
        } else {
            await this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maPa = res.data.slice(0, 2) + "TH" + res.data.slice(2) // res.data;

                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                        return;
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    return;
                },
            );

            // khi không có id thì thực hiện tạo mới
            this.trangThaiBanGhi = '1';
            this.maDonViTao = this.userInfo?.MA_DVI;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.lstDvi = this.donVis.filter(e => e?.maDviCha === this.maDonViTao);
            this.maDviTien = '1'
            this.listIdFilesDelete = this.data?.listIdDeleteFiles;
            this.lstCtietBcao = this.data?.lstCtiets;
            this.maDvi = this.data?.maDvi;
            this.maPaCha = this.data?.maPa;
            this.maDviTien = this.data?.maDviTien;
            this.idPaBTC = this.data?.idPaBTC;
            this.namPa = this.data?.namPa;
            this.trangThaiBanGhi = this.data?.trangThai;


            this.lstDviTrucThuoc = this.data?.lstGiaoDtoanTrucThuocs;
            // this.lstDviTrucThuoc.forEach(item => {
            //     item.ngayTrinh = this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR)
            //     item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR)
            // }
            // )

            this.lstDviTrucThuoc.forEach(e => {
                if (e.ngayDuyet.includes('/')) {
                    e.ngayDuyet = e.ngayDuyet;
                    e.ngayPheDuyet = e.ngayPheDuyet;
                } else {
                    e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
                    e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                }
            });

            this.updateEditCache();
            if (!this.maPa) {
                this.location.back();
            }
        }
        this.path = this.maDonViTao + "/" + this.maPa;
        this.sum1();
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
                    this.maLoaiDan = data.data.maLoaiDan;
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
            lstCtietBcaoTemp.push({
                ...item,
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
            maLoaiDan: this.maLoaiDan,
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

        // gui du lieu trinh duyet len server
        this.lstCtietBcao.forEach(item => {
            if (item.tongCong > Utils.MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
            })
        })

        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

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
        // const listFile: any = [];
        // for (const iterator of this.listFile) {
        //     listFile.push(await this.uploadFile(iterator));
        // }

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
            lstGiaoDtoanTrucThuocs: this.lstDviTrucThuoc,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maPa: this.maPa,
            maPaCha: this.maPaCha,
            namPa: this.namPa,
            maPhanGiao: "3",
            trangThai: this.trangThaiBanGhi,
            thuyetMinh: this.thuyetMinh,
            ngayTao: this.ngayTao,
            maLoaiDan: this.maLoaiDan,
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
            lstGiaoDtoanTrucThuocs: this.lstDviTrucThuoc,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maPa: this.maPa,
            maPaCha: this.maPaCha,
            namPa: this.namPa,
            maPhanGiao: "3",
            trangThai: this.trangThaiBanGhi,
            thuyetMinh: this.thuyetMinh,
            ngayTao: this.ngayTao,
            maLoaiDan: this.maLoaiDan,
            maGiao: this.maGiao,
            soQd: this.soQd,
            tongHopTuIds: tongHopTuIds,
        }));

        const fileDinhKems = [];
        for (const iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.lstFiles.find(e => e.id == id)?.noiDung;
            fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.path, noiDung));
        }
        request1.fileDinhKems = fileDinhKems;
        request.fileDinhKems = fileDinhKems;

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

    xemChiTiet(id: string, maLoaiDan: string) {
        if (maLoaiDan == "1") {
            const obj = {
                id: id,
                tabSelected: 'phuongAnGiaoDuToan',
                preData: this.data,
            }
            this.dataChange.emit(obj);
        } else if (maLoaiDan == "2") {
            const obj = {
                id: id,
                tabSelected: 'phuongAnGiaoDieuChinh',
                preData: this.data,
            }
            this.dataChange.emit(obj);
        } else {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        }
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

    //check role cho các nut trinh duyet
    getStatusButton() {
        if ([Status.TT_01, Status.TT_03, Status.TT_05, Status.TT_08].includes(this.trangThaiBanGhi) && this.userService.isAccessPermisson(Roles.GTT.SUA_PA_TONGHOP_PBDT)) {
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

        const checkSave = this.userService.isAccessPermisson(Roles.GTT.SUA_PA_TONGHOP_PBDT);
        // this.statusBtnSave = this.getBtnStatus([Status.TT_01], Roles.GTT.EDIT_REPORT_PA_PBDT, checkChirld);
        this.statusBtnSave = Status.check('saveWHist', this.trangThaiBanGhi) && checkSave && checkChirld;
        this.statusBtnApprove = this.getBtnStatus([Status.TT_01], Roles.GTT.TRINHDUYET_PA_TONGHOP_PBDT, checkChirld);
        this.statusBtnTBP = this.getBtnStatus([Status.TT_02], Roles.GTT.DUYET_TUCHOI_PA_TH_PBDT, checkChirld);
        this.statusBtnLD = this.getBtnStatus([Status.TT_04], Roles.GTT.PHEDUYET_TUCHOI_PA_TH_PBDT, checkChirld);
        this.statusBtnCopy = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.GTT.COPY_PA_TONGHOP_PBDT, checkChirld);
        this.statusBtnPrint = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.GTT.IN_PA_TONGHOP_PBDT, checkChirld);
        this.statusBtnDVCT = this.getBtnStatus([Status.TT_06, Status.TT_07], Roles.GTT.TIEPNHAN_TUCHOI_PA_PBDT, checkParent);

        if (this.userService.isAccessPermisson(Roles.GTT.GIAO_PA_PBDT) && this.soQd) {
            this.statusBtnGiao = false;
        } else {
            this.statusBtnGiao = true;
            this.statusGiaoToanBo = true;
        }
        if (this.trangThaiBanGhi == "7") {
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
                    if (mcn == Status.TT_02) {
                        this.notification.success(MESSAGE.SUCCESS, mcn == Status.TT_02 ? MESSAGE.SUBMIT_SUCCESS : MESSAGE.APPROVE_SUCCESS);
                    } else if (mcn == Status.TT_06) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
                    } else if (mcn == Status.TT_07) {
                        this.notification.success(MESSAGE.SUCCESS, "Gửi đơn vị cấp trên thành công");
                    } else if (mcn == Status.TT_09) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.TRANG_THAI_TIEP_NHAN);
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
        this.lstCtietBcao[index] = {
            ...this.editCache[id].data,
        }
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        // this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }

    // hủy chỉnh sửa
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: {
                ...this.lstCtietBcao[index],
            },
            edit: false
        };
    }

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
        // this.sum(stt);
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
    };


    // lấy tên đơn vị trực thuộc
    getUnitNameDviTT(maDviTT: string) {
        return this.donVis.find(e => e.maDvi == maDviTT)?.tenDvi;
    }

    // hiển thị trạng thái báo cáo của đơn vị trực thuộc
    getStatusNameDviTT(trangThaiDVTT: string) {
        return this.trangThais.find(e => e.id == trangThaiDVTT)?.tenDm;
    };

    // upload danh sách văn bản đính kèm
    // them file vao danh sach
    handleUpload() {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({
                ... new Doc(),
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        console.log(this.listFile);

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

    // gán editCache.data = lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: {
                    id: item.id,
                    stt: item.stt,
                    level: item.level,
                    maNdung: item.maNdung,
                    tongCong: item.tongCong,
                    chenhLech: item.chenhLech,
                    dviCapDuoiTh: item.dviCapDuoiTh,
                    checked: false,
                }
            }
        })
    }

    sum1() {
        this.lstCtietBcao.forEach(itm => {
            let stt = this.getHead(itm.stt);
            while (stt != '0') {
                const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
                const data = this.lstCtietBcao[index];
                this.lstCtietBcao[index] = {
                    ...new ItemData(),
                    id: data.id,
                    stt: data.stt,
                    maNdung: data.maNdung,
                    level: data.level,
                }
                this.lstCtietBcao.forEach(item => {
                    if (this.getHead(item.stt) == stt) {
                        this.lstCtietBcao[index].chenhLech = Operator.sum([this.lstCtietBcao[index].chenhLech, item.chenhLech]);
                        this.lstCtietBcao[index].dviCapDuoiTh = Operator.sum([this.lstCtietBcao[index].dviCapDuoiTh, item.dviCapDuoiTh]);
                        this.lstCtietBcao[index].tongCong = Operator.sum([this.lstCtietBcao[index].tongCong, item.tongCong]);
                    }
                })
                stt = this.getHead(stt);
            }
        })

    }

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
        if (!this.userService.isAccessPermisson(Roles.GTT.SUA_CV_QD_GIAO_PA_PBDT)) {
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

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        let loaiPa
        if (this.maLoaiDan == "1") {
            loaiPa = "Phương án giao NSNN"
        } else {
            loaiPa = "Phương án giao điều chỉnh NSNN"
        }
        const header = [
            { t: 0, b: 5 + this.lstCtietBcao.length, l: 0, r: 4, val: null },

            { t: 0, b: 0, l: 0, r: 1, val: `Báo cáo tổng hợp ${loaiPa}` },

            { t: 1, b: 1, l: 1, r: 1, val: `Ngày ` },
            { t: 1, b: 1, l: 2, r: 2, val: `Mã phương án ` },
            { t: 1, b: 1, l: 3, r: 3, val: `Loại phương án ` },
            { t: 1, b: 1, l: 4, r: 4, val: `Trạng thái ` },

            { t: 2, b: 2, l: 1, r: 1, val: ` ${this.ngayTao} ` },
            { t: 2, b: 2, l: 2, r: 2, val: ` ${this.maPa} ` },
            { t: 2, b: 2, l: 3, r: 3, val: ` ${loaiPa} ` },
            { t: 2, b: 2, l: 4, r: 4, val: ` ${this.getStatusName()} ` },

            { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Nội dung' },
            { t: 4, b: 5, l: 2, r: 2, val: 'Tổng số' },
            { t: 4, b: 5, l: 3, r: 3, val: 'Đơn vị cấp dưới đã thực hiện' },
            { t: 4, b: 5, l: 4, r: 4, val: 'Chênh lệch' },
        ]

        const headerBot = 5;
        this.lstCtietBcao.forEach((item, index) => {
            const row = headerBot + index + 1;
            const tenNdung = this.getTenNdung(item.maNdung);
            header.push({ t: row, b: row, l: 0, r: 0, val: this.getChiMuc(item.stt) })
            header.push({ t: row, b: row, l: 1, r: 1, val: tenNdung })
            header.push({ t: row, b: row, l: 2, r: 2, val: (item.tongCong ? item.tongCong : 0)?.toString() })
            header.push({ t: row, b: row, l: 3, r: 3, val: (item.dviCapDuoiTh ? item.dviCapDuoiTh : 0)?.toString() })
            header.push({ t: row, b: row, l: 4, r: 4, val: (item.chenhLech ? item.chenhLech : 0)?.toString() })
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.maPa;
        excelName = excelName + '_GTT_BCTH.xlsx'
        XLSX.writeFile(workbook, excelName);
    }

    getTenNdung(maNdung: number): any {
        let tenNdung: string;
        this.noiDungs.forEach(itm => {
            if (itm.ma == maNdung) {
                return tenNdung = itm.giaTri;
            }
        })
        return tenNdung
    }

}

