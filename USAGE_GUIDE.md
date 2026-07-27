# Dashboard Usage Guide

## 🎯 Quick Start

### 1. Start the Application
```bash
cd /workspace/programs/projects/smart_dustbin/smart_dustbin_dashboard
npm run dev
```
Open your browser to: **http://localhost:3000**

### 2. Navigate the Dashboard

#### Sidebar Menu
- **Overview**: Main dashboard with analytics and charts
- **Bin status**: Device and bin management table
- **Trucks**: Ready for implementation
- **Recycle house**: Ready for implementation
- **IoT device manager**: Ready for implementation
- **Report**: Ready for implementation
- **Messages**: Quick access (collapsible)
- **Notifications**: Quick access (collapsible)

#### Top Controls
- **Search**: Find pages quickly in the sidebar
- **Period Filter**: Select time range (Last 7 days, etc.)
- **Date Range**: Pick specific dates (3 Jun - 10 Jun)
- **Menu Toggle**: Collapse/expand sidebar

## 📊 Overview Page

### Features
1. **Total Pickups Card**
   - Displays: 54.56 Tons based on 1653 pickups
   - Useful for: Understanding pickup volume

2. **Valuable Waste Card**
   - Displays: 24.42 Tons (56% of total)
   - Color: Cyan indicator
   - Useful for: Tracking recyclable waste

3. **Ordinary Waste Card**
   - Displays: 20.14 Tons (44% of total)
   - Color: Yellow indicator
   - Useful for: Tracking non-recyclable waste

4. **Waste Composition Chart (Donut)**
   - Shows: Metal (40%), Plastic (28%), Electronic (12%), Paper (10%)
   - Colors: Blue, Purple, Pink, Yellow
   - Useful for: Understanding waste breakdown

5. **Daily Pickups Chart (Bar)**
   - Shows: 8-day pickup trend
   - X-axis: Date
   - Y-axis: Number of pickups
   - Useful for: Analyzing pickup patterns

6. **Delivery Activities Map**
   - Green dots: Empty bins
   - Yellow dots: Filled bins
   - Useful for: Visualizing bin status distribution
   - Features: Zoom controls, user controls

### How to Use
- Use date range filters to view different time periods
- Hover over chart elements to see exact values
- Click on map legend to toggle status indicators
- Use period dropdown to change analysis timeframe

## 🗑️ Bin Status Page

### Stats Cards (Top Row)

1. **Registered Devices**
   - Value: 12,233
   - Description: Total devices enrolled
   - Icon: Lock

2. **Total Active**
   - Value: 10,120
   - Description: Devices online (last 15m)
   - Icon: WiFi

3. **Un-filled Bins**
   - Value: 4,112
   - Description: Bins placed in the field
   - Icon: Trash

### Search & Filters

**Search Box**
- Search by: Province name, postal codes, street names
- Type to filter table in real-time
- Clears automatically when needed

**Sort Options**
- Click "Sort by" dropdown to change sort field
- Default: Status
- Click "Show" to filter by status type

**Status Filters**
- All: Show all bins
- Filled: Only filled bins
- Almost filled: Partially filled bins
- Emptied: Recently emptied bins

### Bin Status Table

| Column | Information |
|--------|------------|
| **Province/Area** | Physical location address |
| **IoT Report** | Status with indicator dot |
| **Est. Weight** | Estimated tonnage (or TBD) |
| **Truck Assigned** | Assigned collection truck ID |

#### Status Indicators
- 🔴 **Filled** (Red): Ready for pickup
- 🟡 **Almost filled** (Yellow): Will need pickup soon
- 🟢 **Emptied** (Green): Recently emptied

### How to Use
1. Search for a location in the search box
2. Browse the filtered results
3. Use sort/show dropdowns to organize data
4. Click pagination buttons for more entries

## 🎨 Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --primary: #0ea5e9;      /* Change primary color */
  --secondary: #06b6d4;    /* Change secondary color */
  --background: #1a1a1a;   /* Change background */
}
```

### Update Mock Data

**For Overview Page** (`components/pages/Overview.tsx`):
```typescript
const wasteData = [
  { name: "Metal", value: 40, color: "#3b82f6" },
  // Edit these values to match your data
];

const pickupData = [
  { day: "Jun 3", pickups: 45 },
  // Edit these to reflect actual pickups
];
```

**For Bin Status Page** (`components/pages/BinStatus.tsx`):
```typescript
const binData: BinData[] = [
  {
    id: "BIN-001",
    address: "2464 Royal Ln. Mesa, New Jersey 45463",
    status: "Filled",
    weight: "12 ton",
    truck: "RES-12 • TAX-1234",
  },
  // Add or edit bin entries here
];
```

## 🔌 Connect Real Data

### Step 1: Create API Routes
```bash
mkdir -p app/api
```

### Step 2: Create Data Fetching
```typescript
// app/api/waste-stats/route.ts
export async function GET() {
  const data = {
    totalPickups: 54.56,
    valuableWaste: 24.42,
    ordinaryWaste: 20.14,
  };
  return Response.json(data);
}
```

### Step 3: Update Components
```typescript
// In components/pages/Overview.tsx
useEffect(() => {
  fetch('/api/waste-stats')
    .then(res => res.json())
    .then(data => setStats(data));
}, []);
```

## 📱 Responsive Behavior

- **Desktop (1024px+)**: Full sidebar, 3-column grid
- **Tablet (768px-1023px)**: Collapsible sidebar, 2-column grid
- **Mobile (under 768px)**: Collapsed sidebar by default, 1-column grid

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search | Ctrl/Cmd + K |
| Focus Search | F |
| Toggle Sidebar | Meta + \ |

## 🐛 Troubleshooting

### Build Fails
```bash
npm install --legacy-peer-deps
npm run build
```

### Charts Not Showing
- Check browser console for errors
- Ensure recharts is installed: `npm install recharts`
- Verify container has proper height

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

### Data Not Loading
- Check API endpoints are working
- Verify CORS settings if using external API
- Check browser network tab for errors

## 📈 Performance Tips

1. **Use Production Build**: `npm run build && npm start`
2. **Enable Caching**: Configure Next.js caching in `next.config.ts`
3. **Lazy Load Charts**: Use dynamic imports for heavy components
4. **Optimize Images**: Use Next.js Image component

## 🔐 Security Notes

- Never commit API keys to repository
- Use environment variables: `.env.local`
- Validate all user inputs
- Implement authentication before deploying

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/en-US/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 💡 Tips & Tricks

1. **Hot Reload**: Changes save automatically in dev mode
2. **Type Safety**: Use TypeScript for better development
3. **Component Reuse**: StatCard component can be reused anywhere
4. **Dark Mode**: Built-in dark theme, no toggle needed
5. **Mobile First**: Design works well on all devices

## 📞 Support

For issues or questions:
1. Check IMPLEMENTATION.md for technical details
2. Review DASHBOARD.md for feature documentation
3. Check project README.md for setup help

---

**Version**: 0.1.0  
**Last Updated**: 2024
