import * as abiUtil from 'ethereumjs-abi';
import {AbiCoder as EthersAbiCoder} from 'ethers/utils/abi-coder';
import { Notification } from '@alifd/next';
import BigNumber from 'bignumber.js';
import * as qkcRpc from './quarkchainRPC';
import * as tools from './global';

const GeneralNativeTokenManagerABI = [{"inputs":[{"internalType":"address","name":"_supervisor","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"},{"internalType":"uint128","name":"gasPrice","type":"uint128"}],"name":"calculateGasPrice","outputs":[{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"}],"name":"depositGasReserve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint128","name":"","type":"uint128"},{"internalType":"address","name":"","type":"address"}],"name":"gasReserveBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint128","name":"","type":"uint128"}],"name":"gasReserves","outputs":[{"internalType":"address","name":"admin","type":"address"},{"internalType":"uint64","name":"refundPercentage","type":"uint64"},{"components":[{"internalType":"uint128","name":"numerator","type":"uint128"},{"internalType":"uint128","name":"denominator","type":"uint128"}],"internalType":"struct GeneralNativeTokenManager.Fraction","name":"exchangeRate","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minGasReserveInit","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minGasReserveMaintain","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint128","name":"","type":"uint128"},{"internalType":"address","name":"","type":"address"}],"name":"nativeTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"},{"internalType":"uint128","name":"gas","type":"uint128"},{"internalType":"uint128","name":"gasPrice","type":"uint128"}],"name":"payAsGas","outputs":[{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"payGasCaller","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"},{"internalType":"uint128","name":"rateNumerator","type":"uint128"},{"internalType":"uint128","name":"rateDenominator","type":"uint128"}],"name":"proposeNewExchangeRate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"registerToken","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint128","name":"","type":"uint128"}],"name":"registeredTokens","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registrationRequired","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bool","name":"req","type":"bool"}],"name":"requireTokenRegistration","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_payGasCaller","type":"address"}],"name":"setCaller","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"_minGasReserveMaintain","type":"uint128"},{"internalType":"uint128","name":"_minGasReserveInit","type":"uint128"}],"name":"setMinGasReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"},{"internalType":"uint64","name":"refundPercentage","type":"uint64"}],"name":"setRefundPercentage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"supervisor","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newSupervisor","type":"address"}],"name":"updateSupervisor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"}],"name":"withdrawGasReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"}],"name":"withdrawNativeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const NonReservedNativeTokenManagerABI = [{"inputs":[{"internalType":"address","name":"_supervisor","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint128","name":"newTokenId","type":"uint128"}],"name":"AuctionEnded","type":"event"},{"constant":true,"inputs":[],"name":"auctionParams","outputs":[{"internalType":"uint128","name":"duration","type":"uint128"},{"internalType":"uint64","name":"minIncrementInPercent","type":"uint64"},{"internalType":"uint64","name":"minPriceInQKC","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"},{"internalType":"uint128","name":"price","type":"uint128"},{"internalType":"uint64","name":"round","type":"uint64"}],"name":"bidNewToken","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"endAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAuctionState","outputs":[{"internalType":"uint128","name":"","type":"uint128"},{"internalType":"uint128","name":"","type":"uint128"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint128","name":"","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"}],"name":"getNativeTokenInfo","outputs":[{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mintNewToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint128","name":"","type":"uint128"}],"name":"nativeTokens","outputs":[{"internalType":"uint64","name":"createAt","type":"uint64"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"totalSupply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pauseAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"resumeAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint64","name":"_minPriceInQKC","type":"uint64"},{"internalType":"uint64","name":"_minIncrementInPercent","type":"uint64"},{"internalType":"uint64","name":"_duration","type":"uint64"}],"name":"setAuctionParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"supervisor","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newSupervisor","type":"address"}],"name":"updateSupervisor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint128","name":"tokenId","type":"uint128"},{"internalType":"bool","name":"whitelisted","type":"bool"}],"name":"whitelistTokenId","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint128","name":"","type":"uint128"}],"name":"whitelistedTokenId","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const GeneralNativeTokenManagerAddrs = ['0x6C548FF86953CF08FC03C801833bBAb17136ff4A00000000',
                                        '0x14bB36d8DEf89ef0AD93b102110eA3A941bA7f970001524a',
                                        '0x706C609Aa89187939e45907Fe22Baf32EB9133340002524A',
                                        '0xD8c24E95A6872CE7Eb22B5A1b45a8328143a4e080003524a',
                                        '0x09d185ccA81Af057F38dF31991D9A3e47F7086d00004524a',
                                        '0x2556094C08b142419F0507D54B8F1280652175E20005524a',
                                        '0xE8caC7d795e717643626cc2f01cC873155126E450006524a',
                                        '0x9AE5cFACA7Ec65424186a10dbB96EE34Ff832F530007524A'];
const NonReservedNativeTokenManagerAddr = '0x514b43000000000000000000000000000000000200000000';

function getContractPayload (funcName, parameterTypes, parameterValues) {
  return '0x' + abiUtil.methodID(funcName, parameterTypes).toString('hex') + abiUtil.rawEncode(parameterTypes, parameterValues).toString('hex');
}

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

function parseResult(outputs, bytes) {
  if (Array.isArray(outputs) && outputs.length === 0) {
    throw new Error('Empty outputs array given!');
  }

  if (!bytes || bytes === '0x' || bytes === '0X') {
      throw new Error(`Invalid bytes string given: ${bytes}`);
  }

  const ethersAbiCoder = new EthersAbiCoder()
  const result = ethersAbiCoder.decode(outputs, bytes);
  let returnValues = {};
  let decodedValue;

  if (Array.isArray(result)) {
    if (outputs.length > 1) {
      outputs.forEach((output, i) => {
        decodedValue = result[i];

        if (decodedValue === '0x') {
          decodedValue = null;
        }
        returnValues[i] = decodedValue;
        if (isObject(output) && output.name) {
          returnValues[output.name] = decodedValue;
        }
      });
      return returnValues;
    }

    return result;
  }
}

function buildContractObj(networkId, qkcWeb3, myContract, contractAbi, contractAddress) {
  contractAbi.map((interfaceInfo, index) => {
    if (interfaceInfo.type === 'function') {
      const funcName = interfaceInfo.name;
      const parameterTypes = [];
      for (const input of interfaceInfo.inputs) {
        parameterTypes.push(input.type);
      }

      if (interfaceInfo.constant) {
        myContract[funcName] = (parameterValues, fullShardKey) => {
          if (fullShardKey == null) {
            fullShardKey = myContract.fullShardKey;
          }
          if (parameterValues == null) {
            parameterValues = [];
          }
          if (!(parameterValues instanceof Array)) {
            parameterValues = [parameterValues];
          }
          const payload = getContractPayload(funcName, parameterTypes, parameterValues);
          const txParams = {
            from: myContract.fromAddr + fullShardKey,
            to: contractAddress,
            gasPrice: '0x3b9aca00',
            gas: '0x2dc6c0',
            value: '0x0',
            data: payload,
            gasTokenId: '0x8bb0',
            transferTokenId: '0x8bb0',
            networkId,
          };
          return qkcRpc.call(txParams, 'latest').then(ret => {
            if (ret != null) {
              ret = parseResult(interfaceInfo.outputs, ret);
            }
            if (ret != null && ret.length == 1) {
              ret = ret[0];
            }
            return ret;
          }).catch(error => {
            console.log(error);
          });
        }
        
      } else {
        myContract[funcName] = (parameterValues, {transferTokenId, transferAmount, fullShardKey}) => {
          if (myContract.fromAddr == tools.InvalidAddr) {
            return new Promise(function(resolve, reject) {
              reject(new Error(tools.MetamaskErrorInfo));
            })
          }
          if (parameterValues == null) {
            parameterValues = [];
          }
          if (!(parameterValues instanceof Array)) {
            parameterValues = [parameterValues];
          }
          const payload = getContractPayload(funcName, parameterTypes, parameterValues);
          let value = '0x0';
          if (transferAmount != null && transferAmount.gt(new BigNumber(0))) {
            transferAmount = transferAmount.shiftedBy(18);
            value = '0x' + transferAmount.toString(16);
          }
          if (fullShardKey == null) {
            fullShardKey = myContract.fullShardKey;
          }
          if (transferTokenId == null) {
            transferTokenId = '0x8bb0';
          } else {
            transferTokenId = '0x' + new BigNumber(transferTokenId).toString(16);
          }
          const txParams = {
            from: myContract.fromAddr + fullShardKey,
            to: contractAddress,
            fromFullShardKey: '0x' + fullShardKey,
            toFullShardKey: '0x' + fullShardKey,
            gasPrice: '0x3b9aca00',
            gas: '0x2dc6c0',
            value,
            data: payload,
            gasTokenId: '0x8bb0',
            transferTokenId,
            networkId,
          };
          return qkcWeb3.qkc.sendTransaction(txParams).then((transactionId) => {
            return transactionId;           
          }).catch(error => {
            throw error;
          });
        }
      }
    }
  }
  );
}

async function initContractObj (qkcWeb3) {
  if (Status.StartInit) {
    while (!Status.InitSuccess)
    {
      console.log('sleep for waitting init.');
      await tools.sleep(1000);
    }
    return true;
  };
  console.log('start to init.');
  Status.StartInit = true;
  if (Status.InitSuccess) return true;
  const networkInfo = await qkcRpc.getNetworkId();
  const networkId = networkInfo.networkId;
  const accounts = await qkcWeb3.eth.getAccounts();
  if (accounts == null || accounts.length == 0) {
    tools.displayErrorInfo(tools.MetamaskErrorInfo);
    generateContractInterface(qkcWeb3, networkId, tools.InvalidAddr);
    Status.InitSuccess = true;
    return false;
  }

  generateContractInterface(qkcWeb3, networkId, accounts[0]);
  Status.InitSuccess = true;
  return true;
}

function generateContractInterface(qkcWeb3, networkId, account) {
  NonReservedNativeTokenManager.fromAddr = account;

  NonReservedNativeTokenManager.fullShardKey = '00000000';

  for (let i = 0; i < 8; i++) {
    GeneralNativeTokenManagers[i] = new Object();
    GeneralNativeTokenManagers[i].fromAddr = account;
    const contractAddr = GeneralNativeTokenManagerAddrs[i];
    GeneralNativeTokenManagers[i].fullShardKey = contractAddr.substr(contractAddr.length - 8);
    buildContractObj(networkId, qkcWeb3, GeneralNativeTokenManagers[i], GeneralNativeTokenManagerABI, contractAddr);
  }
  console.log(GeneralNativeTokenManagers);
  buildContractObj(networkId, qkcWeb3, NonReservedNativeTokenManager, NonReservedNativeTokenManagerABI, NonReservedNativeTokenManagerAddr);
  console.log(NonReservedNativeTokenManager);
}

export const GeneralNativeTokenManagers = new Array(8);
export const NonReservedNativeTokenManager = new Object();

export const Status = {StartInit: false, InitSuccess: false};

export { initContractObj }