# Clockd - Workplace Hours Dashboard

![Clockd Logo](https://img.shields.io/badge/Clockd-Hours%20Tracking-3a515f?style=for-the-badge)

Clockd is a modern workplace hours tracking dashboard that integrates with Toggl to display real-time work hours for team members. It provides an intuitive leaderboard system that showcases individual progress and creates a friendly, competitive environment.

## Features

- **Real-time Hours Tracking**: Integrates with Toggl API to display hours worked for each team member
- **Leaderboard Display**: Ranks team members based on hours worked with a visually appealing interface
- **Admin Dashboard**: Manage users, toggle active status, and monitor team progress
- **Auto-refreshing Display**: Perfect for TV dashboards with automatic refresh functionality
- **Responsive Design**: Works on all devices from mobile to large displays
- **Secure User Management**: Encrypted API tokens and secure admin authentication

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Secure cookie-based admin authentication
- **Data Storage**: Supabase
- **API Integration**: Toggl API
- **Deployment**: Compatible with Vercel or any Node.js hosting platform

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Yarn or npm
- Supabase account (for database)
- Toggl account (for time tracking)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key

# Admin Configuration
ADMIN_PASSWORD=your_secure_admin_password

# Encryption (32 character secure key)
ENCRYPTION_KEY=your_secure_32_character_encryption_key
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/dayumsam/clockd.git
   cd clockd
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

### Database Setup

1. Create a new Supabase project
2. Create a `users` table with the following schema:
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     avatar TEXT,
     company TEXT,
     apitoken TEXT NOT NULL,
     isactive BOOLEAN DEFAULT TRUE
   );
   ```

## Usage

### Dashboard View

The main dashboard displays a leaderboard of all active users with their current work hours. This view automatically refreshes hourly and is ideal for display on office TVs or monitors.

### Admin Panel

Access the admin panel at `/admin` with your configured admin password. From here you can:

- Add new users with their Toggl credentials
- Edit existing user information
- Toggle user active status
- Delete users

### Security Notes

- Toggl API tokens are encrypted before storage
- Admin authentication is implemented with secure HTTP-only cookies
- Environment variables are used for all sensitive information

## Project Structure

```
clockd/
├── public/           # Static assets
├── src/              # Source code
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── config/       # Configuration files
│   ├── lib/          # Library code and utilities
│   ├── services/     # Services for API interactions
│   └── types.ts      # TypeScript type definitions
├── .env.local        # Environment variables (create this)
├── next.config.ts    # Next.js configuration
├── package.json      # Project dependencies
├── postcss.config.js # PostCSS configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Customization

### Themes and Styling

The app uses Tailwind CSS for styling. You can customize the colors, fonts, and other design elements by modifying:

- `src/app/globals.css` - Global CSS variables and theme settings

### Refresh Interval

The dashboard auto-refreshes hourly by default. You can change this by modifying the `REFRESH_INTERVAL` constant in `src/app/page.tsx`.

## Deployment

### Vercel (Recommended)

The easiest way to deploy Clockd is to use the [Vercel Platform](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the project into Vercel
3. Set up the environment variables
4. Deploy

### Other Platforms

You can deploy to any platform that supports Node.js applications:

1. Build the application
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server
   ```bash
   npm start
   # or
   yarn start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Supabase](https://supabase.io/) - The open source Firebase alternative
- [Toggl API](https://github.com/toggl/toggl_api_docs) - Time tracking API
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit