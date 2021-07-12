import React from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import { parseUnits } from 'ethers/lib/utils';
import { useMeasure } from 'hooks/useMeasure';
import { sanitize } from 'utils/sanitize';
import CustomInputRadio from './customInputRadio';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function removeExcessDecimals(string: string) {
  if (string.includes('.')) {
    const splitArray = string.split('.');
    const preDecimal = splitArray[0];
    const postDecimal = splitArray[1];
    const postDecimalLength = postDecimal.length;
    if (postDecimalLength <= 18) {
      return string;
    }
    return preDecimal + '.' + postDecimal.substring(0, 18);
  } else {
    return string;
  }
}

interface Props extends InputProps {
  max: string;
  value: string;
  showRadioGroup?: boolean;
  showMaxButton?: boolean;
  maxButtonVariant?: string;
  inputRightElement?: React.ReactElement;
  inputRef?: React.RefObject<HTMLInputElement>;
  onUserInput: (value: string) => void;
}

// TODO: Pass token decimals
const CustomInput: React.FC<Props> = ({
  max,
  value,
  showRadioGroup,
  showMaxButton,
  maxButtonVariant,
  inputRightElement,
  onUserInput,
  placeholder,
  inputRef,
  ...rest
}) => {
  const [measureRef, { width }] = useMeasure();

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(removeExcessDecimals(nextUserInput));
    }
  };

  return (
    <>
      <InputGroup alignItems='center'>
        <Input
          ref={inputRef}
          value={value}
          onChange={(event) => {
            enforcer(event.target.value.replace(/,/g, '.'));
          }}
          // universal input options
          inputMode='decimal'
          autoComplete='off'
          autoCorrect='off'
          // text-specific options
          type='text'
          pattern='^[0-9]*[.,]?[0-9]*$'
          placeholder={placeholder || '0.0'}
          minLength={1}
          maxLength={76}
          spellCheck='false'
          size='lg'
          borderRadius='xl'
          pr={showMaxButton || inputRightElement ? `${width + 16}px` : '0'}
          isInvalid={parseUnits(sanitize(value), 18).gt(parseUnits(max, 18))}
          {...rest}
        />
        {(showMaxButton || inputRightElement) && (
          <InputRightElement
            top='unset'
            width='auto'
            right='0.5rem'
            ref={measureRef as any}
          >
            <Stack direction='row' alignItems='center'>
              {showMaxButton && (
                <Button
                  size='sm'
                  variant={maxButtonVariant || 'ghost'}
                  onClick={() => onUserInput(max)}
                >
                  Max
                </Button>
              )}
              {inputRightElement}
            </Stack>
          </InputRightElement>
        )}
      </InputGroup>
      {showRadioGroup && (
        <CustomInputRadio value={value} max={max} onChange={onUserInput} />
      )}
    </>
  );
};

export default CustomInput;
