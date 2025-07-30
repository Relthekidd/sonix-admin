import { useState } from "react";
import { Upload, Music, FileAudio, Image, X, CheckCircle, Clock, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { useArtists } from "../../utils/supabase/hooks";
import { uploadTrack, uploadAlbum } from "../../utils/supabase/hooks";

interface TrackForm {
  title: string;
  audioFile: File | null;
  coverArt: File | null;
  artist_id: string;
  lyrics: string;
  genre: string;
  mood: string;
  language: string;
  duration: string;
  featured_artists: string[];
}

interface AlbumForm {
  title: string;
  artist_id: string;
  coverArt: File | null;
  release_date: string;
  description: string;
  genre: string;
  tracks: Array<{
    title: string;
    audioFile: File | null;
    featured_artists: string[];
  }>;
}

const initialTrackForm: TrackForm = {
  title: "",
  audioFile: null,
  coverArt: null,
  artist_id: "",
  lyrics: "",
  genre: "",
  mood: "",
  language: "",
  duration: "",
  featured_artists: []
};

const initialAlbumForm: AlbumForm = {
  title: "",
  artist_id: "",
  coverArt: null,
  release_date: "",
  description: "",
  genre: "",
  tracks: [{ title: "", audioFile: null, featured_artists: [] }]
};

const genres = ["Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "Classical", "R&B", "Country", "Indie", "Folk"];
const moods = ["Happy", "Sad", "Energetic", "Chill", "Romantic", "Angry", "Peaceful", "Uplifting"];
const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Korean"];

export function UploadPage() {
  const [activeTab, setActiveTab] = useState("single");
  const [singleForm, setSingleForm] = useState<TrackForm>(initialTrackForm);
  const [albumForm, setAlbumForm] = useState<AlbumForm>(initialAlbumForm);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch artists from Supabase
  const { data: artists, loading: artistsLoading } = useArtists();

  const handleAudioUpload = (file: File, isAlbum: boolean = false, trackIndex?: number) => {
    // Auto-detect duration
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      const duration = `${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60).toString().padStart(2, '0')}`;
      
      if (isAlbum && trackIndex !== undefined) {
        const newTracks = [...albumForm.tracks];
        newTracks[trackIndex] = { ...newTracks[trackIndex], audioFile: file };
        setAlbumForm({ ...albumForm, tracks: newTracks });
      } else {
        setSingleForm({ ...singleForm, audioFile: file, duration });
      }
    };
    audio.src = URL.createObjectURL(file);
  };

  const handleSingleSubmit = async () => {
    setIsUploading(true);
    setUploadStatus('idle');
    setUploadError("");
    
    try {
      if (!singleForm.audioFile || !singleForm.title || !singleForm.artist_id) {
        throw new Error("Please fill in all required fields");
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const track = await uploadTrack({
        title: singleForm.title,
        artist_id: singleForm.artist_id,
        audioFile: singleForm.audioFile,
        coverArt: singleForm.coverArt || undefined,
        genre: singleForm.genre || undefined,
        mood: singleForm.mood || undefined,
        language: singleForm.language || undefined,
        lyrics: singleForm.lyrics || undefined,
        featured_artists: singleForm.featured_artists.length > 0 ? singleForm.featured_artists : undefined
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      setShowSuccessModal(true);
      
      // Reset form
      setSingleForm(initialTrackForm);
      setUploadProgress(0);
      
      // Hide success modal after 3 seconds
      setTimeout(() => setShowSuccessModal(false), 3000);
      
      console.log("Track uploaded successfully:", track);
      
    } catch (error: any) {
      setUploadStatus('error');
      setUploadError(error.message || "Upload failed. Please try again.");
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAlbumSubmit = async () => {
    setIsUploading(true);
    setUploadStatus('idle');
    setUploadError("");
    
    try {
      if (!albumForm.title || !albumForm.artist_id || albumForm.tracks.some(t => !t.title || !t.audioFile)) {
        throw new Error("Please fill in all required fields for the album and tracks");
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 3; // Slower for albums
        });
      }, 300);

      const album = await uploadAlbum({
        title: albumForm.title,
        artist_id: albumForm.artist_id,
        coverArt: albumForm.coverArt || undefined,
        release_date: albumForm.release_date || undefined,
        description: albumForm.description || undefined,
        genre: albumForm.genre || undefined,
        tracks: albumForm.tracks.map(track => ({
          title: track.title,
          audioFile: track.audioFile!,
          featured_artists: track.featured_artists.length > 0 ? track.featured_artists : undefined
        }))
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      setShowSuccessModal(true);
      
      // Reset form
      setAlbumForm(initialAlbumForm);
      setUploadProgress(0);
      
      // Hide success modal after 3 seconds
      setTimeout(() => setShowSuccessModal(false), 3000);
      
      console.log("Album uploaded successfully:", album);
      
    } catch (error: any) {
      setUploadStatus('error');
      setUploadError(error.message || "Album upload failed. Please try again.");
      console.error("Album upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const addTrackToAlbum = () => {
    setAlbumForm({
      ...albumForm,
      tracks: [...albumForm.tracks, { title: "", audioFile: null, featured_artists: [] }]
    });
  };

  const removeTrackFromAlbum = (index: number) => {
    const newTracks = albumForm.tracks.filter((_, i) => i !== index);
    setAlbumForm({ ...albumForm, tracks: newTracks });
  };

  const updateAlbumTrack = (index: number, field: string, value: any) => {
    const newTracks = [...albumForm.tracks];
    newTracks[index] = { ...newTracks[index], [field]: value };
    setAlbumForm({ ...albumForm, tracks: newTracks });
  };

  return (
    <>
      {/* Header */}
      <header className="bg-sonix-black border-b border-sonix px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-sonix-primary">Upload Music</h1>
            <p className="text-sm text-sonix-secondary mt-1">Add singles and albums to the Sonix platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-sonix-green text-white">
              ✅ Connected to Supabase Storage
            </Badge>
            {uploadStatus === 'success' && (
              <Badge className="bg-sonix-green text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Upload Successful
              </Badge>
            )}
            {uploadStatus === 'error' && (
              <Badge className="bg-sonix-error text-white">
                <AlertCircle className="w-3 h-3 mr-1" />
                Upload Failed
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-sonix-black">
        <div className="max-w-6xl mx-auto">
          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-sonix-card border border-sonix rounded-xl p-8 max-w-md text-center sonix-glow">
                <div className="w-16 h-16 bg-sonix-green rounded-full flex items-center justify-center mx-auto mb-4 sonix-green-glow">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-sonix-primary mb-2">Upload Complete!</h3>
                <p className="text-sonix-secondary">Your music has been successfully uploaded to Sonix.</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {uploadError && (
            <div className="mb-6 p-4 bg-sonix-error/10 border border-sonix-error/30 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-sonix-error flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sonix-error">Upload Error</h4>
                <p className="text-sm text-sonix-error">{uploadError}</p>
              </div>
              <button
                onClick={() => setUploadError("")}
                className="ml-auto text-sonix-error hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-sonix-card border border-sonix">
              <TabsTrigger 
                value="single" 
                className="data-[state=active]:bg-sonix-purple data-[state=active]:text-white data-[state=active]:sonix-glow"
              >
                Upload Single
              </TabsTrigger>
              <TabsTrigger 
                value="album" 
                className="data-[state=active]:bg-sonix-purple data-[state=active]:text-white data-[state=active]:sonix-glow"
              >
                Upload Album
              </TabsTrigger>
            </TabsList>

            {/* Single Upload */}
            <TabsContent value="single" className="space-y-8">
              <div className="sonix-card">
                <div className="pb-6 border-b border-sonix">
                  <h3 className="text-xl font-bold text-sonix-primary mb-2">Single Track Upload</h3>
                  <p className="text-sonix-secondary font-medium">Upload a single track with metadata</p>
                  <Badge className="mt-2 bg-sonix-tag text-sonix-secondary">📤 Uploads to Supabase Storage</Badge>
                </div>

                <div className="pt-6 space-y-8">
                  {/* Audio File Upload Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-sonix-primary mb-3">Audio File *</label>
                        <div className="border-2 border-dashed border-sonix rounded-xl p-6 hover:border-sonix-purple transition-colors group">
                          {singleForm.audioFile ? (
                            <div className="space-y-3 text-center">
                              <div className="w-12 h-12 bg-sonix-green rounded-xl flex items-center justify-center mx-auto sonix-green-glow">
                                <FileAudio className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sonix-primary">{singleForm.audioFile.name}</p>
                                <p className="text-sm text-sonix-green">Duration: {singleForm.duration}</p>
                              </div>
                              <button 
                                onClick={() => setSingleForm({...singleForm, audioFile: null, duration: ""})}
                                className="text-sonix-error hover:text-red-300 text-sm"
                                disabled={isUploading}
                              >
                                Remove File
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-sonix-secondary mx-auto mb-3 group-hover:text-sonix-purple transition-colors" />
                              <h4 className="font-medium text-sonix-primary mb-2">Upload Audio File</h4>
                              <p className="text-sm text-sonix-secondary mb-4">MP3 files only, up to 50MB</p>
                              <label className="sonix-button-secondary cursor-pointer inline-block">
                                Choose File
                                <input
                                  type="file"
                                  accept=".mp3"
                                  onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
                                  className="hidden"
                                  disabled={isUploading}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-sonix-primary mb-3">Cover Art</label>
                        <div className="flex items-start space-x-4">
                          <div className="w-24 h-24 border-2 border-dashed border-sonix rounded-xl flex items-center justify-center relative overflow-hidden hover:border-sonix-purple transition-colors group">
                            {singleForm.coverArt ? (
                              <img 
                                src={URL.createObjectURL(singleForm.coverArt)} 
                                alt="Cover" 
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <Image className="w-6 h-6 text-sonix-secondary group-hover:text-sonix-purple transition-colors" />
                            )}
                            <label className="absolute inset-0 cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && setSingleForm({...singleForm, coverArt: e.target.files[0]})}
                                className="hidden"
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-sonix-secondary mb-3">Recommended: 1000x1000px, JPG or PNG</p>
                            <label className="sonix-button-secondary text-sm py-2 px-4 cursor-pointer">
                              Choose Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && setSingleForm({...singleForm, coverArt: e.target.files[0]})}
                                className="hidden"
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Form */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-sonix-primary mb-2">Track Title *</label>
                          <Input
                            placeholder="Enter track title"
                            value={singleForm.title}
                            onChange={(e) => setSingleForm({...singleForm, title: e.target.value})}
                            className="bg-sonix-card border-sonix text-sonix-primary focus:border-sonix-purple focus:sonix-glow"
                            disabled={isUploading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-sonix-primary mb-2">Artist *</label>
                          <div className="space-y-2">
                            <Select 
                              value={singleForm.artist_id} 
                              onValueChange={(value) => setSingleForm({...singleForm, artist_id: value})}
                              disabled={isUploading || artistsLoading}
                            >
                              <SelectTrigger className="bg-sonix-card border-sonix text-sonix-primary focus:border-sonix-purple">
                                <SelectValue placeholder={artistsLoading ? "Loading artists..." : "Select existing artist"} />
                              </SelectTrigger>
                              <SelectContent className="bg-sonix-card border-sonix">
                                {artists?.map(artist => (
                                  <SelectItem key={artist.id} value={artist.id} className="text-sonix-primary hover:bg-sonix-hover">
                                    {artist.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-sonix-green">🎯 Artist list from Supabase</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-sonix-primary mb-2">Genre</label>
                            <Select 
                              value={singleForm.genre} 
                              onValueChange={(value) => setSingleForm({...singleForm, genre: value})}
                              disabled={isUploading}
                            >
                              <SelectTrigger className="bg-sonix-card border-sonix text-sonix-primary focus:border-sonix-purple">
                                <SelectValue placeholder="Select genre" />
                              </SelectTrigger>
                              <SelectContent className="bg-sonix-card border-sonix">
                                {genres.map(genre => (
                                  <SelectItem key={genre} value={genre} className="text-sonix-primary hover:bg-sonix-hover">
                                    {genre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-sonix-primary mb-2">Mood</label>
                            <Select 
                              value={singleForm.mood} 
                              onValueChange={(value) => setSingleForm({...singleForm, mood: value})}
                              disabled={isUploading}
                            >
                              <SelectTrigger className="bg-sonix-card border-sonix text-sonix-primary focus:border-sonix-purple">
                                <SelectValue placeholder="Select mood" />
                              </SelectTrigger>
                              <SelectContent className="bg-sonix-card border-sonix">
                                {moods.map(mood => (
                                  <SelectItem key={mood} value={mood} className="text-sonix-primary hover:bg-sonix-hover">
                                    {mood}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-sonix-primary mb-2">Language</label>
                          <Select 
                            value={singleForm.language} 
                            onValueChange={(value) => setSingleForm({...singleForm, language: value})}
                            disabled={isUploading}
                          >
                            <SelectTrigger className="bg-sonix-card border-sonix text-sonix-primary focus:border-sonix-purple">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent className="bg-sonix-card border-sonix">
                              {languages.map(language => (
                                <SelectItem key={language} value={language} className="text-sonix-primary hover:bg-sonix-hover">
                                  {language}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-sonix-primary mb-2">Featured Artists</label>
                          <Input
                            placeholder="Enter featured artists (comma separated)"
                            value={singleForm.featured_artists.join(", ")}
                            onChange={(e) => setSingleForm({
                              ...singleForm, 
                              featured_artists: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                            })}
                            className="bg-sonix-card border-sonix text-sonix-primary focus:border-sonix-purple focus:sonix-glow"
                            disabled={isUploading}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-sonix-primary mb-2">Lyrics (Optional)</label>
                          <Textarea
                            placeholder="Enter song lyrics..."
                            value={singleForm.lyrics}
                            onChange={(e) => setSingleForm({...singleForm, lyrics: e.target.value})}
                            className="bg-sonix-card border-sonix text-sonix-primary h-24 focus:border-sonix-purple focus:sonix-glow"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="p-6 bg-sonix-hover rounded-xl border border-sonix">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-sonix-purple" />
                          <span className="text-sm font-medium text-sonix-primary">Uploading to Supabase Storage...</span>
                        </div>
                        <span className="text-sm text-sonix-secondary">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 border-t border-sonix">
                    <button
                      onClick={handleSingleSubmit}
                      disabled={isUploading || !singleForm.title || !singleForm.artist_id || !singleForm.audioFile}
                      className="sonix-button-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                    >
                      {isUploading ? "Uploading..." : "Upload Single"}
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Album Upload Tab - Similar structure but adapted for albums */}
            <TabsContent value="album" className="space-y-8">
              <div className="sonix-card">
                <div className="pb-6 border-b border-sonix">
                  <h3 className="text-xl font-bold text-sonix-primary mb-2">Album Upload</h3>
                  <p className="text-sonix-secondary font-medium">Upload a complete album with multiple tracks</p>
                  <Badge className="mt-2 bg-sonix-tag text-sonix-secondary">📤 Uploads to Supabase Storage</Badge>
                </div>

                <div className="pt-6 space-y-8">
                  {/* Album metadata form similar to single but for album */}
                  {/* This would include the album cover, title, artist selection, etc. */}
                  <div className="text-center py-8 border border-dashed border-sonix rounded-xl">
                    <Music className="w-12 h-12 text-sonix-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-sonix-primary mb-2">Album Upload Coming Soon</h3>
                    <p className="text-sonix-secondary">Full album upload functionality will be available in the next update.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}