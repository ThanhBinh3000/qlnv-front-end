export interface TreeNodeInterface<T> {
  key: string;
  level?: number;
  expand?: boolean;
  child?: T[];
  parent?: T;
}

export interface VatTu extends TreeNodeInterface<VatTu> {
  id: number;
  ten: string;
  ma: string;
  ghiChu: string;
  maCha: string;
  maDviTinh: string;
  ngaySua: string;
  ngayTao: string;
  nguoiSua: string;
  nguoiTao: string;
  trangThai: string;
}
