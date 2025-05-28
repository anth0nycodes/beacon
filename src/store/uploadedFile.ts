import { create } from "zustand";

export type UploadedFile = {
  appUrl: string;
  customId?: string | null;
  fileHash: string;
  key: string;
  lastModified?: number;
  name: string;
  serverData: {
    fileUrl: string;
  };
  size: number;
  type: string;
  ufsUrl: string;
  url: string;
};

type UploadedFileStore = {
  uploadedFiles: UploadedFile[];
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileKey: string) => void;
};

export const useUploadedFileStore = create<UploadedFileStore>((set) => ({
  uploadedFiles: [],
  addUploadedFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  removeUploadedFile: (key) =>
    set((state: UploadedFileStore) => ({
      uploadedFiles: state.uploadedFiles.filter((file) => file.key !== key),
    })),
}));
