export interface HeadCell<T, K extends keyof T> {
  id: K;
  label: string;
  disabled?: boolean;
  colSpan?: number;
}
