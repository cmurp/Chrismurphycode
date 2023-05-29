import { ThemeInterface } from 'styled-components';

const theme: ThemeInterface = {
    borderRadius: '5px',

    colors: {
        main: '#1a202c', // Dark gray - primary background color
        secondary: '#2d3748', // Medium gray - secondary background color for panels, modals
        tertiary: '#4a5568', // Light gray - used for backgrounds of selected items, hover states

        accent: '#E53E3E', // Scarlet - accent color for buttons, links
        secondaryAccent: '#38B2AC', // Turquoise - secondary accent color for highlights, notifications

        textPrimary: '#F7FAFC', // Almost white - primary text color
        textSecondary: '#E2E8F0', // Light gray - secondary text color for less important information
        textOnAccent: '#F7FAFC', // Almost white - text color on accent backgrounds
        textOnSecondaryAccent: '#1a202c', // Dark gray - text color on secondary accent backgrounds

        border: '#4A5568', // Light gray - border color for dividers, tables, etc
        borderAccent: '#E53E3E', // Scarlet - border color for emphasis
    },

    fonts: {
        primary: 'Arial, sans-serif', // Primary font for text
        code: 'Courier, monospace', // Font for code blocks, data presentation
    },

    fontSizes: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        md: '1rem',        // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        xxl: '1.5rem',     // 24px
      },
    
      fontWeights: {
        normal: "400",
        bold: "700",
        bolder: "900",
        light: "300",
        lighter: "200",
      },

    breakpoints: {
        mobile: '480px', // Mobile breakpoint
        tablet: '768px', // Tablet breakpoint
        desktop: '1024px', // Desktop breakpoint
    },

    animations: {
        transitionTime: '0.3s', // Standard transition time
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
};
  

export default theme;