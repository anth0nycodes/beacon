import { createClient } from "@/utils/supabase/server";
import React from "react";

const DocumentsViewer = async ({ id }: { id: string }) => {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from("documents")
    .select()
    .eq("revision_set_id", id);

  if (error) {
    console.error("Error fetching documents:", error);
    return <div>Error fetching documents</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">
        Documents inside this revision set:
      </h2>
      {documents?.map((document) => (
        <div key={document.id}>
          <h3 className="text-lg font-bold">{document.original_filename}</h3>
          <iframe
            src={`https://docs.google.com/gview?url=${document.ufs_url}&embedded=true`}
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};

export default DocumentsViewer;
