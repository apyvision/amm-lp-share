/* eslint-disable prefer-const */
import {
  handleTransferGeneral, getProviderVersionChainKey,
} from "../util";
import {Transfer} from "../../generated/templates/PancakePair/Pair";

let PROVIDER_KEY = "pancakeswap";
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

