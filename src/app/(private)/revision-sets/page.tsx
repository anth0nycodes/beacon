import React from "react";
import UploadOptions from "./components/upload-options";
import { ActiveFiles } from "./components/file-components";

const RevisionSetsPage = () => {
  return (
    <main className="py-8 px-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4 items-center text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Ready to Revise? Prepare your{" "}
          <span className="text-emerald-500">notes</span> below
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-500">
          Supercharge your study sessions. Upload your files or content below
          and watch it transform into interactive study materials.
        </p>
      </div>
      <UploadOptions />
      <ActiveFiles />
    </main>
  );
};
export default RevisionSetsPage;
