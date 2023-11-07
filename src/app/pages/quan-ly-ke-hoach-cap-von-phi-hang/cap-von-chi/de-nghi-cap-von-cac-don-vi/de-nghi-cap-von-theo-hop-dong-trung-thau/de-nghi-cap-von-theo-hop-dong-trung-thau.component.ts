import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Roles, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogCongVanComponent } from 'src/app/components/dialog/dialog-cong-van/dialog-cong-van.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { BtnStatus, CapVon, Cvnc, Doc, Report } from '../de-nghi-cap-von-cac-don-vi.constant';
import * as XLSX from 'xlsx-js-style';

@Component({
    selector: 'app-de-nghi-cap-von-theo-hop-dong-trung-thau',
    templateUrl: './de-nghi-cap-von-theo-hop-dong-trung-thau.component.html',
    styleUrls: ['../de-nghi-cap-von-cac-don-vi.component.scss'],
})
export class DeNghiCapVonTheoHopDongTrungThauComponent implements OnInit {
    @Input() dataInfo;
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Op = new Operator('1');
    Utils = Utils;
    Cvnc = Cvnc;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    lstCtiets: CapVon[] = [];
    maDviTien: string = '1';
    scrollHD: string;
    scrollCV: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable: boolean = false;
    editMoneyUnit: boolean = false;
    isParent: boolean = false;
    isSynth: boolean = false;
    //file
    fileDetail: NzUploadFile;
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    listIdDeleteFiles: string[] = [];

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        const modalAppendix = this.modal.create({
            nzTitle: 'Thêm mới công văn',
            nzContent: DialogCongVanComponent,
            nzWidth: '60%',
            nzFooter: null,
            nzComponentParams: {
                soCv: this.baoCao.congVan?.fileName,
                ngayCv: this.baoCao.ngayCongVan,
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.baoCao.ngayCongVan = res.ngayCongVan;
                this.baoCao.congVan = {
                    ...new Doc(),
                    fileName: res.soCongVan,
                };
                this.fileDetail = file;
            }
        });
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.baoCao.lstFiles.push({
                ... new Doc(),
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    };

    constructor(
        private CapVonNguonChiService: CapVonNguonChiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.action('init');
    }

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
                await this.tuChoi(Status.TT_03).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'pass':
                await this.onSubmit(Status.TT_04).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonapprove':
                await this.tuChoi(Status.TT_05).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'approve':
                await this.onSubmit(Status.TT_07).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonaccept':
                await this.tuChoi(Status.TT_08).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'accept':
                await this.onSubmit(Status.TT_09).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            default:
                break;
        }
        this.spinner.hide();
    }

    async initialization() {
        //lay id cua de nghi
        this.userInfo = this.userService.getUserLogin();
        if (this.dataInfo?.id) {
            this.baoCao.id = this.dataInfo?.id;
            await this.getDetailReport();
        } else {
            this.baoCao = this.dataInfo?.baoCao;
            this.lstCtiets = this.baoCao.lstCtiets;
            this.lstCtiets = Table.sortByIndex(this.lstCtiets)
            this.setLevel()
            // this.sum('0.1')
        }
        this.getStatusButton();
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isChild = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        this.isParent = this.baoCao.maDviCha == this.userInfo?.MA_DVI;

        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && this.userService.isTongCuc() && this.baoCao.loaiDnghi != Cvnc.VTU;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) || (this.baoCao.trangThai == Status.TT_02 && (!this.userService.isTongCuc() || this.baoCao.loaiDnghi == Cvnc.VTU));
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && this.isParent;
        // this.status.export = this.baoCao.trangThai == Status.TT_09 || (this.baoCao.trangThai == Status.TT_07 && isChild && this.userService.isTongCuc());

        this.status.save = this.status.save && this.userService.isAccessPermisson(Roles.CVNC.EDIT_DN);
        this.status.submit = this.status.submit && this.userService.isAccessPermisson(Roles.CVNC.SUBMIT_DN);
        this.status.pass = this.status.pass && this.userService.isAccessPermisson(Roles.CVNC.PASS_DN) && isChild;
        this.status.approve = this.status.approve && this.userService.isAccessPermisson(Roles.CVNC.APPROVE_DN) && isChild;
        this.status.accept = this.status.accept && this.userService.isAccessPermisson(Roles.CVNC.ACCEPT_DN);
        this.status.export = this.userService.isAccessPermisson(Roles.CVNC.EXPORT_DN) && (isChild || this.isParent) && !(!this.baoCao.id);

        this.isSynth = isChild && this.userService.isTongCuc() && this.baoCao.loaiDnghi != Cvnc.VTU;
        if (this.baoCao.loaiDnghi != Cvnc.VTU) {
            this.scrollHD = Table.tableWidth(500, 7, 1, 0);
            this.scrollCV = Table.tableWidth(300, 16, 1, 0);
        } else {
            this.scrollHD = Table.tableWidth(500, 9, 1, 0);
            this.scrollCV = Table.tableWidth(300, 18, 1, 0);
        }
    }

    back() {
        if (this.dataInfo?.preData) {
            this.dataChange.emit(this.dataInfo?.preData)
        } else {
            const obj = {
                tabSelected: this.dataInfo?.preTab,
            }
            this.dataChange.emit(obj);
        }
    }

    setLevel() {
        this.lstCtiets.forEach(item => {
            item.level = item.stt.split('.').length - 2;
        })
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.CapVonNguonChiService.ctietDeNghi(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.lstCtiets = [];
                    data.data.lstCtiets.forEach(item => {
                        this.lstCtiets.push(new CapVon(item));
                    })
                    this.lstCtiets = Table.sortByIndex(this.lstCtiets)
                    this.setLevel();
                    this.baoCao.listIdDeleteFiles = [];
                    this.listFile = [];
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

    async submitReport() {
        // if (!this.baoCao.congVan?.fileUrl) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        //     return;
        // }
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

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi?: string) {
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.CapVonNguonChiService.trinhDeNghi(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.baoCao.ngayTrinh = data.data.ngayTrinh;
                this.baoCao.ngayDuyet = data.data.ngayDuyet;
                this.baoCao.ngayPheDuyet = data.data.ngayPheDuyet;
                this.baoCao.ngayTraKq = data.data.ngayTraKq;
                this.getStatusButton();
                this.notification.success(MESSAGE.SUCCESS, Status.notiMessage(mcn));
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }

    //show popup tu choi
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
    }

    // luu
    async save() {
        if (this.baoCao.lstFiles.some(e => e.isEdit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_SAVE_FILE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietTemp: CapVon[] = [];
        this.lstCtiets.forEach(item => {
            lstCtietTemp.push(item.request())
        })
        const request = JSON.parse(JSON.stringify(this.baoCao));
        request.lstCtiets = lstCtietTemp;
        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.baoCao.lstFiles.find(e => e.id == id)?.noiDung;
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.baoCao.maDvi + '/' + this.baoCao.maDnghi, noiDung));
        }
        request.fileDinhKems = request.fileDinhKems.concat(this.baoCao.lstFiles.filter(e => typeof e.id == 'number'))

        // //get file cong van url
        // const file: any = this.fileDetail;
        // if (file) {
        //     if (file.size > Utils.FILE_SIZE) {
        //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
        //         return;
        //     } else {
        //         request.congVan = {
        //             ...await this.quanLyVonPhiService.upFile(file, this.baoCao.maDvi + '/' + this.baoCao.maDnghi),
        //             fileName: this.baoCao.congVan.fileName,
        //         }
        //     }
        // }

        if (!this.baoCao.id) {
            this.CapVonNguonChiService.taoMoiDeNghi(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.baoCao.id = data.data.id;
                        this.action('detail');
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.CapVonNguonChiService.updateDeNghi(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        this.action('detail');
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
    }

    sum(stt: string) {
        while (stt != '0') {
            const index = this.lstCtiets.findIndex(e => e.stt == stt);
            this.lstCtiets[index].slKeHoach = null;
            this.lstCtiets[index].slHopDong = null;
            this.lstCtiets[index].slThucHien = null;
            this.lstCtiets[index].gtHopDong = null;
            this.lstCtiets[index].gtThucHien = null;
            this.lstCtiets[index].phatViPham = null;
            this.lstCtiets[index].tlSoluong = null;
            this.lstCtiets[index].tlThanhTien = null;
            this.lstCtiets.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtiets[index].slKeHoach = Operator.sum([this.lstCtiets[index].slKeHoach, item.slKeHoach]);
                    this.lstCtiets[index].slHopDong = Operator.sum([this.lstCtiets[index].slHopDong, item.slHopDong]);
                    this.lstCtiets[index].slThucHien = Operator.sum([this.lstCtiets[index].slThucHien, item.slThucHien]);
                    this.lstCtiets[index].gtHopDong = Operator.sum([this.lstCtiets[index].gtHopDong, item.gtHopDong]);
                    this.lstCtiets[index].gtThucHien = Operator.sum([this.lstCtiets[index].gtThucHien, item.gtThucHien]);
                    this.lstCtiets[index].phatViPham = Operator.sum([this.lstCtiets[index].phatViPham, item.phatViPham]);
                    this.lstCtiets[index].tlSoluong = Operator.sum([this.lstCtiets[index].tlSoluong, item.tlSoluong]);
                    this.lstCtiets[index].tlThanhTien = Operator.sum([this.lstCtiets[index].tlThanhTien, item.tlThanhTien]);
                }
            })
            stt = Table.preIndex(stt)
        }
    }

    viewDetail(id: string) {
        const obj = {
            id: id,
            preData: this.dataInfo,
            tabSelected: Cvnc.DN_HOP_DONG,
        }
        this.dataChange.emit(obj);
    }

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any;
        let doc: any;
        if (!id) {
            file = this.fileDetail;
            doc = this.baoCao.congVan
        } else {
            file = this.listFile.find(element => element?.lastModified.toString() == id);
            doc = this.baoCao.lstFiles.find(element => element?.id == id);
        }
        await this.quanLyVonPhiService.downFile(file, doc);
    }

    exportToExcel() {
        const workbook = XLSX.utils.book_new();
        const congVan = this.baoCao.congVan?.fileName ? Utils.getDocName(this.baoCao.congVan.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi) : '';
        // export sheet hợp đồng
        let headerHD = [];
        let fieldHD = []
        let calHeaderHd = [];
        if (this.baoCao.loaiDnghi == Cvnc.VTU) {
            headerHD = [
                { t: 0, b: 5, l: 0, r: 10, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Hợp đồng" },
                { t: 1, b: 1, l: 0, r: 8, val: congVan },
                { t: 2, b: 2, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + Status.reportStatusName(this.baoCao.trangThai, this.isParent) },
                { t: 4, b: 5, l: 0, r: 0, val: 'Tên khách hàng' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Quyết định phê duyệt kết quả lựa chọn nhà thầu / Hợp đồng' },
                { t: 4, b: 4, l: 2, r: 4, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Hợp đồng' },
                { t: 5, b: 5, l: 4, r: 4, val: 'Thực hiện' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Đơn giá (đồng / kg)' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Giá trị hợp đồng (đã bao gồm VAT) (đồng)' },
                { t: 4, b: 5, l: 7, r: 7, val: 'Giá trị thực hiện' },
                { t: 4, b: 5, l: 8, r: 8, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 9, r: 10, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Số lượng' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Thành tiền' },
            ]
            fieldHD = ['tenKhachHang', 'qdPheDuyet', 'slKeHoach', 'slHopDong', 'slThucHien', 'donGia', 'gtHopDong', 'gtThucHien', 'phatViPham',
                'tlSoluong', 'tlThanhTien'];
            calHeaderHd = ['B', 'C', '1', '2', '3', '4', '5=2x4', '6=3x4', '7', '8', '9'];
        } else {
            headerHD = [
                { t: 0, b: 5, l: 0, r: 8, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Hợp đồng" },
                { t: 1, b: 1, l: 0, r: 8, val: congVan },
                { t: 2, b: 2, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + Status.reportStatusName(this.baoCao.trangThai, this.isParent) },
                { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Quyết định phê duyệt kết quả lựa chọn nhà thầu / Hợp đồng' },
                { t: 4, b: 4, l: 2, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Hợp đồng' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Đơn giá (đồng / kg)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị hợp đồng (đã bao gồm VAT) (đồng)' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 7, r: 8, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Số lượng' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Thành tiền' },
            ]
            fieldHD = ['tenDvi', 'qdPheDuyet', 'slKeHoach', 'slHopDong', 'donGia', 'gtHopDong', 'phatViPham',
                'tlSoluong', 'tlThanhTien', 'congVan'];
            calHeaderHd = ['A', 'C', '1', '2', '4', '5=2x4', '7', '8', '9'];
        }
        const filterDataHD = this.lstCtiets.filter(e => e.level > (this.isSynth ? 1 : 0)).map(item => {
            const row: any = {};
            fieldHD.forEach(field => {
                row[field] = Utils.getValue(item[field]);
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        const calHd = {};
        fieldHD.forEach((field, index) => {
            calHd[field] = calHeaderHd[index];
        })
        filterDataHD.unshift(calHd);
        const worksheetHD = Table.initExcel(headerHD);
        XLSX.utils.sheet_add_json(worksheetHD, filterDataHD, { skipHeader: true, origin: Table.coo(headerHD[0].l, headerHD[0].b + 1) })
        //Thêm khung viền cho bảng
        for (const cell in worksheetHD) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheetHD[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheetHD, 'Hợp đồng');
        // export sheet cap von
        let header = [];
        let fieldOrder = [];
        let calHeader = [];
        if (this.baoCao.loaiDnghi == Cvnc.VTU) {
            header = [
                { t: 0, b: 5, l: 0, r: 14, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Đề nghị cấp vốn" },
                { t: 1, b: 1, l: 0, r: 8, val: congVan },
                { t: 2, b: 2, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + Status.reportStatusName(this.baoCao.trangThai, this.isParent) },
                { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
                { t: 4, b: 4, l: 1, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 1, r: 1, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Hợp đồng' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Thực hiện' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Giá trị hợp đồng (đã bao gồm VAT) (đồng)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị thực hiện' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Dự toán đã giao' },
                { t: 4, b: 4, l: 7, r: 9, val: 'Lũy kế vốn cấp đến thời điểm báo cáo' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Vốn ứng' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Vốn cấp' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Cộng' },
                { t: 4, b: 5, l: 10, r: 10, val: 'Tổng vốn và dự toán đã cấp đến thời điểm báo cáo' },
                { t: 4, b: 5, l: 11, r: 11, val: 'Vốn đề nghị cấp lần này' },
                { t: 4, b: 5, l: 12, r: 12, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 13, r: 14, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 13, r: 13, val: 'Số lượng' },
                { t: 5, b: 5, l: 14, r: 14, val: 'Thành tiền' },
            ]
            fieldOrder = ['tenDvi', 'slKeHoach', 'slHopDong', 'slThucHien', 'gtHopDong', 'gtThucHien', 'dtoanDaGiao', 'lkUng', 'lkCap', 'lkCong',
                'tongVonVaDtoanDaCap', 'vonDnCapLanNay', 'phatViPham', 'tlSoluong', 'tlThanhTien'];
            calHeader = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9=7+8', '10=6+9', '11=5-10', '12', '13', '14'];
        } else {
            header = [
                { t: 0, b: 5, l: 0, r: 12, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Cấp vốn" },
                { t: 1, b: 1, l: 0, r: 8, val: congVan },
                { t: 2, b: 2, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + Status.reportStatusName(this.baoCao.trangThai, this.isParent) },
                { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
                { t: 4, b: 4, l: 1, r: 2, val: 'Số lượng' },
                { t: 5, b: 5, l: 1, r: 1, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Hợp đồng' },
                { t: 4, b: 5, l: 3, r: 3, val: 'Giá trị hợp đồng (đã bao gồm VAT) (đồng)' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Dự toán đã giao' },
                { t: 4, b: 4, l: 5, r: 7, val: 'Lũy kế vốn cấp đến thời điểm báo cáo' },
                { t: 5, b: 5, l: 5, r: 5, val: 'Vốn ứng' },
                { t: 5, b: 5, l: 6, r: 6, val: 'Vốn cấp' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Cộng' },
                { t: 4, b: 5, l: 8, r: 8, val: 'Tổng vốn và dự toán đã cấp đến thời điểm báo cáo' },
                { t: 4, b: 5, l: 9, r: 9, val: 'Vốn đề nghị cấp lần này' },
                { t: 4, b: 5, l: 10, r: 10, val: 'Vi phạm hợp đồng' },
                { t: 4, b: 4, l: 11, r: 12, val: 'Thanh lý hợp đồng' },
                { t: 5, b: 5, l: 11, r: 11, val: 'Số lượng' },
                { t: 5, b: 5, l: 12, r: 12, val: 'Thành tiền' },
            ]
            fieldOrder = ['tenDvi', 'slKeHoach', 'slHopDong', 'gtHopDong', 'dtoanDaGiao', 'lkUng', 'lkCap', 'lkCong',
                'tongVonVaDtoanDaCap', 'vonDnCapLanNay', 'phatViPham', 'tlSoluong', 'tlThanhTien'];
            calHeader = ['A', '1', '2', '4', '6', '7', '8', '9=7+8', '10=6+9', '11=4-10', '12', '13', '14'];
        }
        const filterData = this.lstCtiets.filter(e => e.level < (this.isSynth ? 2 : 1)).map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = Utils.getValue(item[field]);
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        const cal = {};
        fieldOrder.forEach((field, index) => {
            cal[field] = calHeader[index];
        })
        filterData.unshift(cal);
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        //Thêm khung viền cho bảng
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Đề nghị cấp vốn');
        XLSX.writeFile(workbook, this.baoCao.maDnghi + '.xlsx');
    }
}
