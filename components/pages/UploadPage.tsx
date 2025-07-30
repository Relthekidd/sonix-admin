import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import UploadSingleForm from '../upload/UploadSingleForm'
import UploadAlbumForm from '../upload/UploadAlbumForm'

export function UploadPage() {
  const [tab, setTab] = useState('single')
  const navigate = useNavigate()

  return (
    <main className="glass-page space-y-6">
      <button onClick={() => navigate(-1)} className="glass-back-button mb-4">
        ← Back
      </button>
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="single">Single</TabsTrigger>
          <TabsTrigger value="album">Album</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <UploadSingleForm />
        </TabsContent>
        <TabsContent value="album">
          <UploadAlbumForm />
        </TabsContent>
      </Tabs>
    </main>
  )
}
