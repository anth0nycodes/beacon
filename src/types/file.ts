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