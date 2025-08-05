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

interface Playlist {
  id: string;
  title: string;
  description: string;
  cover_url: string | null;
  created_at: string;
  isFeatured: boolean;
  sort_order: number;
}

function SortableItem({ playlist }: { playlist: Playlist }) {
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

export function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const { data, error } = await supabase
      .from("playlists")
      .insert({ title, description })
      .select()
      .single();
    if (error) {
      setError(error.message);
      setCreating(false);
      return;
    }
    const playlistId = data.id;
    if (coverFile) {
      const ext = coverFile.name.split(".").pop();
      const path = `images/covers/${playlistId}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, coverFile);
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(path);
        await supabase
          .from("playlists")
          .update({ cover_url: urlData.publicUrl })
          .eq("id", playlistId);
      } else {
        setError(uploadError.message);
      }
    }
    setTitle("");
    setDescription("");
    setCoverFile(null);
    await fetchPlaylists();
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
        <form onSubmit={handleCreate} className="space-y-2 max-w-md">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="file"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
          <Button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Playlist"}
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
              <SortableItem key={p.id} playlist={p} />
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
    </div>
  );
}
