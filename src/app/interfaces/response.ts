export interface OldResponseData {
  success: boolean;
  status?: number;
  error?: string;
  data?: any;
  message?: string;
  msg?: string;
  totalRecord?: number;
  statusCode?: number;
  included?: any;
}
export type ResponseData<T> = {
  included?: boolean;
  statusCode?: number;
  error?: string;
  data?: T;
  msg?: string;
  totalRecord?: number;
};
