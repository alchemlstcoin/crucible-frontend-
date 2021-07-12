import {
  CoinGeckoIcon,
  DiscordIcon,
  EtherscanIcon,
  GithubIcon,
  MistXIcon,
} from 'components/icons';

export const externalLinks = [
  {
    label: 'Discord',
    icon: DiscordIcon,
    href: 'http://discord.alchemist.wtf',
  },
  {
    label: 'Code',
    icon: GithubIcon,
    href: 'https://github.com/alchemistcoin/crucible-frontend',
  },
  {
    label: 'Etherscan',
    icon: EtherscanIcon,
    href: 'https://etherscan.io/token/0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab',
  },
  {
    label: 'MistX',
    icon: MistXIcon,
    href: 'http://swap-mist.alchemist.wtf/',
  },
  {
    label: 'CoinGecko',
    icon: CoinGeckoIcon,
    href: 'https://www.coingecko.com/en/coins/alchemist',
  },
];

export const internalLinks = [
  // {
  //   label: 'Home',
  //   to: '/',
  // },
  {
    label: 'Crucible minting',
    to: '/',
  },
  // {
  //   label: 'FAQs',
  //   to: '/faqs',
  // },
];
