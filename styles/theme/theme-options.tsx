import { ThemeOptions } from '@mui/material/styles';
import NextLink from 'next/link';
import { forwardRef } from 'react';

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  // @ts-ignore https://stackoverflow.com/questions/66226576/using-the-material-ui-link-component-with-the-next-js-link-component/74419666#74419666
  return <NextLink ref={ref} {...props} />;
});

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
    MuiLink: {
      defaultProps: {
        // @ts-ignore https://stackoverflow.com/questions/66226576/using-the-material-ui-link-component-with-the-next-js-link-component/74419666#74419666
        component: LinkBehaviour,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        // @ts-ignore https://stackoverflow.com/questions/66226576/using-the-material-ui-link-component-with-the-next-js-link-component/74419666#74419666
        LinkComponent: LinkBehaviour,
      },
    },
  },
};

export default lightThemeOptions;
