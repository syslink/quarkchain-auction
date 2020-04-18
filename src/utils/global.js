import React, { Component } from 'react';
import { Message, Notification } from '@alifd/next';
import Web3 from 'web3';
import QuarkChain from 'quarkchain-web3-beta';
import BigNumber from 'bignumber.js';
import * as Contracts from './contracts';

export const QuarkChainNetwork = QKC_EXPLORER;
export const QuarkChainRPC = QKC_JRPC;
export const InvalidAddr = '0x0000000000000000000000000000000000000000';
export const MetamaskErrorInfo = 'Please check whether MetaMask has been installed and login, or whether the website has been added to the trusted connections of MetaMask.';

export function initQkcWeb3() {
  if (window.web3) {
    qkcWeb3 = new Web3(window.web3);
    QuarkChain.injectWeb3(qkcWeb3, QuarkChainRPC);        
    Contracts.initContractObj(qkcWeb3).then(result => {
      console.log('initContractObj success');
    });
  } else {
    Message.warning('Please install Metamask firstly, or you could NOT send transaction to the chain.');  
  }
}

export function convertTokenName2Num(tokenName) {
  let number = new BigNumber(tokenName.toLowerCase(), 36);
  const len = tokenName.length;
  const plusNumber = new BigNumber('1'.repeat(len - 1) + '0', 36);
  return number.toNumber() + plusNumber.toNumber();
}

export function convertTokenNum2Name(tokenId) {
  let number = new BigNumber(tokenId);
  const len = number.toString(36).length;
  if (len > 2) {
    const minusNumber = new BigNumber('1'.repeat(len - 1) + '0', 36);
    number = number.minus(minusNumber);
  }

  return number.toString(36).toUpperCase();
}

Date.prototype.Format = function(fmt)   
{
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

export function displayDate(dateTime) {
  const date = new Date();
  date.setTime(dateTime * 1000);
  return date.Format('hh:mm:ss MM/dd/yyyy');
}

export function displayShortAddr(addr) {
  const simpleAddr = addr.substr(0, 12) + '...';
  return simpleAddr;
}

export function convert2BaseUnit(value) {
  return new BigNumber(value).shiftedBy(-18).toNumber();
}

export function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function displayErrorInfo(error) {
  Notification.config({placement: 'br'});
  Notification.open({
    title: 'Error',
    content: error,
    type: 'error',
    duration: 10000
  });
}

export function checkTxResult(successCallback) {

}

export function displayTxInfo(txId) {
  const content = <a href={QuarkChainNetwork + 'tx/' + txId} target='_blank'>Transaction has been sent successfully, please click here to check it.</a>;
  Notification.config({placement: 'br'});
  const key = Notification.open({
      title: 'Result of Transaction',
      content,
      type: 'success',
      duration: 0,
      onClick: () => { Notification.close(key); },
  });
}

export function displayReceiptSuccessInfo(txId) {
  const content = 'Transaction which id is ' + displayShortAddr(txId) + ' has been executed successfully, please click here to get the latest result.';
  Notification.config({placement: 'br'});
  const key = Notification.open({
      title: 'Receipt of Transaction',
      content,
      type: 'success',
      duration: 0,
      onClick: () => { Notification.close(key); window.location.reload(); },
  });
}

export function displayReceiptFailInfo(txId) {
  const content = <a href={QuarkChainNetwork + 'tx/' + txId} target='_blank'>
                    Transaction which id is ' + {displayShortAddr(txId)} + ' has been failed to execute, please click here to check the result.'
                  </a>;
  Notification.config({placement: 'br'});
  const key = Notification.open({
      title: 'Receipt of Transaction',
      content,
      type: 'success',
      duration: 0,
      onClick: () => { Notification.close(key); },
  });
}


export function displayWarningInfo(warning) {
  Notification.config({placement: 'br'});
  Notification.open({
    title: 'Warning',
    content: warning,
    type: 'warning',
    duration: 10000
  });
}

export let qkcWeb3 = null;
