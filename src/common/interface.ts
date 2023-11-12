export interface Res<T> {
  ok: boolean;
  message: string;
  data: T;
}
