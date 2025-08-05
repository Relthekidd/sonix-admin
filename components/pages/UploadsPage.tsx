import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Download, ListMusic, Music, Clock, CheckCircle, XCircle, AlertCircle, MoreHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useTracks } from "../../utils/supabase/hooks";
import { Skeleton } from "../ui/skeleton";


const statusOptions = ["All", "Published", "Processing", "Pending", "Failed"];

export function UploadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { data: uploads, loading } = useTracks();
  const navigate = useNavigate();

  const filteredUploads = (uploads || []).filter((upload) => {
    const title = upload.title?.toLowerCase() || "";
    const artist = upload.artist?.toLowerCase() || "";
    const album = upload.album?.toLowerCase() || "";
    const status = (upload.status || "unknown").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      title.includes(search) || artist.includes(search) || album.includes(search);
    const matchesStatus =
      statusFilter === "All" || status === statusFilter.toLowerCase();
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
    <div className="glass-page fade-in space-y-8">
      <button onClick={() => navigate(-1)} className="glass-back-button mb-4">
        ← Back
      </button>
      {/* Header */}
      <header className="glass-panel">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Uploads</h1>
            <p className="text-sm text-dark-secondary mt-1">Track and manage all uploaded content</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/playlists")}
              className="dark-button-secondary gap-2 flex items-center"
            >
              <ListMusic className="w-4 h-4" />
              Manage Playlists
            </button>
            <button className="dark-button-secondary gap-2 flex items-center">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </header>

      <main className="glass-panel">
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
                {loading && (
                  <tr>
                    <td colSpan={8} className="p-4">
                      <Skeleton className="h-32 w-full" />
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredUploads.map((upload) => {
                    const status = (upload.status || "unknown").toLowerCase();
                    const formattedStatus =
                      status.charAt(0).toUpperCase() + status.slice(1);
                    return (
                      <tr
                        key={upload.id}
                        className="border-b border-dark-color hover:bg-dark-table-hover transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-dark-tag rounded-lg flex items-center justify-center">
                              <Music className="w-4 h-4 text-dark-secondary" />
                            </div>
                            <div>
                              <p className="font-medium text-dark-primary">
                                {upload.title || "Untitled"}
                              </p>
                              <p className="text-xs text-dark-secondary">
                                {upload.album || ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-dark-primary font-medium">
                          {upload.artist || ""}
                        </td>
                        <td className="py-4 px-4 text-dark-secondary">
                          {upload.uploadDate || ""}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(status)}
                            <span className={getStatusBadge(status)}>
                              {formattedStatus}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-dark-secondary">
                          {upload.duration || ""}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-dark-secondary">
                            <div>{upload.format || ""}</div>
                            <div className="text-xs">{upload.quality || ""}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-dark-primary font-medium">
                          {upload.plays ?? ""}
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
                              {status === "failed" && (
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
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
