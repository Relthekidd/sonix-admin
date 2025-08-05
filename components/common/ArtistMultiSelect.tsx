import { useId, useState } from 'react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

interface Artist {
  id: string
  name: string
}

interface ArtistMultiSelectProps {
  artists: Artist[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  placeholder?: string
}

export function ArtistMultiSelect({ artists, selectedIds, onChange, placeholder }: ArtistMultiSelectProps) {
  const [input, setInput] = useState('')
  const listId = useId()

  const selected = artists.filter(a => selectedIds.includes(a.id))

  const addByName = (name: string) => {
    const match = artists.find(a => a.name === name)
    if (match && !selectedIds.includes(match.id)) {
      onChange([...selectedIds, match.id])
      setInput('')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInput(val)
    addByName(val)
  }

  const remove = (id: string) => {
    onChange(selectedIds.filter(sid => sid !== id))
  }

  return (
    <div className="space-y-2">
      <Input
        list={listId}
        value={input}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-12 px-4 text-lg"
      />
      <datalist id={listId}>
        {artists.map(a => (
          <option key={a.id} value={a.name} />
        ))}
      </datalist>
      <div className="flex flex-wrap gap-2">
        {selected.map(a => (
          <Badge key={a.id} className="flex items-center gap-1">
            {a.name}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={() => remove(a.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default ArtistMultiSelect
