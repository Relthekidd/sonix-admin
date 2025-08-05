AGENTS.md — Sonix Admin Dashboard
🧠 PURPOSE
This file documents how agents (AI or human) should interact with, maintain, and scale the Sonix Admin Dashboard. It ensures consistency, performance, and a unified design system for artist uploads, user management, stats, playlists, and more.

🧩 DIRECTORY STRUCTURE OVERVIEW
Pages live in: components/pages/

UI components are in: components/ui/

Reusable elements: components/common/

Upload logic: components/upload/ + app/actions/upload.ts

State/Auth: contexts/, utils/auth/, utils/supabase/

🖼️ UI + UX PRINCIPLES
Area	Guidelines
Spacing	Use consistent padding (e.g., p-4, gap-6). Avoid overly vertical layouts. Use className="h-auto min-h-[350px]" to shrink tall cards.
Buttons	Always use <Button /> from components/ui/button.tsx. Icons should go inside, never float beside.
Modals/Dialogs	Use components/ui/dialog.tsx or sheet.tsx for overlays. Avoid custom modal logic.
Consistency	All card UIs should follow GlassCard.tsx. Stats, uploads, and settings should use this consistently.
Responsiveness	Wrap all major pages in a scroll-area if they might overflow.
Icons	Prefer Lucide icons. Import them explicitly from lucide-react and match size 24.

🛠️ LOGIC + DATA FLOW
Task	Agent Behavior
Upload Single	Use UploadSingleForm.tsx → sends payload to upload.ts → saves to Supabase.
Upload Album	Same flow. Multiple tracks. Respect track ordering.
Track Duration	Automatically inferred on upload. Do not allow manual entry.
Stats	Show accurate user stats in AnalyticsPage.tsx. Pull from song_plays (see schema.sql).
Queue Logic	Admin does not control live queue, but can view activity logs.

🧪 TESTING
Unit tests go in src/

Use vitest.config.ts for setup

Run: npm run test

🧱 COMPONENT GUIDELINES
AddArtistForm.tsx
Use controlled inputs

Validate fields before submit

File uploads must preview image before upload

UploadsPage.tsx
Load all uploads by current admin user

Paginate if > 10

Include "Edit" and "Delete" options using dropdown menu

DashboardPage.tsx
Include: Latest Uploads, User Count, Top Played Song, Storage Used

Use GlassCard and MetricsChart for layout

LoginModal.tsx
Only use if auth session is null

Session should persist via SupabaseAuthProvider

🔌 DEPENDENCIES
Purpose	Package
UI	Tailwind, ShadCN UI
Icons	Lucide-react
Auth/DB	Supabase
Charts	Recharts
Testing	Vitest

🔄 NAVIGATION
All routes are page components. Wrap them in AdminLayout.tsx. This includes sidebar, top nav, and user avatar.

Pages outside this layout (like LoginPage) must NOT import AdminLayout.

🧭 TODOs FOR AGENTS
 Refactor overly vertical cards on UploadsPage and Library

 Enforce drag-and-drop for reordering albums or tracks

 Auto-generate song durations post-upload

 Add filter/search to UsersPage and PlaylistsPage

 Add toast/success notifications using ui/sonner.tsx