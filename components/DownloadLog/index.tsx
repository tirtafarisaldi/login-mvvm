import type { FC, MouseEvent } from 'react';
import type { DownloadLogProps, Type } from './types';
import { useState } from 'react';
import ButtonLinkWithLogo from 'components/Button/ButtonLinkWithLogo';
import { LinkBox, LinkOverlay, Portal, Text, useBoolean } from '@chakra-ui/react';
import Info from 'components/Icon/Info';
import { When } from 'react-if';
import Alert from 'components/Alert';

const DownloadLog: FC<DownloadLogProps> = ({
  title = 'Log',
  payload,
  requiredLabel,
  isRequiredPayloadFilled,
  endpoint,
  handleValidation,
  types
}) => {
  const [isDownloadError, setIsDownloadError] = useState(false);
  const [showDropdownDownloadLog, setShowDropdownDownloadLog] = useBoolean();

  const validateDownloadLog = () => {
    if (!isRequiredPayloadFilled) {
      setIsDownloadError(true);
      handleValidation();
    }
  };

  const generateRecommendationLogDownloadURL = (type?: Type) => {
    const size = Object.keys(payload).length;
    let url = undefined;
    let i = 1;

    if (isRequiredPayloadFilled) {
      url = `${endpoint}?`;

      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          const item = payload[key];
          const last = i === size;

          url += `${key}=${item}`;

          if (!last) url += '&';
        }
        i++;
      }

      if (type) {
        url += `&type_file=${type}`;
      }
    }

    return url;
  };

  const handleDownload = (e: MouseEvent<HTMLAnchorElement>) => {
    if (types && types.length > 1 && isRequiredPayloadFilled) {
      e.preventDefault();
      setShowDropdownDownloadLog.toggle();
    }
  };

  return (
    <>
      <LinkBox as="div">
        <ButtonLinkWithLogo mergeClass="mr-6" onClick={validateDownloadLog}>
          <div className="flex items-center">
            <i className="flex items-center justify-center text-size14 h-4 w-4 bg-center bg-download-icon mr-2"></i>
            <LinkOverlay
              href={generateRecommendationLogDownloadURL()}
              target="_blank"
              onClick={handleDownload}
            >
              Download {title}
            </LinkOverlay>
          </div>
        </ButtonLinkWithLogo>
        <When condition={types && !!types.length}>
          <ul
            className={`z-10 bg-white shadow-option_custom rounded-lg mt-4 absolute w-180px cursor-pointer overflow-hidden ${
              showDropdownDownloadLog ? 'block' : 'hidden'
            }`}
          >
            {types &&
              types.map((type, i) => (
                <li
                  className={`text-black text-size14 leading-17px font-bold px-4 py-3 hover:bg-calla_lily`}
                  key={i}
                >
                  <a
                    target="_blank"
                    href={generateRecommendationLogDownloadURL(type)}
                    rel="noopener noreferrer"
                  >
                    <span>Download as .{type}</span>
                  </a>
                </li>
              ))}
          </ul>
        </When>
      </LinkBox>
      <When condition={isDownloadError && !!requiredLabel?.length}>
        <Portal>
          <Alert
            variant="warning"
            dismiss={() => setIsDownloadError(false)}
            position="fixed"
            zIndex="1000"
            top="28px"
            right={{ base: '16px', md: '32px' }}
          >
            <Info fill="#F4A511" />
            <Text ml="10px" fontSize="12px" lineHeight="19px">
              {requiredLabel?.map((item, i) => (
                <strong key={i}>
                  {item}
                  {i < requiredLabel.length - 1 ? ', ' : ' '}
                </strong>
              ))}
              &nbsp;need to be selected before downloading {title}
            </Text>
          </Alert>
        </Portal>
      </When>
    </>
  );
};

export default DownloadLog;
