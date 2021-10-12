/* eslint-disable prefer-const */
import {Transfer} from '../../generated/templates/KingdomsPair/Pair'
import {handleTransferGeneral, getProviderVersionChainKey} from "../util";

export function handleTransfer(event: Transfer): void {
  handleTransferGeneral(
    "kingdoms_v1_harmony",
    event,
    event.address,
    event.params.to,
    event.params.from,
    event.params.value);
}
