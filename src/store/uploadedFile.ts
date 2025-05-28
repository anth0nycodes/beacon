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
  setUploadedFiles: (files: UploadedFile[]) => void;
  addUploadedFile: (file: UploadedFile) => void;
  clearUploadedFiles: () => void;
};

const useUploadedFileStore = create<UploadedFileStore>((set) => ({
  uploadedFiles: [],
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  addUploadedFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  clearUploadedFiles: () => set({ uploadedFiles: [] }),
}));

export default useUploadedFileStore;
