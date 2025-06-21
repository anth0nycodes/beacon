"use client";

import {
  TypographyBody,
  TypographyCaption,
  TypographyH4,
} from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Ellipsis,
  File as FileIcon,
  FileQuestion,
  ListFilter,
  Search,
  Trash2,
  FilePenLine,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFileIconStyling } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import {
  deleteRevisionSet,
  updateRevisionSet,
} from "@/actions/revision-set.actions";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const FileTypeIcon = ({ type }: { type: string }) => {
  const { IconType, color, bg } = getFileIconStyling(type);
  return (
    <div className={cn("p-3 rounded-lg border shadow-sm", bg)}>
      <IconType className={cn("size-8", color)} />
    </div>
  );
};

const RevisionSetIcons = ({
  documents,
}: {
  documents: { file_type: string }[];
}) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <FileQuestion className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  const uniqueTypes = [...new Set(documents.map((d) => d.file_type))].slice(
    0,
    // TODO: when doing tier based pricing, we will need to show more icons
    3
  );

  return (
    <div className="flex items-center justify-center -space-x-4">
      {uniqueTypes.map((type) => (
        <FileTypeIcon key={type} type={type} />
      ))}
    </div>
  );
};

export const AllRevisionSetsClient = ({ userId }: { userId: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("created_at-desc");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<
    Database["public"]["Tables"]["revision_sets"]["Row"] | null
  >(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const queryClient = useQueryClient();

  const { mutate: updateMutate } = useMutation({
    mutationFn: updateRevisionSet,
    onSuccess: (result) => {
      if (result.error) {
        toast.error("Failed to update revision set.");
      } else {
        toast.success("Revision set updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["revision-sets"] });
        setIsRenameDialogOpen(false);
      }
    },
    onError: () => toast.error("An unexpected error occurred."),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteRevisionSet,
    onSuccess: (result) => {
      if (result.error) {
        toast.error("Failed to delete revision set.");
      } else {
        toast.success("Revision set deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["revision-sets"] });
        setIsDeleteDialogOpen(false);
      }
    },
    onError: () => toast.error("An unexpected error occurred."),
  });

  const handleRenameClick = (
    set: Database["public"]["Tables"]["revision_sets"]["Row"]
  ) => {
    setSelectedSet(set);
    setNewTitle(set.title);
    setNewDescription(set.description || "");
    setIsRenameDialogOpen(true);
  };

  const handleInitialDeleteClick = (
    set: Database["public"]["Tables"]["revision_sets"]["Row"]
  ) => {
    setSelectedSet(set);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedSet || !newTitle) return;
    updateMutate({
      id: selectedSet.id,
      title: newTitle,
      description: newDescription,
    });
  };

  const handleDeleteClick = () => {
    if (!selectedSet) return;
    deleteMutate(selectedSet.id);
  };

  const sortOptions = [
    { label: "Date: Newest", value: "created_at-desc" },
    { label: "Date: Oldest", value: "created_at-asc" },
    { label: "Title: A-Z", value: "title-asc" },
    { label: "Title: Z-A", value: "title-desc" },
  ];

  // TODO: find a way to fetch 8 at a time then load the rest in with useInfiniteQuery and a loading spinner
  const {
    data: revisionSets,
    error,
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      "revision-sets",
      debouncedSearchQuery,
      sortOption,
      fileTypeFilter,
    ],
    queryFn: async () => {
      const supabase = createClient();
      const [sortBy, sortOrder] = sortOption.split("-");

      let query = supabase
        .from("revision_sets")
        .select("*, documents!inner(file_type)")
        .eq("user_id", userId)
        .order(sortBy, { ascending: sortOrder === "asc" });

      if (debouncedSearchQuery) {
        query = query.ilike("title", `%${debouncedSearchQuery}%`);
      }

      if (fileTypeFilter !== "all") {
        query = query.eq("documents.file_type", fileTypeFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const uniqueFileTypes = useMemo(() => {
    const types = new Set<string>();
    revisionSets?.forEach((set) => {
      set.documents.forEach((doc: { file_type: string }) => {
        types.add(doc.file_type);
      });
    });
    return ["all", ...Array.from(types)];
  }, [revisionSets]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <TypographyH4 weight="bold">My Revision Sets</TypographyH4>
          <Button asChild>
            <Link href="/revision-sets">Create New Set</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-9 w-full sm:w-[89%]" />
            <Skeleton className="h-9 w-full sm:w-32" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  if (!revisionSets || revisionSets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <FileIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <TypographyH4 className="mb-2">No revision sets found</TypographyH4>
            <TypographyBody className="text-muted-foreground mb-4">
              Update your search or filter settings, or create a new revision
              set.
            </TypographyBody>
            <Button asChild>
              <Link href="/revision-sets">Create New Set</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <TypographyH4 weight="bold">My Revision Sets</TypographyH4>
        <Button asChild>
          <Link href="/revision-sets">Create New Set</Link>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {!revisionSets || revisionSets.length === 0 ? null : (
          <>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-2 w-full sm:w-auto"
                >
                  <ListFilter className="h-4 w-4" />
                  Sort & Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="cursor-pointer"
                    onSelect={() => setSortOption(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {uniqueFileTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    className="cursor-pointer"
                    onSelect={() => setFileTypeFilter(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {revisionSets.map((set) => (
          <Card
            key={set.id}
            className="group relative flex h-full flex-col p-4 transition-all hover:shadow-lg"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Ellipsis className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-fit p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => handleRenameClick(set)}
                >
                  <FilePenLine className="size-4" />
                  Rename
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={() => handleInitialDeleteClick(set)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
            <Link
              href={`/revision-sets/${set.id}`}
              className="flex h-full flex-col"
            >
              <div className="flex-grow flex items-center justify-center mb-4 h-32">
                <RevisionSetIcons documents={set.documents} />
              </div>
              <div className="text-left">
                <TypographyBody weight="semibold" className="truncate">
                  {set.title}
                </TypographyBody>
                <TypographyCaption className="text-muted-foreground">
                  {new Date(set.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  , {new Date(set.created_at).getFullYear()}
                  {" • "}
                  {set.documents.length} material
                  {set.documents.length > 1 ? "s" : ""}
                </TypographyCaption>
              </div>
            </Link>
          </Card>
        ))}
      </div>
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="gap-2">
            <DialogTitle>Edit Revision Set</DialogTitle>
            <DialogDescription>
              Make changes to your revision set here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="col-span-3"
            />

            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="col-span-3 resize-none"
              rows={3}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="gap-2">
            <DialogTitle>Delete Revision Set</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this revision set? This action is
              irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
