import { RadioGroup, Stack, Radio, RadioProps } from '@chakra-ui/react';

const RadioButton = (
  props: Exclude<RadioProps, 'defaultValue'> & {
    data: {
      value: any;
      label: string;
    }[];
    handleChange: any;
  }
) => {
  return (
    <RadioGroup
      onChange={(e: any) => {
        if (e === 'true' || e === 'false') {
          props.handleChange(e === 'true');
        } else {
          props.handleChange(e);
        }
      }}
      value={props.defaultValue as string}
    >
      <Stack spacing={5} direction="row">
        {props.data.map((d, i) => {
          return (
            <Radio key={i} colorScheme={props.colorScheme} value={d.value}>
              {d.label}
            </Radio>
          );
        })}
      </Stack>
    </RadioGroup>
  );
};

export default RadioButton;
