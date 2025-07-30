import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Music, Clock, Users, MoreHorizontal, Heart, Play } from "lucide-react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { usePlaylists } from "../../utils/supabase/hooks";
import { Skeleton } from "../ui/skeleton";


const categories = ["All", "Featured", "Mood", "Activity", "Genre"];

export function PlaylistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: playlists, loading } = usePlaylists();
  const navigate = useNavigate();

  const filteredPlaylists = (playlists || []).filter(playlist => {
    const matchesSearch = playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playlist.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || playlist.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="glass-page fade-in space-y-8">
      <button onClick={() => navigate(-1)} className="glass-back-button mb-4">
        ← Back
      </button>
      {/* Header */}
      <header className="glass-panel">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Playlists</h1>
            <p className="text-sm text-dark-secondary mt-1">Manage and curate music playlists</p>
          </div>
          <button className="dark-button-primary gap-2 flex items-center">
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>
        </div>
      </header>

      <main className="glass-panel">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-secondary w-4 h-4" />
            <Input
              placeholder="Search playlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark-card border-dark-color text-dark-primary"
            />
          </div>

          {/* Category Filters */}
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-dark-cta text-white"
                    : "bg-dark-tag text-dark-primary hover:bg-dark-hover"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))
          )}
          {!loading && filteredPlaylists.map((playlist) => (
            <div key={playlist.id} className="dark-card hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="relative mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl">{playlist.cover}</span>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button className="w-12 h-12 bg-dark-cta rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </button>
                  </div>
                </div>
                
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-white" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-dark-card border-dark-color">
                      <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                        Edit Playlist
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-dark-hover">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-dark-primary text-lg mb-1">{playlist.name}</h3>
                  <p className="text-dark-secondary text-sm">{playlist.description}</p>
                </div>

                <div className="text-xs text-dark-secondary">
                  <span>Curated by {playlist.curator}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark-color">
                  <div className="flex items-center space-x-4 text-xs text-dark-secondary">
                    <div className="flex items-center space-x-1">
                      <Music className="w-3 h-3" />
                      <span>{playlist.tracks} tracks</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{playlist.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-dark-secondary">
                    <Heart className="w-3 h-3" />
                    <span>{playlist.likes}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="dark-tag text-xs">
                    {playlist.category}
                  </div>
                  <button className="dark-button-secondary text-xs py-1.5 px-3">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}