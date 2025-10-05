# Bitcoin Tycoon - Cyberpunk Design System

## 🎨 Overview

A comprehensive cyberpunk-themed design system for Bitcoin Tycoon, featuring neon colors, glassmorphism effects, and futuristic animations.

---

## 🌈 Color Palette

### Neon Colors
```css
--neon-cyan: #00ffff      /* Primary accent */
--neon-blue: #0ea5e9      /* Secondary accent */
--neon-purple: #8b5cf6    /* Tertiary accent */
--neon-magenta: #ff00ff   /* Special effects */
--neon-pink: #ec4899      /* Highlights */
--neon-lime: #00ff00      /* Success states */
--neon-green: #10b981     /* Positive values */
--neon-amber: #f59e0b     /* Warnings */
```

### Base Colors
```css
--cyber-dark: #0a0e27     /* Deep background */
--cyber-darker: #050816   /* Darkest background */
--cyber-slate: #1e293b    /* Card backgrounds */
--cyber-slate-light: #334155 /* Borders */
```

---

## 🎭 Components

### Card Component
```tsx
import { Card } from '@/components/UI'

// Default card
<Card title="Title" subtitle="Subtitle">
  Content
</Card>

// Cyber border variant
<Card variant="cyber" title="Cyber Card">
  Content with animated gradient border
</Card>

// Glowing card
<Card variant="glow" glowColor="cyan" title="Glowing Card">
  Content with neon glow effect
</Card>
```

**Variants:**
- `default` - Standard glassmorphism card
- `cyber` - Animated gradient border
- `glow` - Neon glow effect with hover animation

**Glow Colors:** `cyan`, `purple`, `green`, `pink`

---

### StatCard Component
```tsx
import { StatCard } from '@/components/UI'
import { DollarSign } from 'lucide-react'

<StatCard
  title="Total Balance"
  value="$10,000"
  icon={DollarSign}
  color="green"
  trend={{ value: 12.5, isPositive: true }}
/>
```

**Colors:** `green`, `blue`, `purple`, `amber`, `red`, `cyan`, `pink`

**Features:**
- Animated hover effects
- Icon with glow effect
- Trend indicator with progress bar
- Responsive scaling

---

### Button Component
```tsx
import { Button } from '@/components/UI'
import { Zap } from 'lucide-react'

// Primary button
<Button variant="primary" glowColor="cyan">
  Click Me
</Button>

// Cyber button with icon
<Button variant="cyber" icon={Zap} iconPosition="left">
  Execute
</Button>

// Loading state
<Button isLoading>
  Processing...
</Button>
```

**Variants:**
- `primary` - Solid neon color with glow
- `secondary` - Subtle slate background
- `danger` - Red warning style
- `ghost` - Transparent with hover
- `cyber` - Gradient border with glow

**Sizes:** `sm`, `md`, `lg`

---

### Badge Component
```tsx
import { Badge } from '@/components/UI'

<Badge variant="success" glow>
  Active
</Badge>

<Badge variant="cyber" size="lg">
  LIVE
</Badge>
```

**Variants:** `default`, `success`, `warning`, `danger`, `info`, `cyber`

---

### Loading Component
```tsx
import { Loading } from '@/components/UI'

// Spinner variant
<Loading variant="spinner" text="Loading..." />

// Pulse variant
<Loading variant="pulse" size="lg" />

// Dots variant
<Loading variant="dots" text="Processing..." />
```

**Variants:** `spinner`, `pulse`, `dots`
**Sizes:** `sm`, `md`, `lg`

---

## 🎬 Animations

### Tailwind Classes

```tsx
// Glow animations
className="animate-glow"           // Pulsing glow
className="animate-glow-pulse"     // Intense glow pulse

// Movement
className="animate-float"          // Floating effect
className="animate-slide-in"       // Slide from left
className="animate-fade-in"        // Fade in

// Effects
className="animate-shimmer"        // Shimmer effect
className="animate-scan"           // Scan line effect
```

### Custom CSS Classes

```tsx
// Neon glow effects
className="neon-glow-cyan"
className="neon-glow-purple"
className="neon-glow-green"
className="neon-glow-pink"

// Text glow
className="text-glow-cyan"
className="text-glow-purple"
className="text-glow-green"

// Hover effects
className="hover-glow"             // Glow on hover + lift

// Backgrounds
className="cyber-border"           // Animated gradient border
className="cyber-grid"             // Grid pattern background
className="gradient-animate"       // Animated gradient
```

---

## 🖼️ Layout Effects

### Background Grid
```tsx
<div className="cyber-grid opacity-20">
  Content with grid background
</div>
```

### Glassmorphism
```tsx
<div className="glass">
  Standard glass effect
</div>

<div className="glass-strong">
  Stronger glass effect
</div>
```

### Scan Line Effect
```tsx
<div className="scan-line">
  Content with animated scan line
</div>
```

---

## 📐 Spacing & Sizing

### Consistent Spacing
- Cards: `p-6` (24px padding)
- Gaps: `gap-4` (16px) or `gap-6` (24px)
- Margins: `space-y-6` (24px vertical spacing)

### Border Radius
- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Badges: `rounded-full`

---

## 🎯 Usage Examples

### Dashboard Header
```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-heading text-neon-cyan text-glow-cyan">
      Dashboard
    </h1>
    <p className="text-slate-400 mt-1">Overview</p>
  </div>
  <Badge variant="cyber" glow>
    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
    REAL-TIME
  </Badge>
</div>
```

### Stat Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Balance" value="$10,000" icon={DollarSign} color="green" />
  <StatCard title="Hashrate" value="100 TH/s" icon={Activity} color="cyan" />
  <StatCard title="Power" value="50 kW" icon={Zap} color="amber" />
  <StatCard title="P&L" value="$5,000" icon={TrendingUp} color="green" />
</div>
```

### Card with Actions
```tsx
<Card 
  variant="glow" 
  glowColor="purple"
  title="Mining Sites"
  action={
    <Button variant="cyber" size="sm" icon={Plus}>
      Add Site
    </Button>
  }
>
  <div className="space-y-4">
    {/* Content */}
  </div>
</Card>
```

---

## 🎨 Scrollbar Styling

Custom cyberpunk scrollbars are automatically applied:
- Track: Dark slate background
- Thumb: Slate with rounded edges
- Hover: Neon cyan with glow effect

---

## 🌟 Best Practices

1. **Consistent Color Usage**
   - Use `neon-cyan` for primary actions and highlights
   - Use `neon-purple` for secondary accents
   - Use `neon-green` for success/positive values
   - Use `red` for errors/negative values

2. **Glow Effects**
   - Use sparingly for emphasis
   - Apply to active/important elements
   - Combine with animations for attention

3. **Glassmorphism**
   - Use for cards and overlays
   - Maintain backdrop-blur for depth
   - Keep transparency subtle (5-10%)

4. **Animations**
   - Keep duration between 200-500ms
   - Use `ease-in-out` for smooth transitions
   - Add delays for staggered effects

5. **Accessibility**
   - Ensure sufficient contrast
   - Provide non-color indicators
   - Test with reduced motion preferences

---

## 🔧 Customization

### Adding New Neon Colors
Edit `tailwind.config.js`:
```js
neon: {
  // Add new color
  orange: '#ff6600',
}
```

### Creating Custom Glow
Edit `index.css`:
```css
.neon-glow-orange {
  box-shadow: 0 0 5px #ff6600, 0 0 20px rgba(255, 102, 0, 0.5);
}
```

---

## 📱 Responsive Design

All components are mobile-responsive:
- Grid layouts collapse on smaller screens
- Touch-friendly button sizes
- Optimized spacing for mobile
- Readable text sizes across devices

---

## 🚀 Performance

- CSS animations use GPU acceleration
- Minimal JavaScript for effects
- Optimized blur effects
- Efficient re-renders with React

---

## 📚 Resources

- **Tailwind CSS**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Orbitron Font**: Google Fonts
- **JetBrains Mono**: Google Fonts

---

**Last Updated**: 2024
**Version**: 1.0.0