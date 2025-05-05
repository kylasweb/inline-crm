# Site Customizer Documentation

## Theme Presets/Templates

The site customizer includes four pre-configured theme presets:

1. **Default Theme**
   - Primary Color: `#9b87f5`
   - Secondary Color: `#7e69ab`
   - Accent Color: `#6e59a5`
   - Font: Inter
   - Standard spacing configuration

2. **Modern Theme**
   - Primary Color: `#2563eb`
   - Secondary Color: `#3b82f6`
   - Accent Color: `#60a5fa`
   - Font: Plus Jakarta Sans
   - Enhanced spacing (larger containers and element gaps)

3. **Minimal Theme**
   - Primary Color: `#18181b`
   - Secondary Color: `#27272a`
   - Accent Color: `#71717a`
   - Font: DM Sans
   - Compact spacing configuration

4. **Vibrant Theme**
   - Primary Color: `#7c3aed`
   - Secondary Color: `#6d28d9`
   - Accent Color: `#5b21b6`
   - Font: Space Grotesk
   - Standard spacing configuration

To apply a theme:
1. Navigate to the Site Customizer
2. Select the "Theme" tab
3. Click on your desired theme preset
4. Changes are applied immediately with a live preview

## Custom Font Selection

The site customizer supports custom font selection for both primary and secondary fonts:

- **Primary Font**: Used for headings and important text elements
- **Secondary Font**: Used for body text and general content

Available fonts:
- Inter (Default)
- Plus Jakarta Sans
- DM Sans
- Space Grotesk

Best practices:
- Choose fonts that complement each other
- Consider readability for different screen sizes
- Test fonts across different browsers
- Ensure font pairs maintain visual hierarchy

## Layout Spacing Controls

The layout spacing system provides granular control over various spacing aspects:

```typescript
spacing: {
  container: string;    // Overall container padding
  headerHeight: string; // Height of the header
  sidebarWidth: string; // Width of the sidebar
  elementGap: string;   // Space between elements
  sectionPadding: string; // Padding within sections
}
```

Default values:
- Container: `2rem`
- Header Height: `4rem`
- Sidebar Width: `16rem`
- Element Gap: `1rem`
- Section Padding: `2rem`

To adjust spacing:
1. Navigate to the "Layout" tab
2. Modify individual spacing values
3. Changes are applied in real-time for immediate preview

## Custom JavaScript Injection

The site customizer allows for safe injection of custom JavaScript code:

```typescript
interface CustomScript {
  id: string;
  name: string;
  code: string;
  active: boolean;
}
```

Best practices:
1. Always provide a descriptive name for scripts
2. Use the active/inactive toggle for testing
3. Validate scripts before activation
4. Keep scripts modular and focused
5. Avoid conflicting with core functionality
6. Use appropriate error handling
7. Document script purposes and dependencies

Safety considerations:
- Scripts are isolated to prevent conflicts
- Each script runs in its own context
- Scripts can be easily disabled if issues arise
- Changes are persisted in localStorage

## Social Media Links Configuration

Social media links can be configured with the following properties:

```typescript
interface SocialLink {
  platform: string; // Social media platform name
  url: string;     // Full URL to profile
  icon: string;    // Icon identifier
}
```

To add/manage social links:
1. Navigate to the "Advanced" tab
2. Use the "Add Social Link" button
3. Enter platform name, URL, and select an icon
4. Arrange links using drag-and-drop
5. Toggle visibility as needed

## Header Layout Options

The header component supports three distinct layouts and various configuration options:

```typescript
interface HeaderConfig {
  layout: 'default' | 'centered' | 'minimal';
  showSearch: boolean;
  showNotifications: boolean;
  showUserProfile: boolean;
  fixed: boolean;
}
```

### Layout Types:

1. **Default Layout**
   - Logo/site name on the left
   - Search bar in the center
   - User controls on the right
   - Full feature set visible

2. **Centered Layout**
   - Logo/site name centered
   - Search bar below header
   - Symmetrical control placement
   - Optimized for branding

3. **Minimal Layout**
   - Essential elements only
   - Compact design
   - Optional feature hiding
   - Mobile-optimized

### Customization Options:
- Toggle search functionality
- Show/hide notifications
- Configure user profile display
- Fixed or scrollable header
- Responsive behavior settings

Best practices:
1. Choose a layout that matches your navigation needs
2. Consider mobile responsiveness when configuring options
3. Maintain consistent branding across layouts
4. Test user interaction patterns
5. Ensure accessibility in all configurations