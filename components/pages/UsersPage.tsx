import { useState } from "react";
import { Search, Download, MoreHorizontal, CheckCircle, User as UserIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useUsers } from "../../utils/supabase/hooks";
import { Skeleton } from "../ui/skeleton";



const statusOptions = ["All", "Admin", "User"];

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { data: users, loading } = useUsers();

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Admin" ? user.role === "admin" : user.role !== "admin");
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (role: string) => {
    return role === "admin" ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <UserIcon className="w-4 h-4 text-blue-400" />
    );
  };

  const getStatusBadge = (role: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    return role === "admin"
      ? `${base} bg-green-600 text-white`
      : `${base} bg-blue-600 text-white`;
  };

  return (
    <div className="container fade-in space-y-8">
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-color px-8 py-6 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Users</h1>
            <p className="text-sm text-dark-secondary mt-1">Manage platform users and roles</p>
          </div>
          <button className="dark-button-secondary gap-2 flex items-center">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 bg-dark-bg rounded-xl shadow">
        {/* Search and Filters */}
        <div className="mb-8 flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-secondary w-4 h-4" />
            <Input
              placeholder="Search users..."
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

        {/* Users Table */}
        <div className="dark-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Name</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Email</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Role</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Joined</th>
                  <th className="text-center font-semibold text-dark-primary pb-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="p-4">
                      <Skeleton className="h-24 w-full" />
                    </td>
                  </tr>
                )}
                {!loading && filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-dark-color hover:bg-dark-table-hover transition-colors">
                    <td className="py-4 px-4 font-medium text-dark-primary">{user.user_metadata?.name || 'N/A'}</td>
                    <td className="py-4 px-4 text-dark-secondary">{user.email}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.role)}
                        <span className={getStatusBadge(user.role)}>{user.role || 'user'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-dark-secondary">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-dark-secondary" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-dark-card border-dark-color">
                          <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">View</DropdownMenuItem>
                          <DropdownMenuItem className="text-dark-primary hover:bg-dark-hover">Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-dark-hover">Delete</DropdownMenuItem>
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
    </div>
  );
}