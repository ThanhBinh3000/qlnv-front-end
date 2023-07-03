export interface TreeNodeInterface<T> {
    key: string;
    level?: number;
    expand?: boolean;
    child?: T[];
    parent?: T;
  }
  
  export interface TaiSan extends TreeNodeInterface<TaiSan> {
    id: number;
    tenTaiSan: string;
    maTaiSan: string;
    ghiChu: string;
    maCha: string;
    maDviTinh: string;
    ngaySua: string;
    ngayTao: string;
    nguoiSua: string;
    nguoiTao: string;
    trangThai: string;
  }
  