/* eslint-disable prefer-const */
import { Transfer } from '../../generated/templates/OneInchPair/Pair'
import { handleTransferGeneral, getProviderVersionChainKey } from "../util";

let PROVIDER_KEY = "oneinch";
let PROVIDER_VERSION = "v2";

export function handleTransfer(event: Transfer): void {
  handleTransferGeneral(
    getProviderVersionChainKey(PROVIDER_KEY, PROVIDER_VERSION),
    event,
    event.address,
    event.params.to,
    event.params.from,
    event.params.value);

}
