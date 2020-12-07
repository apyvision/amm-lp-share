import {BPool, LOG_EXIT, LOG_JOIN} from '../../generated/BPool/BPool'
import {LiquidityPosition, User} from '../../generated/schema'
import {Address, BigDecimal, BigInt, log} from "@graphprotocol/graph-ts";
import {LOG_NEW_POOL} from "../../generated/BFactory/BFactory";

let BI_18 = BigInt.fromI32(18)
let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)

function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

function getLpId(poolAddress: Address, userAddress: Address): string {
  return poolAddress.toHexString().concat('-').concat(userAddress.toHexString());
}

export function handleNewPool(event: LOG_NEW_POOL): void {
  let poolAddress = event.params.pool;
  let tx = event.transaction.hash.toHexString();
  let userAddrs = event.transaction.from;
  logMintEvent(poolAddress, tx, userAddrs);
}

export function handleJoin(event: LOG_JOIN): void {
  let poolAddress = event.address;
  let tx = event.transaction.hash.toHexString();
  let userAddrs = event.transaction.from;
  logMintEvent(poolAddress, tx, userAddrs);
}

function logMintEvent(poolAddress: Address, tx: string, userAddrs: Address): void {
  let sym = BPool.bind(poolAddress).symbol();
  log.info("Sym is: {} and tx is: {}", [sym, tx])
  if (sym == "BPT" || sym == "VLP") {
    let userId = userAddrs.toHex()

    log.info("event caller is: {}, tx is: {}", [userId, tx])

    let user = User.load(userId)
    if (user == null) {
      user = new User(userId)
      user.save()
    }

    let lpId = getLpId(poolAddress, userAddrs)
    let lp = LiquidityPosition.load(lpId)
    if (lp == null) {
      lp = new LiquidityPosition(lpId)
      lp.user = user.id
      lp.poolProviderName = sym == "BPT" ? "Balancer" : "YFV"
    }
    lp.poolAddress = poolAddress
    lp.balance = convertTokenToDecimal(BPool.bind(poolAddress).balanceOf(userAddrs), BI_18)
    lp.save()
  }
}


export function handleBurn(event: LOG_EXIT): void {
  let poolAddress = event.address;
  let sym = BPool.bind(poolAddress).symbol();
  let tx = event.transaction.hash.toHexString();

  log.info("Sym is: {} and tx is: {}", [sym, tx])

  if (sym == "BPT" || sym == "VLP") {
    let userAddrs = event.transaction.from;
    let userId = userAddrs.toHex()

    log.info("event caller is: {}, tx is: {}", [userId, tx])

    let user = User.load(userId)
    if (user == null) {
      user = new User(userId)
      user.save()
    }

    let lpId = getLpId(poolAddress, userAddrs)
    let lp = LiquidityPosition.load(lpId)
    if (lp == null) {
      lp = new LiquidityPosition(lpId)
      lp.user = user.id
      lp.poolProviderName = sym == "BPT" ? "Balancer" : "YFV"
    }
    lp.poolAddress = poolAddress
    lp.balance = convertTokenToDecimal(BPool.bind(poolAddress).balanceOf(userAddrs), BI_18)
    lp.save()
  }

}

