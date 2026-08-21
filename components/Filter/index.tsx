import type { FilterAreaProps } from './types';
import Text from 'components/Typography/Text';
import { Flex } from '@chakra-ui/react';
import ApplyResetFilterButton from './ApplyResetFilterButton';

const FilterArea = (props: FilterAreaProps) => {
  const { filters, onClickApply, onClickReset, disabled } = props;
  return (
    <Flex
      direction={'column'}
      mt="16px"
      width={'100%'}
      border={'1px'}
      borderRadius={'8px'}
      borderColor={'#DBDADE'}
      padding={'16px'}
    >
      <Flex direction={'row'} justifyContent={'space-between'}>
        <Text variant="bodyLargeRegular">Filter Data</Text>
        <ApplyResetFilterButton
          applyButtonOnClick={onClickApply}
          resetButtonOnClick={onClickReset}
          isApplyButtonDisable={disabled}
        />
      </Flex>
      <Flex gap="16px" flexWrap={'wrap'}>
        {filters.map((filter, idx) => (
          <div className="filter-container block text-sm font-medium" key={idx}>
            {filter}
          </div>
        ))}
      </Flex>
      <div></div>
    </Flex>
  );
};

export default FilterArea;
