import { RadioGroup, Stack, Radio, RadioProps } from '@chakra-ui/react';

const Checkbox = (
  props: Exclude<RadioProps, 'defaultValue'> & {
    label: string;
    handleClick: any;
  }
) => {
  return (
    <RadioGroup>
      <Stack spacing={5} direction="row">
        <Radio
          colorScheme={props.colorScheme}
          onClick={props.handleClick}
          isChecked={props.isChecked}
        >
          {props.label}
        </Radio>
      </Stack>
    </RadioGroup>
  );
};

export default Checkbox;
