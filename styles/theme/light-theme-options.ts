import {
  PaletteColor,
  PaletteColorOptions,
  ThemeOptions,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  // interface MyPaletteColor extends PaletteColor {
  //   contrastLightText?: string;
  //   contrastDarkText?: string;
  // }

  // type M = {
  //   contrastLightText?: string;
  // };

  // type MyPaletteColorOptions = M & PaletteColorOptions;
  type MyPaletteColorOptions = PaletteColorOptions;

  interface Palette {
    submitButton: PaletteColor;
    deleteButton: PaletteColor;
    createButton: PaletteColor;
    updateButton: PaletteColor;
  }
  interface PaletteOptions {
    submitButton: MyPaletteColorOptions;
    deleteButton: MyPaletteColorOptions;
    createButton: MyPaletteColorOptions;
    updateButton: MyPaletteColorOptions;
  }
}

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    submitButton: {
      main: '#FAB85C',
      light: '#FACB5C',
      dark: '#FA815C',
    },
    deleteButton: {
      dark: '#FA1133',
      light: '#FA983C',
      main: '#FA553C',
    },
    createButton: {
      light: '#50FA28',
      dark: '#05E696',
      main: '#2DFA5F',
    },
    updateButton: {
      light: '#20C6E0',
      dark: '#1C4CE6',
      main: '#2593FA',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white',
          padding: ' 12px 20px',
          margin: ' 8px 0',
          borderBlock: 'none',
          cursor: 'pointer',
          opacity: 0.9,
          borderRadius: '10px',
        },
      },
    },
  },
};

export default lightThemeOptions;
