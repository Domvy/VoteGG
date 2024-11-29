import * as React from 'react';
import { OptionState } from '@mui/base/ListboxUnstyled';
import { SelectOption, UseSelectOptionSlotProps } from '@mui/base/SelectUnstyled/useSelect.types';
export interface SelectUnstyledContextType {
    getOptionState: (value: SelectOption<any>) => OptionState;
    getOptionProps: (option: SelectOption<any>) => UseSelectOptionSlotProps;
    listboxRef: React.RefObject<HTMLElement>;
}
export declare const SelectUnstyledContext: React.Context<SelectUnstyledContextType | undefined>;