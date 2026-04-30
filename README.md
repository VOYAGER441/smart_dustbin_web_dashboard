# Smart Dustbin Dashboard

A modern waste management system dashboard built with **Next.js 16**, **Tailwind CSS**, **TypeScript**, and **Framer Motion**. Features a stunning glass morphism 3D landing page, secure login, and comprehensive analytics dashboard.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✨ Features

### Landing Page
- 🎨 Glass morphism design with frosted glass cards
- ✨ Animated particle background (cyan-colored)
- 🎯 Hero section with gradient text
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎬 Smooth animations with Framer Motion
- 🖱️ Interactive CTAs and hover effects

### Login Page
- 🔐 Modern authentication form
- 👁️ Password visibility toggle
- 📧 Email and password validation
- 🎯 Social login placeholders
- 💾 "Remember me" checkbox
- ⌨️ Keyboard accessible

### Dashboard
- 📊 Real-time analytics and charts
- 🗺️ Interactive waste collection map
- 📦 Bin status management with searchable table
- 📈 Multiple dashboard pages (Overview, Bin Status, etc.)
- 🎨 Dark theme with cyan accents
- 📱 Responsive sidebar navigation

## 📁 Project Structure

```
smart_dustbin_dashboard/
├── app/
│   ├── page.tsx           # Main routing logic
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── pages/
│   │   ├── Landing.tsx    # Landing page (NEW)
│   │   ├── Login.tsx      # Login page (NEW)
│   │   ├── Overview.tsx   # Dashboard overview
│   │   └── BinStatus.tsx  # Bin management
│   └── ui/
│       ├── GlassCard.tsx  # Glass morphism component (NEW)
│       ├── StatCard.tsx   # Metric card
│       └── Map.tsx        # SVG delivery map
├── public/                # Static assets
├── package.json
└── tsconfig.json
```

## 🛠️ Technology Stack

- **Framework**: Next.js 16.2.4
- **React**: 19.2.4
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript 5
- **3D Graphics**: Three.js, React Three Fiber (prepared)

## 📖 Documentation

- **[START_HERE.md](./START_HERE.md)** - Quick start and feature overview
- **[LANDING_LOGIN.md](./LANDING_LOGIN.md)** - Landing & login page guide
- **[DASHBOARD.md](./DASHBOARD.md)** - Dashboard features
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - Detailed usage instructions
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Technical implementation details

## 🎨 Design System

### Colors
- **Background**: `#1a1a1a` (dark)
- **Primary**: `#06b6d4` (cyan)
- **Secondary**: `#0ea5e9` (sky blue)
- **Status**: Green (#22c55e), Yellow (#eab308), Red (#ef4444)

### Glass Morphism
- Backdrop blur with 5-30% opacity
- Subtle white gradients
- Smooth transitions on hover

### Animations
- Page enter: Staggered fade-in
- Button hover: Scale (1.02x) + shadow
- Floating elements: Smooth up/down motion
- Transitions: 0.2-0.8s duration

## 🔄 Navigation Flow

```
Landing Page (default)
  ├→ Get Started → Login Page
  ├→ Sign In → Login Page
  └→ Feature Cards

Login Page
  ├→ Sign In → Dashboard
  ├→ Back → Landing Page
  └→ Social Login (placeholders)

Dashboard
  ├→ Overview (charts, stats, map)
  ├→ Bin Status (device management)
  └→ Other pages (menu items)
```

## 🧪 Testing

The application has been verified for:
- ✅ Production build success
- ✅ TypeScript compilation
- ✅ Page loading and routing
- ✅ Animation performance
- ✅ Responsive design
- ✅ Dark theme consistency

## 📱 Browser Support

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support (103+)
- Safari: ✅ Full support (13.1+)
- Edge: ✅ Full support

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t smart-dustbin .
docker run -p 3000:3000 smart-dustbin
```

### Traditional Server
```bash
npm run build
npm start
```

## 📝 Environment Variables

Create `.env.local` for sensitive data:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Smart Dustbin
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Change with `npm run dev -- -p 3001` |
| Build errors | Delete `.next` folder and rebuild |
| Module not found | Run `npm install` again |
| Animations stuttering | Check GPU acceleration in DevTools |

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: April 2024
