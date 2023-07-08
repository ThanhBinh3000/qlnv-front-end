import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from 'uuid';
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class ItemData {
    id: any;
    stt: string;
    tenTaiSan: string;
    maTaiSan: string;
    level: any;
    checked: boolean;
    sluongTsanTdiemBcao: number;
    sluongTsanDaNhan: number;
    sluongTsanPduyet: number;
    sluongTsanTcong: number;
    tchuanDmucTda: number;
    dtoanDnghiSluong: number;
    dtoanDnghiMgia: number;
    thanhTien: number;
    tdinhSluong: number;
    tdinhTtien: number;
    chenhLech: number;
    thuyetMinh: string;
    ykienDviCtren: string
}
@Component({
    selector: 'app-phu-luc-06',
    templateUrl: './phu-luc-06.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})

export class PhuLuc06Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    listVtu: any[] = [];
    lstCtietBcao: ItemData[] = [];
    scrollX: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    listIdDeleteFiles: string[] = [];

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.formDetail.lstFiles.push({
                ... new Doc(),
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    };

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private danhMucService: DanhMucDungChungService,
        private fileManip: FileManip,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;
        if (this.status.general) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_PL6');
            if (category) {
                this.listVtu = category.data;
            }
            this.scrollX = Table.tableWidth(350, 8, 1, 360);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 11, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 11, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 8, 1, 0);
            }
        }

        this.updateEditCache();
        this.tinhTong();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async getFormDetail() {
        await this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.lstCtietBcao = this.formDetail.lstCtietLapThamDinhs;
                    this.formDetail.listIdDeleteFiles = [];
                    this.listFile = [];
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    }

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.sluongTsanTdiemBcao > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                id: item.id?.length == 38 ? null : item.id,
            })
        })

        if (this.status.general) {
            lstCtietBcaoTemp.forEach(item => {
                item.tdinhSluong = item.dtoanDnghiSluong;
                item.tdinhTtien = item.thanhTien;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
        }

        request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    this._modalRef.close({
                        trangThai: data.data.trangThai,
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
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
                this.save(mcn, text);
            }
        });
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.tinhTong();
        this.updateEditCache();
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    deleteSelected() {
        // delete object have checked = true
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
        this.allChecked = false;
        this.tinhTong()
    }

    // xoa dong
    deleteById(id: string): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id);
        this.tinhTong();
    }

    // start edit
    startEdit(id: string): void {
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    // click o checkbox all
    updateAllChecked(): void {
        this.lstCtietBcao.forEach(item => {
            item.checked = this.allChecked;
        })
    }

    // them dong moi
    addLine(id: number): void {
        const item: ItemData = {
            ... new ItemData(),
            id: uuid.v4() + 'FE',
            checked: false,
        }

        this.lstCtietBcao.splice(id + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    selectTaisan(idTaiSan: any, idRow: any) {
        const taiSan = this.listVtu.find(ts => ts.ma === idTaiSan);
        this.editCache[idRow].data.tenTaiSan = taiSan.giaTri;
    }

    tinhTong() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            this.total.tchuanDmucTda = Operator.sum([this.total.tchuanDmucTda, item.tchuanDmucTda]);
            this.total.dtoanDnghiMgia = Operator.sum([this.total.dtoanDnghiMgia, item.dtoanDnghiMgia]);
            this.total.thanhTien = Operator.sum([this.total.thanhTien, item.thanhTien]);
            this.total.tdinhTtien = Operator.sum([this.total.tdinhTtien, item.tdinhTtien]);
            this.total.chenhLech = Operator.sum([this.total.chenhLech, item.chenhLech]);
        })
    }

    changeModel(id: string): void {
        this.editCache[id].data.sluongTsanTcong = Operator.sum([this.editCache[id].data.sluongTsanTdiemBcao, this.editCache[id].data.sluongTsanDaNhan, this.editCache[id].data.sluongTsanPduyet]);
        if (this.editCache[id].data.dtoanDnghiSluong > Operator.sum([this.editCache[id].data.tchuanDmucTda, -this.editCache[id].data.sluongTsanTcong])) {
            this.editCache[id].data.dtoanDnghiSluong = Operator.sum([this.editCache[id].data.tchuanDmucTda, -this.editCache[id].data.sluongTsanTcong]);
        }
        this.editCache[id].data.thanhTien = Operator.mul(this.editCache[id].data.dtoanDnghiSluong, this.editCache[id].data.dtoanDnghiMgia);
        this.editCache[id].data.tdinhTtien = Operator.mul(this.editCache[id].data.tdinhSluong, this.editCache[id].data.dtoanDnghiMgia);
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.tdinhTtien, -this.editCache[id].data.thanhTien]);
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.formDetail.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
        await this.fileManip.downloadFile(file, doc);
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 14, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Tên tài sản (theo danh mục được phê duyệt tại Quyết định số 149/QĐ-TCDT)' },
            { t: 0, b: 0, l: 2, r: 5, val: 'Số lượng tài sản; MM, thiết bị hiện có' },
            { t: 1, b: 1, l: 2, r: 2, val: 'Đến thời điểm báo cáo (trên phần mềm QLTS) ' },
            { t: 1, b: 1, l: 3, r: 3, val: 'Đã nhận chưa có QĐ điều chuyển' },
            { t: 1, b: 1, l: 4, r: 4, val: 'Được phê duyệt mua sắm năm ' + (this.namBcao - 1).toString() },
            { t: 1, b: 1, l: 5, r: 5, val: 'Tổng cộng' },
            { t: 0, b: 1, l: 6, r: 6, val: 'Tiêu chuẩn định mức tối đa được trang bị' },
            { t: 0, b: 0, l: 7, r: 8, val: 'Dự toán đề nghị trang bị năm ' + this.namBcao.toString() },
            { t: 1, b: 1, l: 7, r: 7, val: 'Số lượng' },
            { t: 1, b: 1, l: 8, r: 8, val: 'Mức giá' },
            { t: 0, b: 1, l: 9, r: 9, val: 'Thành tiền' },
            { t: 0, b: 0, l: 10, r: 11, val: 'Thẩm định' },
            { t: 1, b: 1, l: 10, r: 10, val: 'Số lượng' },
            { t: 1, b: 1, l: 11, r: 11, val: 'Thành tiền' },
            { t: 0, b: 1, l: 12, r: 12, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
            { t: 0, b: 1, l: 13, r: 13, val: 'Thuyết minh' },
            { t: 0, b: 1, l: 14, r: 14, val: 'Ý kiến của đơn vị cấp trên' },
        ]
        const fieldOrder = ['stt', 'tenTaiSan', 'sluongTsanTdiemBcao', 'sluongTsanDaNhan', 'sluongTsanPduyet', 'sluongTsanTcong', 'tchuanDmucTda', 'dtoanDnghiSluong',
            'dtoanDnghiMgia', 'thanhTien', 'tdinhSluong', 'tdinhTtien', 'chenhLech', 'ghiChu', 'ykienDviCtren']
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = item[field]
            })
            return row;
        })
        let ind = 1;
        filterData.forEach(item => {
            item.stt = ind.toString();
            ind += 1;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_VI.xlsx');
    }

}
