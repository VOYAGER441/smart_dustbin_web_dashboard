# Smart Dustbin Dashboard

A modern, responsive waste management dashboard built with Next.js 16, TypeScript, Tailwind CSS, and Recharts.

## 🎯 Features

### Overview Page
- **Real-time Analytics**: 
  - Total pickups by tonnage
  - Valuable waste vs ordinary waste breakdown
  - Donut chart showing waste composition (Metal, Plastic, Electronic, Paper)
- **Daily Pickup Trends**: Bar chart showing pickup volumes over time
- **Delivery Map**: Interactive map showing bin locations and status (empty/filled)
- **Date Range Filters**: Customizable date and time period filters

### Bin Status Page
- **Device Statistics**:
  - Total registered devices: 12,233
  - Active devices online: 10,120
  - Unfilled bins in the field: 4,112
- **Comprehensive Bin Table**:
  - Province/Area location
  - IoT Report status (Filled, Almost filled, Emptied)
  - Estimated weight
  - Assigned truck information
- **Search & Filter**: Search by location, sort by status
- **Status Indicators**: Color-coded status (Red: Filled, Yellow: Almost filled, Green: Emptied)

### Navigation
- **Sidebar Menu**:
  - Overview
  - Bin status
  - Trucks
  - Recycle house
  - IoT device manager
  - Report
- **Collapsible Sidebar**: Toggle sidebar visibility for better screen space
- **Quick Actions**: Messages and Notifications quick access

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with shadcn patterns
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
smart_dustbin_dashboard/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with sidebar
│   ├── page.tsx             # Main dashboard page
│   └── favicon.ico
├── components/
│   ├── pages/
│   │   ├── Overview.tsx      # Overview page with charts
│   │   └── BinStatus.tsx     # Bin status management page
│   └── ui/
│       ├── StatCard.tsx      # Reusable stat card component
│       └── Map.tsx           # Delivery activities map
├── public/
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🎨 Design Features

### Dark Theme
- Professional dark gray color scheme (#1a1a1a background)
- Cyan and teal accent colors for interactive elements
- High contrast text for accessibility

### Responsive Layout
- Mobile-friendly with collapsible sidebar
- Grid-based component layout
- Responsive charts and tables

### Components
- **Stat Cards**: Display key metrics with icons
- **Charts**: Pie charts for composition, bar charts for trends
- **Tables**: Searchable, filterable bin status table
- **Map**: Visual representation of bin locations

## 📊 Data Mock

The dashboard uses mock data for demonstration. To connect real data:

1. Replace data in `components/pages/Overview.tsx`:
   - `wasteData` - waste composition percentages
   - `pickupData` - daily pickup volumes

2. Replace data in `components/pages/BinStatus.tsx`:
   - `binData` - bin status information

3. Create API endpoints in `app/api/` directory
4. Fetch data using React hooks (useEffect, SWR, etc.)

## 🔧 Customization

### Colors
Edit color values in `app/globals.css`:
```css
--primary: #0ea5e9;      /* Primary cyan */
--secondary: #06b6d4;    /* Secondary teal */
--background: #1a1a1a;   /* Dark background */
```

### Charts
Customize charts in `components/pages/Overview.tsx`:
- Modify `wasteData` array for pie chart
- Adjust `pickupData` for bar chart
- Change colors, labels, and scales

### Table Data
Edit `binData` array in `components/pages/BinStatus.tsx` to show different bin information.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build image
docker build -t smart-dustbin-dashboard .

# Run container
docker run -p 3000:3000 smart-dustbin-dashboard
```

## 📈 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and sorting options
- [ ] Export reports as PDF/CSV
- [ ] User authentication and role-based access
- [ ] Dark/Light theme toggle
- [ ] Mobile app version
- [ ] Integration with IoT devices
- [ ] Historical data analytics
- [ ] Predictive maintenance alerts

## 📝 License

MIT

## 👥 Contributors

- Created with Copilot AI
- Design inspired by modern waste management systems

---

**Version**: 0.1.0  
**Last Updated**: 2024
