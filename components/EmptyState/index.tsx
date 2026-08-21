import Image from 'next/image';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';

const EmptyState = ({
  imageSrc,
  title,
  description
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-center justify-center flex-col mt-12">
      <Image src={imageSrc} width="253" height="138" alt="empty-state" unoptimized />
      <Text variant="headingLargeBlack" color={colors.darkWillow} mb="8px" mt="8px">
        {title}
      </Text>
      <Text variant="bodySmallRegular" color={colors.tarnishedSilver}>
        {description}
      </Text>
    </div>
  );
};

export default EmptyState;
