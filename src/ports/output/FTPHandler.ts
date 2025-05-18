export interface FTPHandler {
  upload: (file: Buffer, fileName: string) => Promise<void>;
  download: (fileName: string) => Promise<Buffer>;
  delete: (fileName: string) => Promise<void>;
  listFiles: () => Promise<string[]>;
}