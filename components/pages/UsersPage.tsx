import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Checkbox } from '../ui/checkbox'
import { Switch } from '../ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import { useUsers } from '../../utils/supabase/hooks'
import {
  updateProfile,
  createProfile,
  deleteProfile,
  promoteUserToAdmin,
  demoteAdminToListener
} from '../../utils/supabase/userManagement'
import type { Profile } from '../../utils/supabase/supabaseClient'
import { Skeleton } from '../ui/skeleton'

export function UsersPage() {
  const navigate = useNavigate()
  const { data: users, loading, refetch } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    return (users || []).filter(u =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const allSelected = useMemo(() => {
    return filteredUsers.length > 0 && selectedIds.length === filteredUsers.length
  }, [filteredUsers, selectedIds])

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(filteredUsers.map(u => u.id))
  }

  const handleDeleteSelected = async () => {
    for (const id of selectedIds) {
      await deleteProfile(id)
    }
    setSelectedIds([])
    refetch()
  }

  const exportCsv = () => {
    const headers = ['id', 'username', 'email', 'role', 'created_at', 'is_private']
    const rows = filteredUsers.map(u =>
      [u.id, u.username, u.email, u.role, u.created_at, u.is_private].join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const openNewUser = () => {
    setEditingUser({
      id: '',
      username: '',
      email: '',
      role: 'user',
      created_at: '',
      is_private: false
    } as Profile)
    setDialogOpen(true)
  }

  const openEditUser = (user: Profile) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingUser) return
    const { id, ...updates } = editingUser
    if (id) await updateProfile(id, updates)
    else await createProfile(updates)
    setDialogOpen(false)
    setEditingUser(null)
    refetch()
  }

  const handlePromote = async () => {
    if (!editingUser) return
    await promoteUserToAdmin(editingUser.id)
    setDialogOpen(false)
    refetch()
  }

  const handleDemote = async () => {
    if (!editingUser) return
    await demoteAdminToListener(editingUser.id)
    setDialogOpen(false)
    refetch()
  }

  const handleDelete = async () => {
    if (!editingUser) return
    await deleteProfile(editingUser.id)
    setDialogOpen(false)
    refetch()
  }

  return (
    <div className="glass-page fade-in space-y-8">
      <button onClick={() => navigate(-1)} className="glass-back-button mb-4">
        ← Back
      </button>
      <header className="glass-panel">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark-primary">Users</h1>
            <p className="text-sm text-dark-secondary mt-1">Manage platform users and roles</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportCsv} className="dark-button-secondary gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button onClick={openNewUser} className="dark-button-secondary gap-2">
              <Plus className="w-4 h-4" /> New User
            </Button>
          </div>
        </div>
      </header>

      <main className="glass-panel">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-secondary w-4 h-4" />
            <Input
              placeholder="Search by username or email"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-dark-card border-dark-color text-dark-primary"
            />
          </div>
          <Button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="dark-button-secondary gap-2 ml-4"
          >
            <Trash2 className="w-4 h-4" /> Delete Selected
          </Button>
        </div>

        <div className="dark-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-color">
                  <th className="pb-4 px-4 text-left">
                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                  </th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">ID</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Username</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Email</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Role</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Created</th>
                  <th className="text-left font-semibold text-dark-primary pb-4 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="p-4">
                      <Skeleton className="h-24 w-full" />
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredUsers.map(user => (
                    <tr
                      key={user.id}
                      className="border-b border-dark-color hover:bg-dark-table-hover transition-colors cursor-pointer"
                      onClick={() => openEditUser(user)}
                    >
                      <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.includes(user.id)}
                          onCheckedChange={() => toggleSelect(user.id)}
                        />
                      </td>
                      <td className="py-4 px-4 text-dark-secondary">{user.id}</td>
                      <td className="py-4 px-4 font-medium text-dark-primary">{user.username}</td>
                      <td className="py-4 px-4 text-dark-secondary">{user.email}</td>
                      <td className="py-4 px-4 text-dark-secondary flex items-center gap-1">
                        {user.role}
                      </td>
                      <td className="py-4 px-4 text-dark-secondary">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                      </td>
                      <td className="py-4 px-4 text-dark-secondary">
                        {user.is_private ? 'private' : 'public'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-dark-card border-dark-color text-dark-primary">
          <DialogHeader>
            <DialogTitle>{editingUser?.id ? 'Edit User' : 'New User'}</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Username"
                value={editingUser.username || ''}
                onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
                className="bg-dark-card border-dark-color text-dark-primary"
              />
              <Input
                placeholder="Email"
                value={editingUser.email || ''}
                onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                className="bg-dark-card border-dark-color text-dark-primary"
              />
              <Input
                placeholder="Display Name"
                value={editingUser.display_name || ''}
                onChange={e => setEditingUser({ ...editingUser, display_name: e.target.value })}
                className="bg-dark-card border-dark-color text-dark-primary"
              />
              <Textarea
                placeholder="Bio"
                value={editingUser.bio || ''}
                onChange={e => setEditingUser({ ...editingUser, bio: e.target.value })}
                className="bg-dark-card border-dark-color text-dark-primary"
              />
              <Input
                placeholder="Avatar URL"
                value={editingUser.avatar_url || ''}
                onChange={e => setEditingUser({ ...editingUser, avatar_url: e.target.value })}
                className="bg-dark-card border-dark-color text-dark-primary"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">Private Profile</span>
                <Switch
                  checked={editingUser.is_private}
                  onCheckedChange={v => setEditingUser({ ...editingUser, is_private: v })}
                />
              </div>
              <Select
                value={editingUser.role}
                onValueChange={v => setEditingUser({ ...editingUser, role: v })}
              >
                <SelectTrigger className="bg-dark-card border-dark-color text-dark-primary">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-dark-color">
                  <SelectItem value="admin" className="text-dark-primary">
                    Admin
                  </SelectItem>
                  <SelectItem value="user" className="text-dark-primary">
                    User
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-between text-sm text-dark-secondary">
                <span>Followers: {editingUser.follower_count ?? 0}</span>
                <span>Following: {editingUser.following_count ?? 0}</span>
              </div>
              <div className="flex gap-2 pt-2">
                {editingUser.role !== 'admin' && editingUser.id && (
                  <Button onClick={handlePromote} className="dark-button-secondary">
                    Promote to Admin
                  </Button>
                )}
                {editingUser.role === 'admin' && editingUser.id && (
                  <Button onClick={handleDemote} className="dark-button-secondary">
                    Demote
                  </Button>
                )}
                {editingUser.id && (
                  <Button
                    onClick={handleDelete}
                    className="dark-button-secondary"
                  >
                    Delete
                  </Button>
                )}
                <Button onClick={handleSave} className="dark-button-secondary ml-auto">
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
