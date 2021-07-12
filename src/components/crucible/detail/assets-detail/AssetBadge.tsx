import { Tag, TagLeftIcon, TagLabel, Tooltip } from '@chakra-ui/react';
import { FaUnlock } from 'react-icons/fa';
import { ERC20Token } from 'types';
import formatNumber from 'utils/formatNumber';

type Props = {
  asset: ERC20Token;
};

const AssetBadge: React.FC<Props> = ({ asset }) => {
  return (
    <Tooltip
      label={`${formatNumber.tokenFull(asset.value.amount, asset.decimals)} ${
        asset.symbol
      }`}
      placement='top'
    >
      <Tag bg='gray.50' color='gray.800' py={2} width='100%'>
        <TagLeftIcon boxSize='12px' as={FaUnlock} />
        <TagLabel>
          {formatNumber.tokenFull(asset.value.amount, asset.decimals)}{' '}
          <strong>{asset.symbol}</strong>
        </TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default AssetBadge;
