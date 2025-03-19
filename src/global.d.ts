declare module "bun" {
  interface Env {
    username: string;
    password: string;
    sid: string;
    cacheLife: number | undefined;
  }
}
