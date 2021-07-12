import { HStack, useRadioGroup } from '@chakra-ui/react';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import RadioCard from './radioCard';

type Props = {
  value: string;
  max: string;
  onChange: (string: string) => void;
};

const CustomInputRadio: React.FC<Props> = ({ value, max, onChange }) => {
  const options = [
    { value: formatEther(parseUnits(max, 18).mul(25).div(100)), label: '25%' },
    { value: formatEther(parseUnits(max, 18).mul(50).div(100)), label: '50%' },
    { value: formatEther(parseUnits(max, 18).mul(75).div(100)), label: '75%' },
    {
      value: formatEther(parseUnits(max, 18).mul(100).div(100)),
      label: '100%',
    },
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    value,
    onChange,
    name: 'amount',
  });

  const group = getRootProps();

  return (
    <HStack {...group} mt={3}>
      {options.map(({ label, value }) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={label} {...radio}>
            {label}
          </RadioCard>
        );
      })}
    </HStack>
  );
};

export default CustomInputRadio;
