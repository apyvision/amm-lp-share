import { Transfer } from '../../generated/ValueBFactory/FaaSPoolLite'
import { log } from "@graphprotocol/graph-ts";
import { LOG_NEW_POOL } from "../../generated/ValueBFactory/BFactory";
import { ValueBPool as BPoolTemplate } from '../../generated/templates'
import { handleTransferGeneral, getProviderVersionChainKey } from "../util";

let PROVIDER_KEY = "value";
let PROVIDER_VERSION = "v1";

export function handleTransfer(event: Transfer): void {
  handleTransferGeneral(
    getProviderVersionChainKey(PROVIDER_KEY, PROVIDER_VERSION),
    event,
    event.address,
    event.params.dst,
    event.params.src,
    event.params.amt);

}

export function handleNewPool(event: LOG_NEW_POOL): void {
  let poolAddress = event.params.pool;
  log.warning("[{}] Creating factory tracking for pair address: {}", [getProviderVersionChainKey(PROVIDER_KEY, PROVIDER_VERSION), poolAddress.toHexString()])
  BPoolTemplate.create(poolAddress);
}

