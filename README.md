# Mappr - Collaborative Travel Planning App

A beautiful, collaborative trip planning web application built with Next.js, Tailwind CSS, shadcn/ui, Supabase, and MapLibre GL.

## Features

- 🗺️ **Interactive Maps** - Pin locations on beautiful maps with MapLibre GL
- 👥 **Collaborative Planning** - Share trips with friends and family
- 📍 **Customizable Pins** - Categorize and customize location pins with colors and icons
- 📅 **Day & Time Planning** - Organize your itinerary by day and time
- 📝 **Lists** - Create lists for stores, things to do, and things to see
- 🔄 **Real-time Updates** - See changes from collaborators in real-time
- 🔐 **Authentication** - Secure authentication with email/password and Google OAuth
- 🎨 **Custom Categories** - Create and organize pins with custom categories

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **MapLibre GL** - Interactive maps
- **Supabase** - Authentication & Database
- **Supabase Realtime** - Real-time collaboration
- **Google Places API** - Location search and autocomplete

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
   - Go to SQL Editor and run the migrations in order:
     - `supabase/migrations/001_initial_schema.sql`
     - `supabase/migrations/002_add_collaborators.sql`
     - `supabase/migrations/003_add_pins_and_categories.sql`
     - `supabase/migrations/004_fix_all_policies_no_recursion.sql` (if you encounter recursion errors)
     - `supabase/migrations/005_create_avatars_storage.sql`
     - `supabase/migrations/006_add_trip_dates_and_label.sql`
     - `supabase/migrations/007_add_pin_day_and_time.sql`
     - `supabase/migrations/008_add_place_data_to_pins.sql`
   - Get your project URL and anon key from Settings > API
   - Enable Realtime for the following tables: `pins`, `categories`, `list_items` (Database > Replication)
   - Configure Google OAuth provider (see [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed instructions)

4. **Set up Google Places API** (optional, for location search)

   - Create a project in [Google Cloud Console](https://console.cloud.google.com)
   - Enable the Places API
   - Create an API key
   - Restrict the API key to your domain (recommended)

5. **Configure environment variables**

   Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Maps API (Optional, for location search)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
# OR
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Site URL (Optional, for production)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **trips** - Trip information (name, description, dates, label)
- **collaborators** - User access control for trips (owner, editor, viewer roles)
- **pins** - Location pins on the map (with day, time, place data)
- **categories** - Pin categories with colors and icons
- **list_items** - List items (stores, things to do, things to see)
- **users** - User profiles (managed by Supabase Auth)

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
- Assign colors and icons to categories
- Organize pins by category
- Filter pins by category on the map

### Authentication

- Email/password authentication
- Google OAuth sign-in
- Secure session management
- User profile management

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In Vercel project settings, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_MAPS_API_KEY` (optional)
   - `NEXT_PUBLIC_SITE_URL` (optional, Vercel auto-provides `VERCEL_URL`)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

5. **Configure OAuth for Production**
   - **Critical:** Update Supabase and Google OAuth settings for your production domain
   - See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed instructions
   - Set Site URL in Supabase to your Vercel domain
   - Add production callback URL to Google Cloud Console

### Build Locally

```bash
npm run build
npm start
```

The production build will be available at `http://localhost:3000`.

## OAuth Configuration

For Google OAuth to work correctly in production, you need to configure redirect URLs in both Supabase and Google Cloud Console. See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed step-by-step instructions.

**Quick Checklist:**
- ✅ Set Site URL in Supabase to your production domain
- ✅ Add production callback URL to Supabase redirect URLs
- ✅ Add Supabase redirect URI to Google Cloud Console authorized redirect URIs

## Troubleshooting

### Build Errors

If you encounter TypeScript errors during build:
- Ensure all migrations have been run
- Check that environment variables are set correctly
- Run `npm run build` to see specific error messages

### OAuth Redirect Issues

If OAuth redirects to localhost instead of production:
- Check Supabase Site URL configuration
- Verify redirect URLs in both Supabase and Google Cloud Console
- See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed troubleshooting

### Real-time Updates Not Working

- Verify Realtime is enabled for `pins`, `categories`, and `list_items` tables
- Check that RLS policies allow the user to read/write data
- Ensure you're using the correct Supabase project credentials

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
mappr/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── trips/             # Trip management pages
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── pins/             # Pin-related components
│   ├── trips/            # Trip-related components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client setup
│   └── utils/             # Helper functions
└── supabase/
    └── migrations/        # Database migrations
```

## License

MIT