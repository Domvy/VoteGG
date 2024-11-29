import * as React from 'react';
import { SxProps } from '@mui/system';
import { InternalStandardProps as StandardProps, Theme } from '@mui/material';
import { ModalProps } from '@mui/material/Modal';
import { SlideProps } from '@mui/material/Slide';
import { PaperProps } from '@mui/material/Paper';
import { TransitionProps } from '@mui/material/transitions/transition';
import { DrawerClasses } from '@mui/material/Drawer/drawerClasses';

export interface DrawerProps extends StandardProps<ModalProps, 'open' | 'children'> {
  /**
   * Side from which the drawer will appear.
   * @default 'left'
   */
  anchor?: 'left' | 'top' | 'right' | 'bottom';
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DrawerClasses>;
  /**
   * The elevation of the drawer.
   * @default 16
   */
  elevation?: number;
  /**
   * Props applied to the [`Modal`](/material-ui/api/modal/) element.
   * @default {}
   */
  ModalProps?: Partial<ModalProps>;
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback.
   */
  onClose?: ModalProps['onClose'];
  /**
   * If `true`, the component is shown.
   * @default false
   */
  open?: boolean;
  /**
   * Props applied to the [`Paper`](/material-ui/api/paper/) element.
   * @default {}
   */
  PaperProps?: Partial<PaperProps>;
  /**
   * Props applied to the [`Slide`](/material-ui/api/slide/) element.
   */
  SlideProps?: Partial<SlideProps>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   * @default {
   *   enter: theme.transitions.duration.enteringScreen,
   *   exit: theme.transitions.duration.leavingScreen,
   * }
   */
  transitionDuration?: TransitionProps['timeout'];
  /**
   * The variant to use.
   * @default 'temporary'
   */
  variant?: 'permanent' | 'persistent' | 'temporary';
}

/**
 * The props of the [Modal](https://mui.com/material-ui/api/modal/) component are available
 * when `variant="temporary"` is set.
 *
 * Demos:
 *
 * - [Drawer](https://mui.com/material-ui/react-drawer/)
 *
 * API:
 *
 * - [Drawer API](https://mui.com/material-ui/api/drawer/)
 */
export default function Drawer(props: DrawerProps): JSX.Element;
