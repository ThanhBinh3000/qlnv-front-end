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
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { BtnStatus, CapVon, Cvnc, Doc, Report } from '../de-nghi-cap-von-cac-don-vi.constant';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-cap-von-quyet-dinh-don-gia-mua',
    templateUrl: './cap-von-quyet-dinh-don-gia-mua.component.html',
    styleUrls: ['../de-nghi-cap-von-cac-don-vi.component.scss'],
})
export class CapVonQuyetDinhDonGiaMuaComponent implements OnInit {
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
    editCache: { [key: string]: { edit: boolean; data: CapVon } } = {};
    maDviTien: string = '1';
    scrollDN: string;
    scrollCV: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable: boolean = false;
    editMoneyUnit: boolean = false;
    isParent: boolean = false;
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
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzWidth: '60%',
            nzFooter: null,
            nzComponentParams: {
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.baoCao.ngayCongVan = res.ngayCongVan;
                this.baoCao.congVan = {
                    ...new Doc(),
                    fileName: res.soCongVan,
                };
            }
        });
        this.fileDetail = file;
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.baoCao.lstFiles.push({
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    };

    constructor(
        private capVonNguonChiService: CapVonNguonChiService,
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
            if (this.lstCtiets.length > 1) {
                this.sum('0.1')
            }
        }
        this.updateEditCache();
        this.getStatusButton();
    }
    // set level cho tung hang cua bao cao dua tren stt
    setLevel() {
        this.lstCtiets.forEach(item => {
            item.level = item.stt.split('.').length - 2;
        })
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isChild = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        this.isParent = this.baoCao.maDviCha == this.userInfo?.MA_DVI;
        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && isChild && this.userService.isAccessPermisson(Roles.CVNC.EDIT_CV);
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && isChild && this.userService.isAccessPermisson(Roles.CVNC.SUBMIT_CV) && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && isChild && this.userService.isAccessPermisson(Roles.CVNC.PASS_CV);
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && isChild && this.userService.isAccessPermisson(Roles.CVNC.APPROVE_CV);
        this.status.export = this.baoCao.trangThai == Status.TT_07 && this.userService.isAccessPermisson(Roles.CVNC.EXPORT_CV) && isChild;
        this.scrollDN = Table.tableWidth(350, 11, 0, 0);
        this.scrollCV = this.status.save ? Table.tableWidth(300, 15, 1, 60) : Table.tableWidth(300, 15, 1, 0);
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

    // call chi tiet bao cao
    async getDetailReport() {
        await this.capVonNguonChiService.ctietDeNghi(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.lstCtiets = [];
                    data.data.lstCtiets.forEach(item => {
                        this.lstCtiets.push(new CapVon(item));
                    })
                    this.lstCtiets = Table.sortByIndex(this.lstCtiets)
                    this.setLevel()
                    this.listFile = [];
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
    }

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

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi?: string) {
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.capVonNguonChiService.trinhDeNghi(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.baoCao.ngayTrinh = data.data.ngayTrinh;
                this.baoCao.ngayDuyet = data.data.ngayDuyet;
                this.baoCao.ngayPheDuyet = data.data.ngayPheDuyet;
                this.getStatusButton();
                if (Status.check('reject', mcn)) {
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
        // kiểm tra còn hàng nào đang ở trạng thái edit không
        if (this.lstCtiets.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        // kiểm tra giới hạn của các trường trong bảng có vượt mức cho phép không
        if (this.lstCtiets.some(e => e.upperBound())) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        // kiểm tra kích cỡ file đính kèm có vượt mức cho phép không
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
        // upload file đính kèm
        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.baoCao.maDvi + '/' + this.baoCao.maDnghi));
        }
        //upload file công văn
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                request.congVan = {
                    ...await this.quanLyVonPhiService.upFile(file, this.baoCao.maDvi + '/' + this.baoCao.maDnghi),
                    fileName: this.baoCao.congVan.fileName,
                }
            }
        }
        // kiểm tra file cong văn đã được thêm hoặc upload thành công chưa
        if (!request.congVan?.fileUrl) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        // nếu chưa có id thì tạo mới báo cáo, ngược lại update
        if (!this.baoCao.id) {
            this.capVonNguonChiService.taoMoiDeNghi(request).toPromise().then(
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
            this.capVonNguonChiService.updateDeNghi(request).toPromise().then(
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

    updateEditCache(): void {
        this.lstCtiets.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new CapVon(item)
            };
        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new CapVon(this.lstCtiets[index]),
            edit: false
        };
    }

    getIndex(data: CapVon) {
        if (data.level == 0) {
            return null;
        }
        return Table.subIndex(data.stt);
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }
    // tính toán các giá trị khi số lượng thay đối
    changeTien(id: string) {
        this.editCache[id].data.gtThucHien = Operator.mul(this.editCache[id].data.slThucHien, this.editCache[id].data.donGia);
        this.editCache[id].data.vonDnCapLanNay = Operator.sum([this.editCache[id].data.gtThucHien, -this.editCache[id].data.tongVonVaDtoanDaCap]);
        this.editCache[id].data.tongTien = Operator.sum([this.editCache[id].data.tongVonVaDtoanDaCap, this.editCache[id].data.cong]);
        this.editCache[id].data.soConDuocCap = Operator.sum([this.editCache[id].data.gtThucHien, -this.editCache[id].data.tongTien]);
    }
    // tính toán lại các giá trị khi vốn thay đổi
    changeVon(id: string) {
        this.editCache[id].data.tongVonVaDtoanDaCap = Operator.sum([this.editCache[id].data.dtoanDaGiao, this.editCache[id].data.lkCong]);
        this.editCache[id].data.vonDnCapLanNay = Operator.sum([this.editCache[id].data.gtThucHien, -this.editCache[id].data.tongVonVaDtoanDaCap]);
        this.editCache[id].data.cong = Operator.sum([this.editCache[id].data.ung, this.editCache[id].data.cap]);
        this.editCache[id].data.tongTien = Operator.sum([this.editCache[id].data.tongVonVaDtoanDaCap, this.editCache[id].data.cong]);
        this.editCache[id].data.soConDuocCap = Operator.sum([this.editCache[id].data.gtThucHien, -this.editCache[id].data.tongTien]);
    }
    // cộng số liệu từ mức con lên mức cha
    sum(stt: string) {
        while (stt != '0') {
            const index = this.lstCtiets.findIndex(e => e.stt == stt);
            this.lstCtiets[index].slKeHoach = null;
            this.lstCtiets[index].slThucHien = null;
            this.lstCtiets[index].gtThucHien = null;
            this.lstCtiets[index].dtoanDaGiao = null;
            this.lstCtiets.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtiets[index].slKeHoach = Operator.sum([this.lstCtiets[index].slKeHoach, item.slKeHoach]);
                    this.lstCtiets[index].slThucHien = Operator.sum([this.lstCtiets[index].slThucHien, item.slThucHien]);
                    this.lstCtiets[index].gtThucHien = Operator.sum([this.lstCtiets[index].gtThucHien, item.gtThucHien]);
                    this.lstCtiets[index].dtoanDaGiao = Operator.sum([this.lstCtiets[index].dtoanDaGiao, item.dtoanDaGiao]);
                }
            })
            this.lstCtiets[index].tongVonVaDtoanDaCap = Operator.sum([this.lstCtiets[index].dtoanDaGiao, this.lstCtiets[index].lkCong]);
            this.lstCtiets[index].vonDnCapLanNay = Operator.sum([this.lstCtiets[index].gtThucHien, -this.lstCtiets[index].tongVonVaDtoanDaCap]);
            this.lstCtiets[index].tongTien = Operator.sum([this.lstCtiets[index].tongVonVaDtoanDaCap, this.lstCtiets[index].cong]);
            this.lstCtiets[index].soConDuocCap = Operator.sum([this.lstCtiets[index].gtThucHien, -this.lstCtiets[index].tongTien]);
            stt = Table.preIndex(stt)
        }
    }
    // xem chi tiết đề nghị cấp vốn được tổng hợp
    viewDetail(id: string) {
        const obj = {
            id: id,
            preData: this.dataInfo,
            tabSelected: Cvnc.DN_DON_GIA,
        }
        this.dataChange.emit(obj);
    }
    // xoa file trong bang file
    deleteFile(id: string): void {
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdDeleteFiles.push(id);
    }
    // download file về máy
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
    // export báo cáo thành excel
    exportToExcel() {
        const workbook = XLSX.utils.book_new();
        // nếu là bản ghi ở cục hoặc tổng cục thì bổ sung thêm đề nghị cấp vốn từ đơn vị cấp dưới
        if (!this.userService.isChiCuc()) {
            const head = [
                { t: 0, b: 5, l: 0, r: 11, val: null },
                { t: 0, b: 0, l: 0, r: 8, val: "Đề nghị cấp vốn từ đơn vị cấp dưới" },
                { t: 1, b: 1, l: 0, r: 8, val: Utils.getDocName(this.baoCao.congVan.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi) },
                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Đơn vị' },
                { t: 4, b: 4, l: 2, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Kế hoạch' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Thực hiện' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Đơn giá (theo quyết định)' },
                { t: 4, b: 5, l: 5, r: 5, val: 'Giá trị thực hiện' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Dự toán đã giao' },
                { t: 4, b: 4, l: 7, r: 9, val: 'Lũy kế vốn cấp đến thời điểm báo cáo' },
                { t: 5, b: 5, l: 7, r: 7, val: 'Tổng cấp ứng' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Tổng cấp vốn' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Tổng cộng' },
                { t: 4, b: 5, l: 10, r: 10, val: 'Tổng vốn và dự toán đã cấp' },
                { t: 4, b: 5, l: 11, r: 11, val: 'Vốn đề nghị cấp lần này = Giá trị theo kế hoạch - Lũy kế vốn cấp' },
            ]
            const fieldHD = ['stt', 'tenDvi', 'slKeHoach', 'slThucHien', 'donGia', 'gtThucHien', 'dtoanDaGiao', 'lkUng', 'lkCap',
                'lkCong', 'tongVonVaDtoanDaCap', 'vonDnCapLanNay'];
            const filterHD = this.lstCtiets.filter(e => e.level > 0).map(item => {
                const row: any = {};
                fieldHD.forEach(field => {
                    row[field] = field == 'stt' ? this.getIndex(item) : item[field];
                })
                return row;
            })
            const worksheetHD = Table.initExcel(head);
            XLSX.utils.sheet_add_json(worksheetHD, filterHD, { skipHeader: true, origin: Table.coo(head[0].l, head[0].b + 1) })
            XLSX.utils.book_append_sheet(workbook, worksheetHD, 'Đề nghị cấp vốn từ DVCD');
        }
        // tạo sheet cho bản ghi cấp vốn
        const header = [
            { t: 0, b: 5, l: 0, r: 16, val: null },
            { t: 0, b: 0, l: 0, r: 8, val: "Cấp vốn" },
            { t: 1, b: 1, l: 0, r: 8, val: Utils.getDocName(this.baoCao.congVan.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi) },
            { t: 4, b: 5, l: 0, r: 0, val: 'Đơn vị' },
            { t: 4, b: 4, l: 1, r: 2, val: 'Số lượng' },
            { t: 5, b: 5, l: 1, r: 1, val: 'Kế hoạch' },
            { t: 5, b: 5, l: 2, r: 2, val: 'Thực hiện' },
            { t: 4, b: 5, l: 3, r: 3, val: 'Đơn giá (theo quyết định)' },
            { t: 4, b: 5, l: 4, r: 4, val: 'Giá trị thực hiện' },
            { t: 4, b: 5, l: 5, r: 5, val: 'Dự toán đã giao' },
            { t: 4, b: 4, l: 6, r: 8, val: 'Lũy kế vốn cấp đến thời điểm báo cáo' },
            { t: 5, b: 5, l: 6, r: 6, val: 'Tổng cấp ứng' },
            { t: 5, b: 5, l: 7, r: 7, val: 'Tổng cấp vốn' },
            { t: 5, b: 5, l: 8, r: 8, val: 'Tổng cộng' },
            { t: 4, b: 5, l: 9, r: 9, val: 'Tổng vốn và dự toán đã cấp' },
            { t: 4, b: 5, l: 10, r: 10, val: 'Vốn đề nghị cấp lần này = Giá trị theo kế hoạch - Lũy kế vốn cấp' },
            { t: 4, b: 4, l: 11, r: 13, val: 'Vốn duyệt cấp lần này' },
            { t: 5, b: 5, l: 11, r: 11, val: 'Cấp ứng' },
            { t: 5, b: 5, l: 12, r: 12, val: 'Cấp vốn' },
            { t: 5, b: 5, l: 13, r: 13, val: 'Cộng' },
            { t: 4, b: 5, l: 14, r: 14, val: 'Tổng tiền (tổng tiền được cấp sau lần này)' },
            { t: 4, b: 5, l: 15, r: 15, val: 'Số còn được cấp' },
            { t: 4, b: 5, l: 16, r: 16, val: 'Ghi chú' },
        ]
        const fieldOrder = ['tenDvi', 'slKeHoach', 'slThucHien', 'donGia', 'gtThucHien', 'dtoanDaGiao', 'lkUng', 'lkCap', 'lkCong',
            'tongVonVaDtoanDaCap', 'vonDnCapLanNay', 'ung', 'cap', 'cong', 'tongTien', 'soConDuocCap', 'ghiChu'];
        const filterData = this.lstCtiets.filter(e => e.level == 0).map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = item[field];
            })
            return row;
        })
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cấp vốn');
        XLSX.writeFile(workbook, this.baoCao.maDnghi + '.xlsx');
    }
}
