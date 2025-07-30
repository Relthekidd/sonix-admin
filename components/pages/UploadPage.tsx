import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import UploadSingleForm from '../upload/UploadSingleForm'
import UploadAlbumForm from '../upload/UploadAlbumForm'

export function UploadPage() {
  const [tab, setTab] = useState('single')

  return (
    <main className="p-8 space-y-6">
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
