import * as React from 'react';
import { InternalStandardProps as StandardProps } from '@mui/material';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { SwitchBaseClasses } from '@mui/material/internal/switchBaseClasses';

export interface SwitchBaseProps
  extends StandardProps<ButtonBaseProps, 'children' | 'onChange' | 'type' | 'value'> {
  autoFocus?: boolean;
  /**
   * If `true`, the component is checked.
   */
  checked?: boolean;
  checkedIcon: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<SwitchBaseClasses>;
  /**
   * The default checked state. Use when the component is not controlled.
   */
  defaultChecked?: boolean;
  disabled?: boolean;
  /**
   * If `true`, the ripple effect is disabled.
   */
  disableRipple?: boolean;
  /**
   * If `true`, the  keyboard focus ripple is disabled.
   * @default false
   */
  disableFocusRipple?: boolean;
  /**
   * If given, uses a negative margin to counteract the padding on one
   * side (this is often helpful for aligning the left or right
   * side of the icon with content above or below, without ruining the border
   * size and shape).
   * @default false
   */
  edge?: 'start' | 'end' | false;
  icon: React.ReactNode;
  /**
   * The id of the `input` element.
   */
  id?: string;
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<any>;
  /**
   * Name attribute of the `input` element.
   */
  name?: string;
  /**
   * Callback fired when the state is changed.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   * You can pull out the new checked state by accessing `event.target.checked` (boolean).
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  readOnly?: boolean;
  /**
   * If `true`, the `input` element is required.
   */
  required?: boolean;
  tabIndex?: number;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  /**
   * The value of the component. The DOM API casts this to a string.
   */
  value?: unknown;
}

declare const SwitchBase: React.JSXElementConstructor<SwitchBaseProps>;

export default SwitchBase;
