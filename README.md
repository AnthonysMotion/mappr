# Trip Planner - Collaborative Travel Planning App

A beautiful, collaborative trip planning web application built with Next.js, Tailwind CSS, shadcn/ui, Supabase, and mapcn.

## Features

- 🗺️ **Interactive Maps** - Pin locations on beautiful maps using mapcn
- 👥 **Collaborative Planning** - Share trips with friends and family
- 📍 **Customizable Pins** - Categorize and customize location pins
- 📝 **Lists** - Create lists for stores, things to do, and things to see
- 🔄 **Real-time Updates** - See changes from collaborators in real-time
- 🔐 **Authentication** - Secure user authentication via Supabase

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **mapcn** - Map components
- **Supabase** - Authentication & Database
- **Supabase Realtime** - Real-time collaboration

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd mappr
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the migration from `supabase/migrations/001_initial_schema.sql`
   - If you encounter "infinite recursion" errors, run `supabase/migrations/004_fix_all_policies_no_recursion.sql` which fixes all circular dependencies
   - Get your project URL and anon key from Settings > API
   - Enable Realtime for the following tables: `pins`, `categories`, `list_items` (Database > Replication)

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **trips** - Trip information
- **collaborators** - User access control for trips
- **pins** - Location pins on the map
- **categories** - Pin categories with colors
- **list_items** - List items (stores, things to do, things to see)

## Features Overview

### Trip Management

- Create new trips
- View all your trips
- Share trips with others
- Set collaborator roles (owner, editor, viewer)

### Map Features

- Click on map to add pins
- View all pins with custom categories
- Pin popups with details
- Real-time pin updates

### Lists

- Three list types: Stores, Things to Do, Things to See
- Link list items to map pins
- Mark items as completed
- Real-time list updates

### Categories

- Create custom categories for pins
- Assign colors to categories
- Organize pins by category

## Deployment

The app can be deployed to Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables
4. Deploy

Make sure to also configure your Supabase project settings for production.

## License

MIT