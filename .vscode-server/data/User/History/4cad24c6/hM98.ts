/// <reference types="react" />
import { UseTabParameters, UseTabRootSlotProps } from '@mui/base/TabUnstyled/useTab.types';
import { EventHandlers } from '@mui/base/utils';
declare const useTab: (parameters: UseTabParameters) => {
    selected: boolean;
    focusVisible: boolean;
    setFocusVisible: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    disabled: boolean;
    active: boolean;
    getRootProps: <TOther extends EventHandlers>(otherHandlers?: TOther) => UseTabRootSlotProps<TOther>;
};
export default useTab;
