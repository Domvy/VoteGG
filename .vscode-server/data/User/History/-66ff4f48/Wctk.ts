import { RadioGroupContextValue } from '@mui/material/RadioGroup/RadioGroupContext';
export interface RadioGroupState extends RadioGroupContextValue {
}
export default function useRadioGroup(): RadioGroupState | undefined;
