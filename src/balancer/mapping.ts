import {log} from "@graphprotocol/graph-ts";
import {BalancerBPool as BPoolTemplate} from '../../generated/templates'
import {handleTransferGeneral, getProviderVersionChainKey} from "../util";
import {Transfer} from "../../generated/BalancerBFactory/BPool";
import {LOG_NEW_POOL} from "../../generated/BalancerBFactory/BFactory";

let PROVIDER_KEY = "balancer";
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
  log.warning("[{}] Creating factory tracking for pair address: {}", [PROVIDER_KEY, poolAddress.toHexString()])
  BPoolTemplate.create(poolAddress);
}

