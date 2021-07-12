import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { store } from 'store/store';

const { config } = store.getState().config;

const { supportedNetworks, appName, portisApiKey } =
  store.getState().config.commonConfig;

export const injectedConnector = new InjectedConnector({
  supportedChainIds: supportedNetworks,
});

export const walletconnectConnector = new WalletConnectConnector({
  rpc: {
    1: config[1].rpcUrl,
    4: config[4].rpcUrl,
    5: config[5].rpcUrl,
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
});

export const portisConnector = new PortisConnector({
  dAppId: portisApiKey,
  networks: supportedNetworks,
});

export const walletlinkConnector = new WalletLinkConnector({
  url: config[1].rpcUrl,
  appName,
});
