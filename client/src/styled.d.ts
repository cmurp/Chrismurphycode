import 'styled-components';


// extend styled-components module declarations
declare module 'styled-components' {
    export interface ThemeInterface {
      borderRadius: string;
      
      colors: {
        main: string;
        secondary: string;
        tertiary: string;
        
        accent: string;
        secondaryAccent: string;
        
        textPrimary: string;
        textSecondary: string;
        textOnAccent: string;
        textOnSecondaryAccent: string;
        
        border: string;
        borderAccent: string;
      };
      
      fonts: {
        primary: string;
        code: string;
      };

      fontSizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
      };
      
      fontWeights: {
        normal: string;
        bold: string;
        bolder: string;
        light: string;
        lighter: string;
      };
      
      breakpoints: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
  
      animations: {
        transitionTime: string;
      };

      shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
    }
  }
  