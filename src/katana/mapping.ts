/* eslint-disable prefer-const */
import {Transfer} from '../../generated/templates/KatanaPair/Pair'
import {handleTransferGeneral, getProviderVersionChainKey} from "../util";

export function handleTransfer(event: Transfer): void {
  handleTransferGeneral(
    "katana_v1_ronin",
    event,
    event.address,
    event.params.to,
    event.params.from,
    event.params.value);
}
