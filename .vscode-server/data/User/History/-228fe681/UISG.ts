import { OverridableComponent } from '@mui/types';
import { BoxTypeMap } from '@mui/system/Box';
import { Theme as SystemTheme } from '@mui/system/createTheme';

export default function createBox<
  T extends object = SystemTheme,
  AdditionalProps extends Record<string, unknown> = {},
>(options?: {
  defaultTheme: T;
  defaultClassName?: string;
  generateClassName?: (componentName: string) => string;
}): OverridableComponent<BoxTypeMap<AdditionalProps, 'div', T>>;