import * as React from 'react';
import { UseTabsListParameters, UseTabsListRootSlotProps } from '@mui/base/TabsListUnstyled/useTabsList.types';
import { EventHandlers } from '@mui/base/utils';
declare const useTabsList: (parameters: UseTabsListParameters) => {
    isRtl: boolean;
    orientation: "horizontal" | "vertical";
    value: string | number | false;
    processChildren: () => React.ReactElement<any, string | React.JSXElementConstructor<any>>[] | null | undefined;
    getRootProps: <TOther extends EventHandlers = {}>(otherHandlers?: TOther) => UseTabsListRootSlotProps<TOther>;
};
export default useTabsList;
