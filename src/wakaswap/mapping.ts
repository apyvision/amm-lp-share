/* eslint-disable prefer-const */
import { Transfer } from '../../generated/templates/WakaswapPair/Pair'
import { handleTransferGeneral, getProviderVersionChainKey } from "../util";

let PROVIDER_KEY = "wakaswap";
let PROVIDER_VERSION = "v1";

export function handleTransfer(event: Transfer): void {
  handleTransferGeneral(
    getProviderVersionChainKey(PROVIDER_KEY, PROVIDER_VERSION),
    event,
    event.address,
    event.params.to,
    event.params.from,
    event.params.value);

}
