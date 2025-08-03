import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import UploadSingleForm from '../upload/UploadSingleForm'
import UploadAlbumForm from '../upload/UploadAlbumForm'
import { ErrorBoundary } from '../common/ErrorBoundary'

export function UploadPage() {
  const [tab, setTab] = useState('single')
  const navigate = useNavigate()

  return (
    <main className="space-y-6 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded-md bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
      >
        ← Back
      </button>
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single</TabsTrigger>
          <TabsTrigger value="album">Album</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <ErrorBoundary>
            <UploadSingleForm />
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="album">
          <UploadAlbumForm />
        </TabsContent>
      </Tabs>
    </main>
  )
}
