export interface TreeNodeInterface {
  key: string;
  title: string;
  vaitro?: string;
  chucvu?: string;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  check?: boolean;
  disabled?: boolean;
  isPerson?: boolean;
}
