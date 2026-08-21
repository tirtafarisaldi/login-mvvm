export interface Option {
  readonly label: string;
  readonly value: string;
}

export interface ReactCreatableSelectProps {
  placeholder?: string;
  selectedOption: Array<Option>;
  setSelectedOption: (value: any) => void;
  inputCondition?: string;
  isDisabled?: boolean;
}
