import { useState } from "react";
import { Search, Filter, Download, Music, Clock, CheckCircle, XCircle, AlertCircle, MoreHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const uploads = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Rodriguez",
    album: "Nocturnal",
    uploadDate: "2024-01-15",
    status: "published",
    duration: "3:42",
    fileSize: "8.4 MB",
    format: "MP3",
    plays: "12.5K",
    quality: "320kbps"
  },
  {
    id: 2,
    title: "Electric Soul",
    artist: "The Midnight Echo",
    album: "Synthetic",
    uploadDate: "2024-01-14",
    status: "processing",
    duration: "4:18",
    fileSize: "12.1 MB",
    format: "FLAC",
    plays: "0",
    quality: "Lossless"
  },
  {
    id: 3,
    title: "Broken Strings",
    artist: "Maya Chen",
    album: "Raw Emotions",
    uploadDate: "2024-01-14",
    status: "failed",
    duration: "2:56",
    fileSize: "6.8 MB",
    format: "MP3",
    plays: "0",
    quality: "256kbps"
  },
  {
    id: 4,
    title: "Urban Legends",
    artist: "Alex Thompson",
    album: "Street Stories",
    uploadDate: "2024-01-13",
    status: "published",
    duration: "3:29",
    fileSize: "9.2 MB",
    format: "MP3",
    plays: "24.1K",
    quality: "320kbps"
  },
  {
    id: 5,
    title: "Velvet Nights",
    artist: "Sophia Kim",
    album: "Smooth Operator",
    uploadDate: "2024-01-12",
    status: "published",
    duration: "4:05",
    fileSize: "11.3 MB",
    format: "FLAC",
    plays: "18.7K",
    quality: "Lossless"
  },
  {
    id: 6,
    title: "Mountain Song",
    artist: "River Stone",
    album: "Nature's Call",
    uploadDate: "2024-01-11",
    status: "pending",
    duration: "5:12",
    fileSize: "14.8 MB",
    format: "WAV",
    plays: "0",
    quality: "Lossless"
  },
];

const statusOptions = ["All", "Published", "Processing", "Pending", "Failed"];

export function UploadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = 
      upload.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.album.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || upload.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "published":
        return `${baseClasses} bg-green-600 text-white`;
      case "processing":
        return `${baseClasses} bg-blue-600 text-white`;
      case "pending":
        return `${baseClasses} bg-orange-600 text-white`;
      case "failed":
        return `${baseClasses} bg-red-600 text-white`;
      default:
        return `${baseClasses} bg-gray-600 text-white`;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Uploads</h1>
            <p className="text-sm text-dark-secondary mt-1">Track and manage all uploaded content</p>
          </div>
          <button className="dark-button-secondary gap-2 flex items-center">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg">
        {/* Search and Filters */}
        <div className="mb-8 flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-secondary w-4 h-4" />
            <Input
              placeholder="Search uploads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark-card border-dark-color text-dark-primary"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-dark-card border-dark-color text-dark-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dark-card border-dark-color">
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="text-dark-primary hover:bg-dark-hover">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Uploads Table */}
        <div className="dark-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Track</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Artist</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Upload Date</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Status</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Duration</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Format</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Plays</th>
                  <th className="text-center font-semibold text-dark-primary pb-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUploads.map((upload) => (
                  <tr key={upload.id} className="border-b border-dark-color hover:bg-dark-table-hover transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-dark-tag rounded-lg flex items-center justify-center">
                          <Music className="w-4 h-4 text-dark-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-dark-primary">{upload.title}</p>
                          <p className="text-xs text-dark-secondary">{upload.album}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-dark-primary font-medium">
                      {upload.artist}
                    </td>
                    <td className="py-4 px-4 text-dark-secondary">
                      {upload.uploadDate}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(upload.status)}
                        <span className={getStatusBadge(upload.status)}>
                          {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-dark-secondary">
                      {upload.duration}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-dark-secondary">
                        <div>{upload.format}</div>
                        <div className="text-xs">{upload.quality}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-dark-primary font-medium">
                      {upload.plays}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-dark-secondary" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-dark-card border-dark-color">
                          <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                            Edit Metadata
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">
                            Download
                          </DropdownMenuItem>
                          {upload.status === "failed" && (
                            <DropdownMenuItem className="text-blue-400 hover:bg-dark-hover">
                              Retry Upload
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-400 hover:bg-dark-hover">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}