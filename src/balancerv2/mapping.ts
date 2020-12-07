/* eslint-disable prefer-const */
import { Transfer as WeightedTransfer } from '../../generated/WeightedPoolFactory/WeightedPool'
import { Transfer as StableTransfer } from '../../generated/StablePoolFactory/StablePool'
import { handleTransferGeneral, getProviderVersionChainKey} from "../util";

let PROVIDER_KEY = "balancer";
let PROVIDER_VERSION = "v2";

export function handleTransferWeighted(event: WeightedTransfer): void {
  handleTransferGeneral(
    getProviderVersionChainKey(PROVIDER_KEY, PROVIDER_VERSION),
    event,
    event.address,
    event.params.to,
    event.params.from,
    event.params.value);
}

export function handleTransferStable(event: StableTransfer): void {
  handleTransferGeneral(
    getProviderVersionChainKey(PROVIDER_KEY, PROVIDER_VERSION),
    event,
    event.address,
    event.params.to,
    event.params.from,
    event.params.value);
}
