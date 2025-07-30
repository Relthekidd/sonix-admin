import { useState } from "react";
import { Search, Plus, Music, Clock, Users, MoreHorizontal, Heart, Play } from "lucide-react";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const playlists = [
  {
    id: 1,
    name: "Today's Hits",
    description: "The biggest songs right now",
    tracks: 50,
    duration: "3h 12m",
    likes: "24.5K",
    curator: "StreamVibe Editorial",
    cover: "🔥",
    category: "Featured"
  },
  {
    id: 2,
    name: "Chill Vibes",
    description: "Relaxing tunes for any moment",
    tracks: 32,
    duration: "2h 18m",
    likes: "18.2K",
    curator: "StreamVibe Editorial",
    cover: "🌙",
    category: "Mood"
  },
  {
    id: 3,
    name: "Workout Energy",
    description: "High-energy tracks to keep you moving",
    tracks: 45,
    duration: "2h 56m",
    likes: "31.7K",
    curator: "Fitness Team",
    cover: "⚡",
    category: "Activity"
  },
  {
    id: 4,
    name: "Indie Discoveries",
    description: "Fresh indie tracks you need to hear",
    tracks: 28,
    duration: "1h 52m",
    likes: "12.8K",
    curator: "Music Discovery",
    cover: "🎸",
    category: "Genre"
  },
  {
    id: 5,
    name: "Jazz Classics",
    description: "Timeless jazz standards",
    tracks: 37,
    duration: "3h 24m",
    likes: "9.4K",
    curator: "Jazz Lovers",
    cover: "🎷",
    category: "Genre"
  },
  {
    id: 6,
    name: "Study Focus",
    description: "Instrumental tracks for concentration",
    tracks: 60,
    duration: "4h 15m",
    likes: "22.1K",
    curator: "Productivity Team",
    cover: "📚",
    category: "Activity"
  },
];

const categories = ["All", "Featured", "Mood", "Activity", "Genre"];

export function PlaylistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPlaylists = playlists.filter(playlist => {
    const matchesSearch = playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playlist.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || playlist.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
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

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
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
          {filteredPlaylists.map((playlist) => (
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
    </>
  );
}