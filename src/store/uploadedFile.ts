import { UploadedFile } from "@/types/file";
import { create } from "zustand";

type UploadedFileStore = {
  uploadedFiles: UploadedFile[];
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileKey: string) => void;
  isAtFileLimit: () => boolean;
  clearUploadedFiles: () => void;
};

export const useUploadedFileStore = create<UploadedFileStore>((set, get) => ({
  uploadedFiles: [],
  addUploadedFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  removeUploadedFile: (key) =>
    set((state: UploadedFileStore) => ({
      uploadedFiles: state.uploadedFiles.filter((file) => file.key !== key),
    })),
  isAtFileLimit: () => get().uploadedFiles.length >= MAX_FILES,
  clearUploadedFiles: () => set({ uploadedFiles: [] }),
}));

export const MAX_FILES = 3;
