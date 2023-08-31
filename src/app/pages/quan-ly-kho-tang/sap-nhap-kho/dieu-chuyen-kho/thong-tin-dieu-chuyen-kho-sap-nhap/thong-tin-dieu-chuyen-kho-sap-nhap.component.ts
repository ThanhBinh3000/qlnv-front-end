import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { v4 as uuidv4 } from "uuid";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { StorageService } from "../../../../../services/storage.service";
import { DonviService } from "../../../../../services/donvi.service";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { STATUS } from "../../../../../constants/status";
import { MESSAGE } from "../../../../../constants/message";
import { chain, cloneDeep, groupBy } from 'lodash';
import { FILETYPE } from "../../../../../constants/fileType";
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';
import {
    DanhMucDuyetKhoService
} from "../../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/danh-muc-duyet-kho.service";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { QuyetDinhDieuChuyenService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/quyet-dinh-dieu-chuyen.service';
import { DieuChuyenKhoService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/dieu-chuyen-kho.service';
import { FileDinhKem } from 'src/app/models/FileDinhKem';

@Component({
    selector: 'app-thong-tin-dieu-chuyen-kho-sap-nhap',
    templateUrl: './thong-tin-dieu-chuyen-kho-sap-nhap.component.html',
    styleUrls: ['./thong-tin-dieu-chuyen-kho-sap-nhap.component.scss']
})
export class ThongTinDieuChuyenKhoSapNhapComponent extends Base2Component implements OnInit {
    @ViewChild(NzTreeSelectComponent, { static: true })
    treeSelectComPonent: NzTreeSelectComponent;
    @Input('isView') isView: boolean;
    @Output()
    showListEvent = new EventEmitter<any>();
    @Input() idInput: number;
    fileDinhKem: Array<FileDinhKem>;
    expandSetString = new Set<string>();
    listTrangThaiSn: any[] = [
        { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa thực hiện" },
        { ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang thực hiện" },
        { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành" },
    ];
    ObTrangThai: { [key: string]: string } = {
        [this.STATUS.DANG_NHAP_DU_LIEU]: "Dang nhập dữ liệu"
    };
    obLoai: { [key: string]: string } = {
        "SN_DIEM_KHO": "Điều chuyển - sáp nhập điểm kho",
        "SN_CHI_CUC": "Điều chuyển - sáp nhập chi cục"
    }
    dsCuc: any;
    dsCucDi: any;
    dsCucDen: any;
    dsChiCuc: any;
    dsChiCucDi: any;
    dsChiCucDen: any;
    dsKho: any;
    dsKhoDi: any;
    dsKhoDen: any;
    hasError: boolean = false;
    dataView: any[] = [];
    dataTableHang: any[] = [];
    dataViewHang: any[] = [];
    dataTableHangChiCuc: any[] = [];
    dataViewHangChiCuc: any[] = [];
    dataTableChiCuc: any[] = [];
    dataViewChiCuc: any[] = [];
    listDs: { [key: string]: any[] } = {};
    dataTableVp: any[] = [];
    rowItem: { [key: string]: any } = {};
    rowDataVpClone: { [key: string]: any } = {};
    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private donviService: DonviService,
        private danhMucService: DanhMucService,
        private quyetDinhDieuChuyenService: QuyetDinhDieuChuyenService,
        private danhMucDuyetKhoService: DanhMucDuyetKhoService,
        private dieuChuyenKhoService: DieuChuyenKhoService
    ) {
        super(httpClient, storageService, notification, spinner, modal, dieuChuyenKhoService);
        this.formData = this.fb.group({
            id: [],
            maDvi: [],
            tenDvi: [],
            nam: [dayjs().get("year"), [Validators.required]],
            soQuyetDinh: [],
            soQuyetDinhId: [],
            ngayKy: [],
            lyDoTuChoi: [],
            trichYeu: [],
            trangThai: [STATUS.DANG_NHAP_DU_LIEU],
            tenTrangThai: [],
            trangThaiSn: [],
            tenTrangThaiSn: [],
            quyetDinhPdDtl: [new Array<ItemXhXkVtquyetDinhPdDtl>()],
            loai: ["SN_DIEM_KHO"],
        });
    }

    async ngOnInit() {
        await this.spinner.show();
        try {
            if (this.idInput) {
                await this.getDetail(this.idInput);
            } else {
                this.bindingData()
            }
        } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        finally {
            await this.spinner.hide()
        }
    }
    async bindingData() {
        this.formData.patchValue({
            tenDvi: this.userInfo.TEN_DVI,
            maDvi: this.userInfo.MA_DVI
        })
    }
    async save() {
        if (!["SN_DIEM_KHO", "SN_CHI_CUC"].includes(this.formData.value.loai)) {
            this.notification.error(MESSAGE.ERROR, "Loại điều chuyển sáp nhập chưa được xác định");
            return;
        }
        let dieuChuyenKhoHangDtl = [];
        let dieuChuyenKhoCcDtl = [];
        Array.isArray(this.dataViewHang) && this.dataViewHang.forEach(lv1 => {
            Array.isArray(lv1.childData) && lv1.childData.forEach(lv2 => {
                dieuChuyenKhoHangDtl.push({ ...lv2, id: undefined, hdrId: undefined })
            });
        })
        if (this.formData.value.loai === "SN_CHI_CUC") {
            Array.isArray(this.dataViewChiCuc) && this.dataViewChiCuc.forEach(lv1 => {
                Array.isArray(lv1.childData) && lv1.childData.forEach(lv2 => {
                    dieuChuyenKhoCcDtl.push({ ...lv2, id: undefined, hdrId: undefined })
                });
            })
        };
        try {
            await this.spinner.show();
            //TODO: api chưa lưu file đính kèm
            let body = this.formData.value;
            body.canCu = this.fileDinhKem;
            body.dieuChuyenKhoHangDtl = cloneDeep(dieuChuyenKhoHangDtl);
            body.dieuChuyenKhoCcDtl = cloneDeep(dieuChuyenKhoCcDtl);
            body.dieuChuyenKhoVpDtl = cloneDeep(this.dataTableVp);
            body.tenLoai = this.obLoai[body.loai]
            let data = await this.createUpdate(body, null);
            if (data) {
                this.idInput = data.id;
                this.formData.patchValue({ id: data.id, trangThai: data.trangThai });
            }
        } catch (error) {
            console.log("e", error)
        }
        finally {
            await this.spinner.hide()
        }
    }
    back() {
        this.showListEvent.emit();
    }

    // async flattenTree(tree) {
    //   return tree.flatMap((item) => {
    //     return item.childData ? this.flattenTree(item.childData) : item;
    //   });
    // }
    async expandAllHang() {
        this.dataViewHang.forEach(s => {
            this.expandSetString.add(s.idVirtual);
        });
        if (this.formData.value.id) {
            await Promise.all(this.dataViewHang.map(f => this.loadDsDiemKho(f.maDiemKhoDen)))
        }
    }
    async expandAllChiCuc() {
        this.dataViewChiCuc.forEach(s => {
            this.expandSetString.add(s.idVirtual);
        });
        if (this.formData.value.id && this.formData.value.loai === "SN_CHI_CUC") {
            await Promise.all(this.dataViewChiCuc.map(f => this.loadDsDiemKho(f.maChiCucDen)))
        }
    }
    onExpandStringChange(id: string, checked: boolean): void {
        if (checked) {
            this.expandSetString.add(id);
        } else {
            this.expandSetString.delete(id);
        }
    }
    async loadDsDiemKho(maDviCha) {
        if (this.listDs[maDviCha]?.length > 0) return;
        let body = {
            maDviCha
        };
        let res = await this.donviService.layTatCaDangTree(body);
        if (res.msg == MESSAGE.SUCCESS) {
            if (Array.isArray(res.data)) {
                res.data[0].children = res.data[0].children.filter(f => f.type !== "PB")
                this.listDs[maDviCha] = cloneDeep(res.data);
                this.listDs[maDviCha][0].expanded = true;
            } else {
                this.listDs[maDviCha] = [];
            }
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
    }
    handleChangeLoaiSapNhap(loai: string) {

    }
    handleClickTree = (value, data, loai: string) => {
        if (value?.node?.origin?.isLeaf) {
            if (loai === "SN_DIEM_KHO") {
                if (value.node.origin.maDvi.length === 16) {
                    data.maLoKhoDen = value.node.origin.maDvi;
                    data.tenLoKhoDen = value.node.origin.title;
                    data.maNganKhoDen = value.node.parentNode.origin.maDvi;
                    data.tenNganKhoDen = value.node.parentNode.origin.title;
                    data.maNhaKhoDen = value.node.parentNode.parentNode.origin.maDvi;
                    data.tenNhaKhoDen = value.node.parentNode.parentNode.origin.title;
                } else if (value.node.origin.maDvi.length === 14) {
                    data.maLoKhoDen = null;
                    data.tenLoKhoDen = null;
                    data.maNganKhoDen = value.node.origin.maDvi;
                    data.tenNganKhoDen = value.node.origin.title;
                    data.maNhaKhoDen = value.node.parentNode.origin.maDvi;
                    data.tenNhaKhoDen = value.node.parentNode.origin.title;
                };
            }
            else if (loai === 'SN_CHI_CUC') {
                if (value.node.origin.maDvi.length === 16) {
                    data.maLoKhoDen = value.node.origin.maDvi;
                    data.tenLoKhoDen = value.node.origin.title;
                    data.maNganKhoDen = value.node.parentNode.origin.maDvi;
                    data.tenNganKhoDen = value.node.parentNode.origin.title;
                    data.maNhaKhoDen = value.node.parentNode.parentNode.origin.maDvi;
                    data.tenNhaKhoDen = value.node.parentNode.parentNode.origin.title;
                    data.maDiemKhoDen = value.node.parentNode.parentNode.parentNode.origin.maDvi;
                    data.tenDiemKhoDen = value.node.parentNode.parentNode.parentNode.origin.title;
                } else if (value.node.origin.maDvi.length === 14) {
                    data.maLoKhoDen = null;
                    data.tenLoKhoDen = null;
                    data.maNganKhoDen = value.node.origin.maDvi;
                    data.tenNganKhoDen = value.node.origin.title;
                    data.maNhaKhoDen = value.node.parentNode.origin.maDvi;
                    data.tenNhaKhoDen = value.node.parentNode.origin.title;
                    data.maDiemKhoDen = value.node.parentNode.parentNode.parentNode.origin.maDvi;
                    data.tenDiemKhoDen = value.node.parentNode.parentNode.parentNode.origin.title;
                };
            }
            const thuKhoDenId = value.node.origin.idThuKho
            data.thuKhoDenId = thuKhoDenId;
            data.thayDoiThuKho = data.thuKhoId !== thuKhoDenId
        }
    };
    handleClear = (data, loai: string) => {
        data.title = null;
        data.maLoKhoDen = null;
        data.tenLoKhoDen = null;
        data.maNganKhoDen = null;
        data.tenNganKhoDen = null;
        data.maNhaKhoDen = null;
        data.tenNhaKhoDen = null;
        data.thuKhoDenId = null;
        data.thayDoiThuKho = false;
        if (loai === "SN_CHI_CUC") {
            data.maDiemKhoDen = null;
            data.tenDiemKhoDen = null;
        }
    }
    nodeClicked(node) {
        console.log("node", node)
        if (!node.origin.isLeaf) {
            node.isSelectable = false;
            node.isExpanded = !node.isExpanded;
        }
    }
    showTitle = (node: NzTreeNode) => {
        let title = "";
        const { loai } = this.formData.value;
        if (node?.origin?.maDvi?.length === 16) {
            title = loai === "SN_DIEM_KHO" ? node.origin.title + " - " + node.parentNode.origin.title + " - " + node.parentNode.parentNode.origin.title : node.origin.title + " - " + node.parentNode.origin.title + " - " + node.parentNode.parentNode.origin.title + " - " + node.parentNode.parentNode.parentNode.origin.title;
        } else if (node?.origin?.maDvi?.length === 14) {
            title = loai === "SN_DIEM_KHO" ? node.origin.title + " - " + node.parentNode.origin.title : node.origin.title + " - " + node.parentNode.origin.title + " - " + node.parentNode.parentNode.origin.title;
        };
        return title
    }
    async getDetail(id: number) {
        await this.dieuChuyenKhoService
            .getDetail(id)
            .then((res) => {
                if (res.msg == MESSAGE.SUCCESS) {
                    const dataDetail = res.data;
                    if (dataDetail) {
                        this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
                        this.dataTableHang = Array.isArray(dataDetail.dieuChuyenKhoHangDtl) ? dataDetail.dieuChuyenKhoHangDtl.map(f => ({
                            ...f, keyValue: f.maLoKhoDen ? f.maLoKhoDen : f.maNganKhoDen, groupBy: f.loai === 'SN_DIEM_KHO' ? `${f.maChiCucDi}-${f.maDiemKhoDi}-${f.maChiCucDen}-${f.maDiemKhoDen}` :
                                `${f.maChiCucDi}-${f.maChiCucDen}`
                        })) : [];
                        this.buildHang();
                        if (dataDetail.loai === "SN_CHI_CUC") {
                            this.dataTableChiCuc = Array.isArray(dataDetail.dieuChuyenKhoVpDtl) ? dataDetail.dieuChuyenKhoVpDtl.map(f => ({ ...f, keyValue: f.maLoKhoDen ? f.maLoKhoDen : f.maNganKhoDen, groupBy: `${f.maChiCucDi}-${f.maChiCucDen}` })) : []
                            this.buildChiCuc();
                            this.dataTableVp = Array.isArray(dataDetail.dieuChuyenKhoVpDtl) ? dataDetail.dieuChuyenKhoVpDtl : []
                        };
                        this.fileDinhKem = dataDetail.canCu;
                    }
                }
            })
            .catch((e) => {
                console.log('error: ', e);
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
    }
    async buildHang() {
        this.dataViewHang = chain(this.dataTableHang).groupBy("groupBy").map((s, k) => {
            const groupBy = s.find(f => f.groupBy === k);
            return {
                ...groupBy,
                idVirtual: uuidv4(),
                childData: s

            }
        }).value();
        this.expandAllHang()
    }
    async buildChiCuc() {
        this.dataViewChiCuc = chain(this.dataTableChiCuc).groupBy("groupBy").map((s, k) => {
            const groupBy = s.find(f => f.groupBy === k);
            return {
                ...groupBy,
                idVirtual: uuidv4(),
                childData: s

            }
        }).value();
        this.expandAllChiCuc()
    }
    async openDialogSoQdDC() {
        let dataQdDc = [];
        let body = {
            trangThai: "02",
            paggingReq: {
                limit: this.globals.prop.MAX_INTERGER,
                page: 0
            },
            maDvi: this.userInfo.MA_DVI
        }
        let res = await this.danhMucDuyetKhoService.search(body);
        if (res.msg == MESSAGE.SUCCESS) {
            dataQdDc = Array.isArray(res.data?.content) ? res.data.content : [];
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
        const modalQD = this.modal.create({
            nzTitle: 'DANH SÁCH QUYẾT ĐỊNH XUẤT ĐIỀU CHUYỂN HÀNG HÓA',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: dataQdDc,
                dataHeader: ['Số quyết định', 'Tên loại', 'Ngày ký quyết định'],
                dataColumn: ['soQuyetDinh', 'tenLoai', 'ngayKy'],
            },
        })
        modalQD.afterClose.subscribe(async (dataChose) => {
            if (dataChose) {
                this.formData.patchValue({
                    soQuyetDinh: dataChose.soQuyetDinh,
                    soQuyetDinhId: dataChose.soQuyetDinhId,
                    ngayKy: dataChose.ngayKy,
                    loai: dataChose.loai,
                    tenLoai: dataChose.tenLoai,
                    trichYeu: dataChose.trichYeu
                });
                let listChiCucDi = []
                Array.isArray(dataChose.duyetDanhMucKhoDtl) && dataChose.duyetDanhMucKhoDtl.forEach(f => {
                    if (!listChiCucDi.find(item => item.maChiCucDi === f.maChiCucDi)) {
                        listChiCucDi.push({ maCucDi: f.maCucDi, tenCucDi: f.tenCucDi, maCucDen: f.maCucDen, tenCucDen: f.tenCucDen, maChiCucDi: f.maChiCucDi, tenChiCucDi: f.tenChiCucDi, maChiCucDen: f.maChiCucDen, maDiemKhoDi: f.maDiemKhoDi, tenDiemKhoDi: f.tenDiemKhoDi, tenDiemKhoDen: f.tenDiemKhoDen, maDiemKhoDen: f.maDiemKhoDen })
                    }
                });
                if (listChiCucDi.length > 0) {
                    // let datas = await Promise.all(listChiCucDi.map(f => this.dieuChuyenKhoService.chiTietHang({ ...f })));
                    let datasDieuChuyen = [];

                    if (this.formData.value.loai === "SN_DIEM_KHO") {
                        await Promise.all(listChiCucDi.map(f => this.dieuChuyenKhoService.chiTietHangSapNhapDiemKho({ ...f }).then(res => {
                            if (res.msg === MESSAGE.SUCCESS) {
                                const resData = Array.isArray(res.data) ? res.data.map(item => ({ ...item, maCucDi: f.maCucDi, tenCucDi: f.tenCucDi, maCucDen: f.maCucDen, tenCucDen: f.tenCucDen, maChiCucDi: f.maChiCucDi, tenChiCucDi: f.tenChiCucDi, maDiemKhoDi: f.maDiemKhoDi, tenDiemKhoDi: f.tenDiemKhoDi })) : [];
                                datasDieuChuyen = [...datasDieuChuyen, ...resData]
                            }
                        })));
                        if (datasDieuChuyen.length > 0) {

                            this.dataTableHang = Array.isArray(datasDieuChuyen) ? datasDieuChuyen.map(f => ({
                                ...f, groupBy: `${f.maChiCucDi}-${f.maDiemKhoDi}-${f.maChiCucDen}-${f.maDiemKhoDen}`
                            })) : [];
                            this.buildHang();
                        }
                    }
                    else if (this.formData.value.loai === "SN_CHI_CUC") {
                        await Promise.all(listChiCucDi.map(f => this.dieuChuyenKhoService.chiTietHangSapNhapChiCuc({ ...f }).then(res => {
                            if (res.msg === MESSAGE.SUCCESS) {
                                const resData = Array.isArray(res.data) ? res.data.map(item => ({ ...item, maCucDi: f.maCucDi, tenCucDi: f.tenCucDi, maCucDen: f.maCucDen, tenCucDen: f.tenCucDen, maChiCucDi: f.maChiCucDi, tenChiCucDi: f.tenChiCucDi, maDiemKhoDi: f.maDiemKhoDi, tenDiemKhoDi: f.tenDiemKhoDi })) : [];
                                datasDieuChuyen = [...datasDieuChuyen, ...resData]
                            }
                        })));
                        let dataCCDC = [];
                        await Promise.all(listChiCucDi.map(f => this.dieuChuyenKhoService.chiTietCCDC({ ...f }).then(res => {
                            if (res.msg === MESSAGE.SUCCESS) {
                                const resData = Array.isArray(res.data) ? res.data.map(item => ({ ...item, maCucDi: f.maCucDi, tenCucDi: f.tenCucDi, maCucDen: f.maCucDen, tenCucDen: f.tenCucDen, maChiCucDi: f.maChiCucDi, tenChiCucDi: f.tenChiCucDi, maDiemKhoDi: f.maDiemKhoDi, tenDiemKhoDi: f.tenDiemKhoDi })) : [];
                                dataCCDC = [...dataCCDC, ...resData]
                            }
                        })));
                        if (datasDieuChuyen.length > 0) {

                            this.dataTableHang = Array.isArray(datasDieuChuyen) ? datasDieuChuyen.map(f => ({
                                ...f, groupBy: `${f.maChiCucDi}-${f.maChiCucDen}`
                            })) : [];
                            this.buildHang();
                        };
                        if (dataCCDC.length > 0) {
                            this.dataTableChiCuc = Array.isArray(dataCCDC) ? dataCCDC.map(f => ({ ...f, groupBy: `${f.maChiCucDi}-${f.maChiCucDen}` })) : []
                            this.buildChiCuc()
                        }
                    }

                }
                // await this.bindingDataQd(dataChose.id, false);
            }
        });
    };

    // async bindingDataQd(id, isFirst) {
    //     try {
    //         if (id > 0) {
    //             await this.spinner.show();
    //             let dataRes = await this.danhMucDuyetKhoService.getDetail(id)
    //             if (dataRes.msg == MESSAGE.SUCCESS) {
    //                 const data = dataRes.data;
    //                 this.formData.patchValue({
    //                     qddcId: data.id,
    //                     soQddc: data.soQdinh,
    //                     ngayKyQddc: data.ngayKyQdinh,
    //                 });

    //             }
    //             else {
    //                 this.notification.error(MESSAGE.ERROR, dataRes.msg);
    //             }
    //         }
    //     } catch (error) {
    //         console.log("error", error)
    //     } finally {
    //         await this.spinner.hide();
    //     }
    // }
    //xử lý điều chuyển văn phòng trụ sở
    themMoiItem(): void {
        if (!this.rowItem?.tenDonViDi?.trim() || !this.rowItem?.tenDonViDen?.trim()) {
            this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin ");
            return;
        }
        this.dataTableVp.push({ ...this.rowItem, edit: false });
        this.clearData();
    }
    clearData(): void {
        this.rowItem = {}
    }
    editItem(index: any): void {
        this.dataTableVp = this.dataTableVp.map((f, i) => {
            if (index === i) {
                return { ...f, edit: true }
            } else {
                if (f.edit) {
                    return { ...this.rowDataVpClone, edit: false }
                } else {
                    return { ...f }
                }
            }
        });
        this.rowDataVpClone = { ...this.dataTableVp[index], edit: false };
    }
    xoaItem(index: number): void {
        this.dataTableVp = this.dataTableVp.filter((f, idx) => idx !== index);
    }
    luuEdit(index: number): void {
        if (!this.dataTableVp[index]?.tenDonViDi?.trim() || !this.dataTableVp[index]?.tenDonViDen?.trim()) {
            this.notification.error(MESSAGE.ERROR, "Vui lòng điền đầy đủ thông tin ");
            return;
        }
        this.dataTableVp[index].edit = false;
        this.rowDataVpClone = {};
    }
    huyEdit(index: number): void {
        this.dataTableVp[index] = { ...this.rowDataVpClone };
    }
}

export class ItemXhXkVtquyetDinhPdDtl {
    id: string;
    maDiaDiemDi: string;
    maCucDi: string;
    tenCucDi: string;
    maChiCucDi: string;
    tenChiCucDi: string;
    maDiemKhoDi: string;
    tenDiemKhoDi: string;
    maDiaDiemDen: string;
    maCucDen: string;
    tenCucDen: string;
    maChiCucDen: string;
    tenChiCucDen: string;
    maDiemKhoDen: string;
    tenDiemKhoDen: string;
    ghiChu: string;
}