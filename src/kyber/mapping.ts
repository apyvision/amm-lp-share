/* eslint-disable prefer-const */
import {Transfer} from "../../generated/templates/KyberPool/Pool";

import { handleTransferGeneral, getProviderVersionChainKey } from "../util";

let PROVIDER_KEY = "kyber";
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
