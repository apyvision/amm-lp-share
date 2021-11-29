import {
  Exception,
  LiquidityPosition,
  User,
  LiquidityPositionDayData,
  UserLPTransaction,
  TransactionTokenTransferred
} from "../generated/schema";
import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  ethereum,
  log,
  crypto,
  ByteArray,
  dataSource
} from "@graphprotocol/graph-ts/index";

import {ERC20} from "./ERC20";

import {integer, decimal, ZERO_ADDRESS} from '@protofire/subgraph-toolkit';

export let BI_18 = BigInt.fromI32(18);

export const META_TRANSACTION = 'executeMetaTransaction(address,bytes,bytes32,bytes32,uint8)';

/**
 * Process handleTransfer event
 * Create TransactionTokenTransferred, LiquidityPosition, LiquidityPositionDayData, Transfer
 *
 * Helper method, refactored from each src/provider/mapping.ts
 *
 * There are cases when the protocol mints additional tokens for their protocol, these should be discarded
 * Only the highest transaction amount should be recorded for a transaction
 *
 * @param {string}          providerKey               Provider Version Chain information as in PoolProviderKey.
 * @param {ethereum.Event}  event                     Common representation for Ethereum smart contract events.
 * @param {Address}         pool                      Related pool address.
 * @param {Address}         to                        To address.
 * @param {Address}         from                      From address.
 * @param {BigInt}          amount                    Amount defined in transfer event.
 */
export function handleTransferGeneral(
  providerKey: string,
  event: ethereum.Event,
  pool: Address,
  to: Address,
  from: Address,
  amount: BigInt): void {

  let initiator = correctInitiator(event.transaction)

  maybeCreateUserLpTransaction(event, initiator, pool, providerKey)

  if (from.toHexString() == ZERO_ADDRESS) { // MINT
    log.warning("[{}] MINT event for tx {} for user {} with amount {}", [providerKey, event.transaction.hash.toHexString(), to.toHexString(), amount.toString()])
    let amountToAdjust = maybeCreateHighestTransactionTokenTransferredEvent(event, from, to, amount, 'mint')
    let correctedTransactionAmount = amount.minus(amountToAdjust)
    let position = createOrUpdateLiquidityPosition(providerKey, pool, to, correctedTransactionAmount);
    createOrUpdateLiquidityPositionDayData(position, to, event);
  } else if (to.toHexString() == ZERO_ADDRESS) { // BURN
    log.warning("[{}] BURN event for tx {} for user {} with amount {}", [providerKey, event.transaction.hash.toHexString(), from.toHexString(), amount.toString()])
    let amountToAdjust = maybeCreateHighestTransactionTokenTransferredEvent(event, from, to, amount, 'burn')
    let correctedTransactionAmount = amount.minus(amountToAdjust)
    let position = createOrUpdateLiquidityPosition(providerKey, pool, from, correctedTransactionAmount.times(integer.NEGATIVE_ONE));
    createOrUpdateLiquidityPositionDayData(position, from, event);
  } else {
    createOrUpdateLiquidityPosition(providerKey, pool, from, BigInt.fromI32(0))
  }
}

export function createOrUpdateLiquidityPositionDayData(lp: LiquidityPosition, userAddress: Address, event: ethereum.Event): LiquidityPositionDayData {
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 86400
  let dayStartTimestamp = dayID * 86400
  let dayPairID = lp.id
    .concat('-')
    .concat(BigInt.fromI32(dayID).toString())
  let dayData = LiquidityPositionDayData.load(dayPairID)
  if (dayData === null) {
    dayData = new LiquidityPositionDayData(dayPairID)
    dayData.date = dayStartTimestamp
    dayData.poolProviderKey = lp.poolProviderKey
    dayData.poolAddress = lp.poolAddress
    dayData.userAddress = userAddress
  }

  dayData.balance = lp.balance
  dayData.balanceFromMintBurn = lp.balanceFromMintBurn
  dayData.save()

  return dayData as LiquidityPositionDayData
}

export function createOrUpdateLiquidityPosition(
  poolProviderKey: string,
  poolAddrs: Address,
  userAddrs: Address,
  addToMintBurnVal: BigInt): LiquidityPosition {


  let userId = userAddrs.toHexString()

  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
    user.save()
  }

  let id = poolAddrs
    .toHexString()
    .concat('-')
    .concat(userAddrs.toHexString())

  let lp = LiquidityPosition.load(id)

  if (lp === null) {
    log.warning('LiquidityPosition was not found, creating new one: {}', [id])
    lp = new LiquidityPosition(id)
    lp.poolAddress = poolAddrs
    lp.user = user.id
    lp.balanceFromMintBurn = decimal.ZERO
    lp.poolProviderKey = poolProviderKey
  }

  let mintBurnValToAdd = convertTokenToDecimal(addToMintBurnVal, BI_18);
  lp.balanceFromMintBurn = lp.balanceFromMintBurn.plus(mintBurnValToAdd);
  // TODO fix this to use the db
  lp.balance = BigDecimal.fromString('0')
  lp.save()

  return lp as LiquidityPosition
}

/**
 * Store the transaction, with type (burn/mint) for comparisons with later tokens transferred
 * There are cases when the protocol mints additional tokens for their protocol, these should be discarded
 * Only the highest transaction amount should be recorded for a transaction
 *
 * @param {ethereum.Event}  event   Full name of provider.
 * @param {Bytes}  from             Token from address.
 * @param {Bytes}  to               Token to address.
 * @param {BigInt}  value           Amount of the transaction.
 * @param {string}  transactionType mint/burn.
 *
 * @return {BigInt}   Uupdated positive amount if this type of transaction exists with a smaller value or Zero if not
 */
export function maybeCreateHighestTransactionTokenTransferredEvent(event: ethereum.Event, from: Bytes, to: Bytes, value: BigInt, transactionType: string): BigInt {
  let blockNum = event.block.number.toString()

  let id = blockNum
    .concat('-')
    .concat(event.address.toHexString())
    .concat('-')
    .concat(event.transaction.hash.toHexString())
    .concat('-')
    .concat(transactionType)

  let newDecimalValue = convertTokenToDecimal(value, BI_18);

  let transactionTokenTransferred = TransactionTokenTransferred.load(id)

  if (transactionTokenTransferred == null) {  // If record doesn't exist create it
    transactionTokenTransferred = new TransactionTokenTransferred(id)
    transactionTokenTransferred.from = from
    transactionTokenTransferred.to = to
    transactionTokenTransferred.transactionHash = event.transaction.hash;
    transactionTokenTransferred.value = newDecimalValue
    transactionTokenTransferred.previousValue = BigDecimal.fromString('0')
    transactionTokenTransferred.save()
    return integer.ZERO; // there is no adjustment neccessary, return 0
  } else {  // If transaction exists, compare the value with previous
    let previousDecimalValue: BigDecimal = transactionTokenTransferred.value;

    log.warning("FOUNDtransactionTokenTransferred created event for id {} tx {} value {} prevValue {} from {} to {}", [id, event.transaction.hash.toHexString(), newDecimalValue.toString(), previousDecimalValue.toString(), from.toHexString(), to.toHexString()])

    // Check if new value > previous highest value, if so record new value and return old
    if (newDecimalValue.gt(previousDecimalValue)) {
      transactionTokenTransferred.value = newDecimalValue
      transactionTokenTransferred.previousValue = previousDecimalValue
      transactionTokenTransferred.save()
      log.warning("NEWGTPREVtransactionTokenTransferred created event for id {} tx {} value {} prevValue {} from {} to {}", [id, event.transaction.hash.toHexString(), newDecimalValue.toString(), previousDecimalValue.toString(), from.toHexString(), to.toHexString()])
      return decimal.toBigInt(previousDecimalValue, 18)
    }
  }

  return integer.ZERO;

}

/**
 * Create LiquidityPosition entity with data or update if exists
 *
 * Amount and amount added to this function
 * Where record exists and smallerAmount is > 0 minus this and add the original
 *
 */
export function maybeCreateUserLpTransaction(
  event: ethereum.Event,
  userAddrs: Address,
  poolAddrs: Address,
  poolProviderKey: string): void {

  let userId = userAddrs.toHexString()

  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
    user.save()
  }

  let id = userAddrs.toHexString()
    .concat('-')
    .concat(poolAddrs.toHexString())
    .concat('-')
    .concat(event.block.number.toString())

  let userLPTransaction = UserLPTransaction.load(id)

  if (userLPTransaction === null) {
    userLPTransaction = new UserLPTransaction(id)
    userLPTransaction.user = user.id
    userLPTransaction.poolAddress = poolAddrs
    userLPTransaction.poolProviderKey = poolProviderKey
    userLPTransaction.transactionHash = event.transaction.hash
    userLPTransaction.blockNumber = event.block.number
    userLPTransaction.timestamp = event.block.timestamp
    userLPTransaction.save()
  }
}


// Get correct initiator/from address
// Where executeMetaTransaction is called, Transaction.from is the relayer address, not actual initiator
// In this instance, extract correct initiator from transaction.input data
export function correctInitiator(transaction: ethereum.Transaction): Address {

  let bytes = transaction.input.toHex();
  let methodHash = bytes.slice(0, 10);

  if (methodHash == encodeMethodSignature(META_TRANSACTION)) {
    let input = transaction.input.toHexString();
    let address = Address.fromString(toHex(input.slice(34, 74)));
    return address;
  } else {
    return transaction.from;
  }

}

export function toHex(bytes: string): string {
  return '0x' + bytes;
}

export function encodeMethodSignature(methodSignature: string): string {
  return crypto.keccak256(ByteArray.fromUTF8(methodSignature)).toHex().slice(0, 10);
}

/**
 * Return a consistent name in style of PoolProviderKey based on passed in provider, version and the network defined in subgraph.yaml
 *
 * @param {string}  provider   Full name of provider.
 * @param {BigInt}  version    Version of provider's protocol.
 *
 * @return {string}   Values concatenated with an underscore matching PoolProviderKey.
 */
export function getProviderVersionChainKey(provider: string, version: string): string {

  let chainKey: string;

  if (dataSource.network() == 'mainnet') {
    chainKey = "eth";
  } else if (dataSource.network() == 'arbitrum-one') {
    chainKey = "arbitrum";
  } else {  // Typically same name, add another conditional if not
    chainKey = dataSource.network();
  }

  return provider
    .concat('_')
    .concat(version)
    .concat('_')
    .concat(chainKey);

}


export function createException(addrs: Bytes, txHash: Bytes, message: string): void {
  let exception = new Exception(txHash.toHexString())
  exception.addrs = addrs
  exception.txHash = txHash
  exception.message = message
  exception.save()
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1');
  for (let i = integer.ZERO; i.lt(decimals as BigInt); i = i.plus(integer.ONE)) {
    bd = bd.times(BigDecimal.fromString('10'));
  }
  return bd;
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == integer.ZERO) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function getBalanceOf(poolAddrs: Address, userAddrs: Address): BigDecimal {

  log.warning("getBalanceOf poolAddrs {} with userAddrs {}", [poolAddrs.toHexString(), userAddrs.toHexString()])

  let callResult = ERC20.bind(poolAddrs).try_balanceOf(userAddrs);

  let balance = callResult.reverted ? BigInt.fromI32(0) : callResult.value;

  if (callResult.reverted) {
    log.warning("getBalanceOf reverted poolAddrs {} with userAddrs {}", [poolAddrs.toHexString(), userAddrs.toHexString()])
  }

  return convertTokenToDecimal(balance, BI_18);
}
