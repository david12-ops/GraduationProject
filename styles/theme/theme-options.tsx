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
