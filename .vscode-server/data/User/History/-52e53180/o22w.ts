import { UseTabPanelParameters } from '@mui/base/TabPanelUnstyled/useTabPanel.types';
declare const useTabPanel: (parameters: UseTabPanelParameters) => {
    hidden: boolean;
    getRootProps: () => {
        'aria-labelledby': string | undefined;
        hidden: boolean;
        id: string | undefined;
    };
};
export default useTabPanel;
