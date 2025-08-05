import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { supabaseBrowser } from "../../utils/supabase/supabaseClient";

interface AddArtistFormProps {
  onSuccess?: () => void;
}

export function AddArtistForm({ onSuccess }: AddArtistFormProps) {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const id = crypto.randomUUID();
    const { error } = await supabaseBrowser()
      .from("artists")
      .insert({ id, name, genre });
    setLoading(false);
    if (!error) {
      setName("");
      setGenre("");
      onSuccess?.();
    } else {
      console.error("Error adding artist", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <div className="space-y-1">
        <Label htmlFor="artist-name" className="text-dark-primary">
          Name
        </Label>
        <Input
          id="artist-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-dark-card border-dark-color text-dark-primary"
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="artist-genre" className="text-dark-primary">
          Genre
        </Label>
        <Input
          id="artist-genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-dark-card border-dark-color text-dark-primary"
        />
      </div>
      <Button type="submit" className="dark-button-primary w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Artist"}
      </Button>
    </form>
  );
}
