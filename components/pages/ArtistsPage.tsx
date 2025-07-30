import { useState } from "react";
import { Search, Plus, MoreHorizontal, Star, Users, Music, TrendingUp } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const artists = [
  {
    id: 1,
    name: "Luna Rodriguez",
    genre: "Pop",
    tracks: 24,
    followers: "125K",
    monthlyStreams: "2.1M",
    status: "verified",
    avatar: "LR",
    growth: "+12%"
  },
  {
    id: 2,
    name: "The Midnight Echo",
    genre: "Electronic",
    tracks: 18,
    followers: "89K",
    monthlyStreams: "1.8M",
    status: "verified",
    avatar: "TME",
    growth: "+8%"
  },
  {
    id: 3,
    name: "Maya Chen",
    genre: "Indie Rock",
    tracks: 31,
    followers: "67K",
    monthlyStreams: "1.2M",
    status: "pending",
    avatar: "MC",
    growth: "+15%"
  },
  {
    id: 4,
    name: "Alex Thompson",
    genre: "Hip-Hop",
    tracks: 42,
    followers: "203K",
    monthlyStreams: "3.4M",
    status: "verified",
    avatar: "AT",
    growth: "+5%"
  },
  {
    id: 5,
    name: "Sophia Kim",
    genre: "R&B",
    tracks: 16,
    followers: "91K",
    monthlyStreams: "1.5M",
    status: "verified",
    avatar: "SK",
    growth: "+18%"
  },
  {
    id: 6,
    name: "River Stone",
    genre: "Folk",
    tracks: 28,
    followers: "45K",
    monthlyStreams: "890K",
    status: "pending",
    avatar: "RS",
    growth: "+22%"
  },
];

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === "verified") {
      return (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
          <Star className="w-3 h-3" />
          Verified
        </div>
      );
    } else {
      return (
        <div className="px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-medium">
          Pending
        </div>
      );
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Artists</h1>
            <p className="text-sm text-dark-secondary mt-1">Manage artists and their content</p>
          </div>
          <button className="dark-button-primary gap-2 flex items-center">
            <Plus className="w-4 h-4" />
            Add Artist
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-secondary w-4 h-4" />
            <Input
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark-card border-dark-color text-dark-primary"
            />
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div key={artist.id} className="dark-card hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-dark-tag text-dark-primary font-semibold text-lg">
                      {artist.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-dark-primary text-lg">{artist.name}</h3>
                    <p className="text-dark-secondary font-medium">{artist.genre}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(artist.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-dark-secondary" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-dark-card border-dark-color">
                      <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                        View Analytics
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Music className="w-4 h-4 text-dark-secondary mr-1" />
                    <span className="font-bold text-dark-primary">{artist.tracks}</span>
                  </div>
                  <p className="text-xs text-dark-secondary">Tracks</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-dark-secondary mr-1" />
                    <span className="font-bold text-dark-primary">{artist.followers}</span>
                  </div>
                  <p className="text-xs text-dark-secondary">Followers</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-dark-positive mr-1" />
                    <span className="font-bold text-dark-positive">{artist.growth}</span>
                  </div>
                  <p className="text-xs text-dark-secondary">Growth</p>
                </div>
              </div>

              <div className="pt-4 border-t border-dark-color">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-dark-secondary">Monthly Streams</p>
                    <p className="font-bold text-dark-primary">{artist.monthlyStreams}</p>
                  </div>
                  <button className="dark-button-secondary text-xs py-2 px-3">
                    View Details
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