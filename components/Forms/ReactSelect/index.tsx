import type { FC } from 'react';
import type { ReactSelectProps } from './types';
import Select from 'react-select';

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    height: 44,
    border: 0,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  }),
  input: (provided: any) => ({
    ...provided,
    // color: "yellow",
    border: '0 !important',
    borderColor: 'none !important',
    boxShadow: 'none !important'
  })
};

const ReactSelect: FC<ReactSelectProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  name
}) => {
  return (
    <>
      <Select
        instanceId={name}
        name={name}
        defaultValue={selectedOption}
        value={selectedOption}
        onChange={setSelectedOption}
        styles={customStyles}
        options={options}
      />
    </>
  );
};

export default ReactSelect;
