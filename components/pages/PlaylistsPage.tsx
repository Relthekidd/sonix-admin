import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase/supabaseClient";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrackSearchDialog } from "../common/TrackSearchDialog";
import { upsertPlaylistAction } from "../../app/actions/upload";

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
  created_at: string;
  isFeatured: boolean;
  sort_order: number;
}

interface TrackItem {
  id: string;
  title: string;
  artist?: { id: string; name: string } | null;
}

function SortablePlaylistItem({ playlist }: { playlist: Playlist }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: playlist.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-2 border rounded bg-white mb-2"
    >
      <span>{playlist.title}</span>
    </div>
  );
}

function SortableTrackItem({
  track,
  onRemove,
}: {
  track: TrackItem;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: track.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-2 border rounded bg-white mb-2"
    >
      <div>
        <p className="font-medium">{track.title}</p>
        <p className="text-sm text-gray-500">{track.artist?.name}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(track.id)}
      >
        Remove
      </Button>
    </div>
  );
}

export function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState("");
  const [moods, setMoods] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [trackDialogOpen, setTrackDialogOpen] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<TrackItem[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("playlists")
      .select(
        "id, title, description, cover_url, created_at, featured_playlists(is_active, sort_order)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const mapped: Playlist[] = (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      cover_url: p.cover_url,
      created_at: p.created_at,
      isFeatured: p.featured_playlists?.[0]?.is_active || false,
      sort_order: p.featured_playlists?.[0]?.sort_order ?? 0,
    }));

    setPlaylists(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleAddTrack = (track: TrackItem) => {
    if (!selectedTracks.find((t) => t.id === track.id)) {
      setSelectedTracks([...selectedTracks, track]);
    }
    setTrackDialogOpen(false);
  };
  const handleTrackDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = selectedTracks.findIndex((t) => t.id === active.id);
    const newIndex = selectedTracks.findIndex((t) => t.id === over.id);
    setSelectedTracks(arrayMove(selectedTracks, oldIndex, newIndex));
  };

  const handleRemoveTrack = (id: string) => {
    setSelectedTracks(selectedTracks.filter((t) => t.id !== id));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const payload = {
      name,
      description,
      cover: coverFile,
      genres: genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      moods: moods
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      isPublic,
      sortOrder,
      tracks: selectedTracks.map((t, idx) => ({
        track_id: t.id,
        position: idx,
      })),
    };
    const { success, message } = await upsertPlaylistAction(payload);
    if (!success) {
      setError(message || "Failed to save playlist");
    } else {
      setName("");
      setDescription("");
      setGenres("");
      setMoods("");
      setIsPublic(true);
      setSortOrder(0);
      setCoverFile(null);
      setSelectedTracks([]);
      await fetchPlaylists();
    }
    setCreating(false);
  };

  const handleToggleFeatured = async (playlist: Playlist, value: boolean) => {
    setError(null);
    if (value) {
      const maxOrder =
        Math.max(0, ...playlists.filter((p) => p.isFeatured).map((p) => p.sort_order)) +
        1;
      await supabase
        .from("featured_playlists")
        .upsert({ playlist_id: playlist.id, is_active: true, sort_order: maxOrder });
    } else {
      await supabase
        .from("featured_playlists")
        .update({ is_active: false })
        .eq("playlist_id", playlist.id);
    }
    await fetchPlaylists();
  };

  const featured = playlists
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.sort_order - b.sort_order);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = featured.findIndex((p) => p.id === active.id);
    const newIndex = featured.findIndex((p) => p.id === over.id);
    const newOrder = arrayMove(featured, oldIndex, newIndex);
    await Promise.all(
      newOrder.map((p, index) =>
        supabase
          .from("featured_playlists")
          .update({ sort_order: index })
          .eq("playlist_id", p.id)
      )
    );
    await fetchPlaylists();
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Playlists</h1>
        <form onSubmit={handleCreate} className="space-y-4 max-w-md">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Genres (comma separated)"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
          />
          <Input
            placeholder="Moods (comma separated)"
            value={moods}
            onChange={(e) => setMoods(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            <span className="text-sm">Is Public</span>
          </div>
          <Input
            type="number"
            placeholder="Sort Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
          <Input
            type="file"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setTrackDialogOpen(true)}
          >
            Add Tracks
          </Button>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleTrackDragEnd}
          >
            <SortableContext
              items={selectedTracks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {selectedTracks.map((t) => (
                <SortableTrackItem
                  key={t.id}
                  track={t}
                  onRemove={handleRemoveTrack}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button type="submit" disabled={creating}>
            {creating ? "Saving..." : "Save Playlist"}
          </Button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Featured Playlists</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={featured.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {featured.map((p) => (
              <SortablePlaylistItem key={p.id} playlist={p} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">All Playlists</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">
            {playlists.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 border rounded bg-white"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-gray-500">{p.description}</p>
                </div>
                <Switch
                  checked={p.isFeatured}
                  onCheckedChange={(val) => handleToggleFeatured(p, val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <TrackSearchDialog
        open={trackDialogOpen}
        onOpenChange={setTrackDialogOpen}
        onSelect={handleAddTrack}
      />
    </div>
  );
}
