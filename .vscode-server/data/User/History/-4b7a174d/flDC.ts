export {
  default as createTheme,
  default as unstable_createMuiStrictModeTheme,
  createMuiTheme,
  ThemeOptions,
  Theme,
} from '@mui/material/styles/createTheme';
export { default as adaptV4Theme, DeprecatedThemeOptions } from '@mui/material/styles/adaptV4Theme';
export { Shadows } from '@mui/material/styles/shadows';
export { ZIndex } from '@mui/material/styles/zIndex';
export {
  CommonColors,
  Palette,
  PaletteColor,
  PaletteColorOptions,
  PaletteOptions,
  SimplePaletteColorOptions,
  TypeText,
  TypeAction,
  TypeBackground,
} from '@mui/material/styles/createPalette';
export { default as createStyles } from '@mui/material/styles/createStyles';
export {
  Typography as TypographyVariants,
  TypographyOptions as TypographyVariantsOptions,
  TypographyStyle,
  Variant as TypographyVariant,
} from '@mui/material/styles/createTypography';
export { default as responsiveFontSizes } from '@mui/material/styles/responsiveFontSizes';
export {
  Duration,
  Easing,
  Transitions,
  TransitionsOptions,
  duration,
  easing,
} from '@mui/material/styles/createTransitions';
export { Mixins } from '@mui/material/styles/createMixins';
export {
  Direction,
  Breakpoint,
  BreakpointOverrides,
  Breakpoints,
  BreakpointsOptions,
  CreateMUIStyled,
  Interpolation,
  CSSInterpolation,
  CSSObject,
  css,
  keyframes,
  // color manipulators
  hexToRgb,
  rgbToHex,
  hslToRgb,
  decomposeColor,
  recomposeColor,
  getContrastRatio,
  getLuminance,
  emphasize,
  alpha,
  darken,
  lighten,
  ColorFormat,
  ColorObject,
  StyledEngineProvider,
  SxProps,
} from '@mui/system';
// TODO: Remove this function in v6.
// eslint-disable-next-line @typescript-eslint/naming-convention
export function experimental_sx(): any;
export { default as useTheme } from '@mui/material/styles/useTheme';
export { default as useThemeProps } from '@mui/material/styles/useThemeProps';
export * from '@mui/material/styles/useThemeProps';
export { default as styled } from '@mui/material/styles/styled';
/**
 * @deprecated will be removed in v5.beta, please use styled from @mui/material/styles instead
 */
export { default as experimentalStyled } from '@mui/material/styles/styled';
export { default as ThemeProvider } from '@mui/material/styles/ThemeProvider';
export { ComponentsProps, ComponentsPropsList } from '@mui/material/styles/props';
export { ComponentsVariants } from '@mui/material/styles/variants';
export { ComponentsOverrides, ComponentNameToClassKey } from '@mui/material/styles/overrides';
export { Components } from '@mui/material/styles/components';
export { getUnit as unstable_getUnit, toUnitless as unstable_toUnitless } from '@mui/material/styles/cssUtils';

export type ClassNameMap<ClassKey extends string = string> = Record<ClassKey, string>;

export interface StyledComponentProps<ClassKey extends string = string> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ClassNameMap<ClassKey>>;
}

export { default as makeStyles } from '@mui/material/styles/makeStyles';
export { default as withStyles } from '@mui/material/styles/withStyles';
export { default as withTheme } from '@mui/material/styles/withTheme';

export * from '@mui/material/styles/CssVarsProvider';

export { default as experimental_extendTheme } from '@mui/material/styles/experimental_extendTheme';
export type {
  ColorSchemeOverrides,
  SupportedColorScheme,
  ColorSystem,
  CssVarsPalette,
  Opacity,
  Overlays,
  PaletteAlert,
  PaletteActionChannel,
  PaletteAppBar,
  PaletteAvatar,
  PaletteChip,
  PaletteColorChannel,
  PaletteCommonChannel,
  PaletteFilledInput,
  PaletteLinearProgress,
  PaletteSkeleton,
  PaletteSlider,
  PaletteSnackbarContent,
  PaletteSpeedDialAction,
  PaletteStepConnector,
  PaletteStepContent,
  PaletteSwitch,
  PaletteTableCell,
  PaletteTextChannel,
  PaletteTooltip,
  CssVarsThemeOptions,
  CssVarsTheme,
  ThemeVars,
  ThemeCssVar,
  ThemeCssVarOverrides,
  ColorSystemOptions,
} from '@mui/material/styles/experimental_extendTheme';
export { default as getOverlayAlpha } from '@mui/material/styles/getOverlayAlpha';

// Private methods for creating parts of the theme
export { default as private_createTypography } from '@mui/material/styles/createTypography';
export { default as private_excludeVariablesFromRoot } from '@mui/material/styles/excludeVariablesFromRoot';
