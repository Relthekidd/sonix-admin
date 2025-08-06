"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { supabaseBrowser } from "../../utils/supabase/supabaseClient";

interface Track {
  id: string;
  title: string;
  artist?: { id: string; name: string } | null;
  cover_url?: string | null;
}

interface TrackSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (track: Track) => void;
}

export function TrackSearchDialog({ open, onOpenChange, onSelect }: TrackSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query) {
        setResults([]);
        return;
      }
      setLoading(true);
      const supabase = supabaseBrowser();
      const { data } = await supabase
        .from("tracks")
        .select("id,title,artist:artist_id(id,name),cover_url")
        .ilike("title", `%${query}%`)
        .limit(25);
      setResults(data as Track[]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Search Tracks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ScrollArea className="h-64 border rounded-md p-2">
            {loading && <p className="p-2 text-sm">Searching...</p>}
            {!loading &&
              results.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                >
                  <div>
                    <p className="font-medium">{track.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {track.artist?.name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onSelect(track);
                    }}
                  >
                    Add
                  </Button>
                </div>
              ))}
            {!loading && results.length === 0 && query && (
              <p className="p-2 text-sm text-muted-foreground">No tracks found.</p>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
