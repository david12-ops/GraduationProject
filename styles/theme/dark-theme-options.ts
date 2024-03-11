import { ThemeOptions } from '@mui/material/styles';

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
  // buttton: {},
};

export default lightThemeOptions;
