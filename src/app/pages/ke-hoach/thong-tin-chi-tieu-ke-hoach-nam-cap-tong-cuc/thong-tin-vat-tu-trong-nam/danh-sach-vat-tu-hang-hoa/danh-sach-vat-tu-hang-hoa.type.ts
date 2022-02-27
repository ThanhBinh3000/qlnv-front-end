export interface TreeNodeInterface<T> {
  key: string;
  level?: number;
  expand?: boolean;
  children?: T[];
  parent?: T;
}

export interface VatTu extends TreeNodeInterface<VatTu> {
  tenVatTu: string;
  maVatTu: string;
}
