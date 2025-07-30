import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle, XCircle, Clock, ExternalLink, Star } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Textarea } from "../ui/textarea";

const pendingArtists = [
  {
    id: 1,
    name: "Jordan Blake",
    email: "jordan.blake@email.com",
    submissionDate: "2024-01-14",
    genre: "Alternative Rock",
    socialMedia: {
      spotify: "https://spotify.com/jordanblake",
      instagram: "@jordanblakemusic",
      youtube: "JordanBlakeOfficial"
    },
    documents: ["ID Verification", "Music Samples", "Social Media Proof"],
    bio: "Independent artist with 5 years experience in alternative rock music. Featured in local radio stations.",
    avatar: "JB",
    tracks: 8,
    monthlyListeners: "2.1K"
  },
  {
    id: 2,
    name: "Aria Santos",
    email: "aria.santos@email.com",
    submissionDate: "2024-01-13",
    genre: "Latin Pop",
    socialMedia: {
      spotify: "https://spotify.com/ariasantos",
      instagram: "@ariasantosmusic",
      youtube: "AriaSantosOfficial"
    },
    documents: ["ID Verification", "Music Samples", "Record Label Contract"],
    bio: "Rising Latin pop artist with over 50K monthly listeners on Spotify. Signed with independent label.",
    avatar: "AS",
    tracks: 12,
    monthlyListeners: "52.3K"
  },
  {
    id: 3,
    name: "The Nova Collective",
    email: "contact@novacollective.com",
    submissionDate: "2024-01-12",
    genre: "Electronic",
    socialMedia: {
      spotify: "https://spotify.com/novacollective",
      instagram: "@novacollectiveband",
      youtube: "NovaCollectiveMusic"
    },
    documents: ["Band Registration", "Music Samples", "Press Kit"],
    bio: "Electronic music duo from Portland. Featured in multiple music festivals and electronic music blogs.",
    avatar: "NC",
    tracks: 15,
    monthlyListeners: "18.7K"
  },
];

export function VerifyArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const navigate = useNavigate();

  const filteredArtists = pendingArtists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (artistId: number) => {
    console.log(`Approving artist ${artistId}`);
    // Handle approval logic
  };

  const handleReject = (artistId: number) => {
    console.log(`Rejecting artist ${artistId} with notes: ${reviewNotes}`);
    // Handle rejection logic
  };

  return (
    <div className="glass-page fade-in space-y-8">
      <button onClick={() => navigate(-1)} className="glass-back-button mb-4">
        ← Back
      </button>
      {/* Header */}
      <header className="glass-panel">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Verify Artists</h1>
            <p className="text-sm text-dark-secondary mt-1">Review and approve artist verification requests</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="dark-tag">
              {pendingArtists.length} Pending
            </div>
          </div>
        </div>
      </header>

      <main className="glass-panel">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artists List */}
          <div className="lg:col-span-1">
            <div className="dark-card">
              <div className="pb-6">
                <h3 className="text-xl font-bold text-dark-primary mb-4">Pending Requests</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-secondary w-4 h-4" />
                  <Input
                    placeholder="Search artists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-dark-bg border-dark-color text-dark-primary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredArtists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => setSelectedArtist(artist)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedArtist?.id === artist.id
                        ? "border-dark-cta bg-dark-hover"
                        : "border-dark-color hover:border-dark-cta hover:bg-dark-hover"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-dark-tag text-dark-primary font-semibold">
                          {artist.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-dark-primary">{artist.name}</h4>
                        <p className="text-xs text-dark-secondary">{artist.genre}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-dark-secondary" />
                          <span className="text-xs text-dark-secondary">{artist.submissionDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Artist Details */}
          <div className="lg:col-span-2">
            {selectedArtist ? (
              <div className="space-y-6">
                {/* Artist Info */}
                <div className="dark-card">
                  <div className="flex items-start justify-between pb-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarFallback className="bg-dark-tag text-dark-primary font-semibold text-2xl">
                          {selectedArtist.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold text-dark-primary mb-1">{selectedArtist.name}</h2>
                        <p className="text-dark-secondary font-medium">{selectedArtist.genre}</p>
                        <p className="text-sm text-dark-secondary">{selectedArtist.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-dark-secondary">Submitted</div>
                      <div className="font-semibold text-dark-primary">{selectedArtist.submissionDate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-dark-hover rounded-xl">
                      <div className="font-bold text-dark-primary text-lg">{selectedArtist.tracks}</div>
                      <div className="text-xs text-dark-secondary">Tracks</div>
                    </div>
                    <div className="text-center p-4 bg-dark-hover rounded-xl">
                      <div className="font-bold text-dark-primary text-lg">{selectedArtist.monthlyListeners}</div>
                      <div className="text-xs text-dark-secondary">Monthly Listeners</div>
                    </div>
                    <div className="text-center p-4 bg-dark-hover rounded-xl">
                      <div className="font-bold text-dark-primary text-lg">{selectedArtist.documents.length}</div>
                      <div className="text-xs text-dark-secondary">Documents</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-dark-primary mb-2">Bio</h4>
                    <p className="text-dark-secondary">{selectedArtist.bio}</p>
                  </div>
                </div>

                {/* Social Media & Links */}
                <div className="dark-card">
                  <h3 className="text-xl font-bold text-dark-primary mb-4">Social Media Verification</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-dark-hover rounded-xl">
                      <div>
                        <div className="font-medium text-dark-primary">Spotify</div>
                        <div className="text-sm text-dark-secondary">{selectedArtist.socialMedia.spotify}</div>
                      </div>
                      <button className="text-dark-cta hover:text-blue-400">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-hover rounded-xl">
                      <div>
                        <div className="font-medium text-dark-primary">Instagram</div>
                        <div className="text-sm text-dark-secondary">{selectedArtist.socialMedia.instagram}</div>
                      </div>
                      <button className="text-dark-cta hover:text-blue-400">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-hover rounded-xl">
                      <div>
                        <div className="font-medium text-dark-primary">YouTube</div>
                        <div className="text-sm text-dark-secondary">{selectedArtist.socialMedia.youtube}</div>
                      </div>
                      <button className="text-dark-cta hover:text-blue-400">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="dark-card">
                  <h3 className="text-xl font-bold text-dark-primary mb-4">Submitted Documents</h3>
                  <div className="space-y-2">
                    {selectedArtist.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-dark-hover rounded-xl">
                        <span className="text-dark-primary font-medium">{doc}</span>
                        <button className="text-dark-cta hover:text-blue-400 text-sm">
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Section */}
                <div className="dark-card">
                  <h3 className="text-xl font-bold text-dark-primary mb-4">Review Notes</h3>
                  <Textarea
                    placeholder="Add notes about this verification request..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="bg-dark-bg border-dark-color text-dark-primary mb-4"
                    rows={4}
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleApprove(selectedArtist.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Verify
                    </button>
                    <button
                      onClick={() => handleReject(selectedArtist.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Request
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dark-card h-96 flex items-center justify-center">
                <div className="text-center">
                  <Star className="w-12 h-12 text-dark-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-primary mb-2">Select an Artist</h3>
                  <p className="text-dark-secondary">Choose an artist from the list to review their verification request</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}