import {
  Box,
  MenuList,
  Popover,
  PopoverProps,
  styled,
  SxProps,
  Theme,
  useTheme,
} from '@mui/material';
import React, { FC, ReactNode, useEffect } from 'react';

import { ButtonCmp } from './ButtonCmp';
import { BaseMuiCmpChildProps } from './type';

interface Props extends BaseMuiCmpChildProps {
  title: ReactNode;
  menuSx?: SxProps<Theme>;
  buttonSx?: SxProps<Theme>;
  menuAnchorOrigin?: PopoverProps['anchorOrigin'];
  menuTransformOrigin?: PopoverProps['transformOrigin'];
}

const SubmenuList = styled(MenuList)(({ theme }) => ({
  minWidth: '200px',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
}));

const Wrapper = styled(Box)(() => ({
  padding: '0',
}));

const OpenButton = styled(ButtonCmp)(() => ({
  boxSizing: 'border-box',
  height: '100%',
  width: '100%',
  padding: '1rem 2rem',
}));

const defaultMenuAnchorOrigin: PopoverProps['anchorOrigin'] = {
  vertical: 'bottom',
  horizontal: 'left',
};
const defaultMenuTransformOrigin: PopoverProps['transformOrigin'] = {
  vertical: 'top',
  horizontal: 'left',
};

// eslint-disable-next-line react/display-name
const BetterMenuCmp: FC<Props> = React.memo(
  ({
    menuSx,
    sx,
    buttonSx,
    title,
    children,
    menuAnchorOrigin,
    menuTransformOrigin,
    ...baseProps
  }) => {
    const theme = useTheme();
    // eslint-disable-next-line react/jsx-no-undef
    const [submenuAnchor, setSubmenuAnchor] =
      React.useState<null | HTMLElement>(null);

    const handleSubmenuOpen = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        setSubmenuAnchor(event.currentTarget);
      },
      [],
    );

    const handleSubmenuClose = React.useCallback(() => {
      setSubmenuAnchor(null);
    }, []);

    useEffect(() => {
      const listener = () => {
        if (!submenuAnchor) {
          throw new Error('Submenu is not open, but scroll listener fired');
        }

        setSubmenuAnchor(null);
      };
      const scrollListenerOptions: AddEventListenerOptions = {
        once: true,
        passive: true,
        capture: true,
      };

      if (submenuAnchor) {
        window.addEventListener('scroll', listener, scrollListenerOptions);
      }
      return () => {
        window.removeEventListener('scroll', listener, scrollListenerOptions);
      };
    }, [submenuAnchor]);

    return (
      <Wrapper sx={sx} {...baseProps}>
        <OpenButton sx={buttonSx} onClick={handleSubmenuOpen}>
          {title}
        </OpenButton>
        <Popover
          open={Boolean(submenuAnchor)}
          anchorEl={submenuAnchor}
          onClose={handleSubmenuClose}
          anchorOrigin={menuAnchorOrigin ?? defaultMenuAnchorOrigin}
          transformOrigin={menuTransformOrigin ?? defaultMenuTransformOrigin}
          disablePortal={true}
          disableScrollLock={true}
        >
          <SubmenuList theme={theme} sx={menuSx}>
            {children}
          </SubmenuList>
        </Popover>
      </Wrapper>
    );
  },
);

export { type Props as BetterMenuCmpProps, BetterMenuCmp };
