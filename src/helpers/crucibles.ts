import { BigNumber, BigNumberish, ethers } from 'ethers';
import { crucibleFactoryAbi } from 'abi/crucibleFactoryAbi';

function convertTokenIdToAddress(tokenId: BigNumberish) {
  let id = BigNumber.from(tokenId).toHexString();
  if (id.length < 42) {
    id = '0x' + id.slice(2).padStart(40, '0');
  }
  return id;
}

function getCrucibleIdsFromEvents(events: ethers.Event[]) {
  const handledIds = new Set();
  const crucibleIds = [];
  for (const event of events) {
    if (!event.args || !event.args.tokenId) {
      console.error(`Missing tokenId arg`, event);
      continue;
    }
    const id = convertTokenIdToAddress(event.args.tokenId);
    if (!handledIds.has(id)) {
      handledIds.add(id);
      crucibleIds.push({ id, event });
    }
  }
  return crucibleIds;
}

async function getOwnedCrucibles(
  crucibleFactoryAddress: string,
  signer: any,
  provider: any
) {
  const address = await signer.getAddress();
  const crucibleFactory = new ethers.Contract(
    crucibleFactoryAddress,
    crucibleFactoryAbi,
    signer
  );

  const filter = crucibleFactory.filters.Transfer(null, address);
  const crucibleEvents = await crucibleFactory.queryFilter(filter, 0, 'latest');
  const ids = getCrucibleIdsFromEvents(crucibleEvents);

  const crucibles = await Promise.all(
    ids.map(async ({ id, event }) => {
      const ownerPromise = crucibleFactory.ownerOf(id);
      // TODO get the block in which the crucible was actually minted, not the block it was transferred to the latest owner
      const blockPromise = provider.getBlock(event.blockNumber);

      const [owner, block] = await Promise.all([ownerPromise, blockPromise]);

      return {
        id,
        owner,
        mintTimestamp: block.timestamp,
      };
    })
  );

  return crucibles.filter((crucible) => {
    return crucible.owner === address;
  });
}

export default getOwnedCrucibles;
