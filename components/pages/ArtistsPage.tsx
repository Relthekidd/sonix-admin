import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MoreHorizontal,
  Star,
  Users,
  Music,
  TrendingUp,
} from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useArtists } from "../../utils/supabase/hooks";
import { Skeleton } from "../ui/skeleton";
import { AddArtistForm } from "../artists/AddArtistForm";


export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const { data: artists, loading, refetch } = useArtists();
  const navigate = useNavigate();

  const filteredArtists = (artists || []).filter(artist =>
    artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.genre?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="glass-page fade-in space-y-8 p-6 md:p-8 text-dark-primary">
      <button onClick={() => navigate(-1)} className="glass-back-button mb-4">
        ← Back
      </button>
      {/* Header */}
      <header className="glass-panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Artists</h1>
            <p className="text-sm text-dark-secondary mt-1">
              Manage artists and their content
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="dark-button-primary gap-2 flex items-center px-4 py-2">
                <Plus className="w-4 h-4" />
                Add Artist
              </button>
            </DialogTrigger>
            <DialogContent className="bg-dark-card border-dark-color">
              <DialogHeader>
                <DialogTitle className="text-dark-primary">
                  Add Artist
                </DialogTitle>
              </DialogHeader>
              <AddArtistForm
                onSuccess={() => {
                  refetch();
                  setOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="glass-panel p-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && (
            <>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </>
          )}
          {!loading &&
            filteredArtists.map((artist) => (
              <div
                key={artist.id}
                className="dark-card p-6 hover:dark-shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-dark-tag text-dark-primary font-semibold text-lg">
                        {artist.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{artist.name}</h3>
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
                      <span className="font-bold">{artist.tracks}</span>
                    </div>
                    <p className="text-xs text-dark-secondary">Tracks</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-dark-secondary mr-1" />
                      <span className="font-bold">{artist.followers}</span>
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
                      <p className="font-bold">{artist.monthlyStreams}</p>
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
    </div>
  );
}