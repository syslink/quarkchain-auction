import React, { Component } from 'react';
import styles from './index.module.scss';
import { Input, Button, Dialog, Message, Notification } from '@alifd/next';
import { qkcWeb3, convertTokenName2Num } from '../../../../utils/global';
import * as Contracts from '../../../../utils/contracts';
import * as tool from '../../../../utils/global';
import BigNumber from 'bignumber.js';

const money = require('./images/$.png');
const bidder = require('./images/bidder.png');
const bidtime = require('./images/bidtime.png');
const id = require('./images/ID.png');
const leftime = require('./images/leftime.png');
const jiantou = require('./images/jiantou.png');
const confirm = require('./images/confirm.png');

export default class Banner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkImgVisible: false,
      paused: false,
      start: false,
      curAccount: '',
      curRound: 0,
      sameRound: true,
      balance: 0,
      bidPrice: 0,
      highestBidderIsMe: false,
      remainBalance: 0,
      auctionParams: {duration: 0, minIncrementInPercent: 0, minPriceInQKC: 0},
      auctionStateInfo: {tokenId:0, highestBid:0, addrOfHighestBid:'0x', round:0, endTime:0},
      pausedColor: 'rgb(203,203,203)',
      confimationFooter: (<view style={{marginRight: '40px', marginBottom: '80px'}}>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({confimationVisible: false})}>                  
          Cancel
        </Button>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF'}} onClick={this.bidNewToken.bind(this)}>                  
          OK
        </Button>
      </view>),
    };
  }
  
  componentDidMount = async () => {
    await Contracts.initContractObj(tool.qkcWeb3);
    const auctionParams = await Contracts.NonReservedNativeTokenManager.auctionParams();
    console.log(auctionParams);
    auctionParams.duration = auctionParams[0].toNumber();
    auctionParams.minIncrementInPercent = auctionParams[1].toNumber();
    auctionParams.minPriceInQKC = auctionParams[2].toNumber();

    const auctionState = await Contracts.NonReservedNativeTokenManager.getAuctionState();
    console.log(auctionState);
    auctionState.tokenId = auctionState[0].toNumber();
    auctionState.highestBid = new BigNumber(auctionState[1].toHexString()).shiftedBy(-18).toNumber();
    auctionState.addrOfHighestBid = auctionState[2];
    auctionState.round = auctionState[3].toNumber();
    auctionState.endTime = auctionState[4].toNumber();

    let start = false;
    let paused = false;
    let curRound = auctionState.round;
    if (auctionState.endTime > 946656000) {  // 946656000=2000/1/1, 小于此值说明处于第0轮,或者是调用了endAuction，round不需要变更
      const bEnd = this.isOutOfTime(auctionState.endTime);
      if (bEnd) {  // 已经过了终止时间，round需要加1
        curRound++;
        this.state.sameRound = false;
      }
      start = !bEnd;
      paused = start && await Contracts.NonReservedNativeTokenManager.isPaused();
    }

    this.setState({auctionStateInfo: auctionState, start, paused, curRound, auctionParams});

    qkcWeb3.eth.getAccounts().then(accounts => {
      this.setState({curAccount : accounts[0]});
    });  
  }

  isOutOfTime = (endTime) => {
    const now = new Date().getTime();
    return now > endTime * 1000;
  }

  changeBidPrice = (v) => {
    this.state.bidPrice = v;
  }

  changeTokenName = (v) => {
    this.state.tokenName = v;
    this.setState({checkImgVisible: false});
  }

  check = () => {
    const valid = /[0-9A-Z]{5,12}$/.test(this.state.tokenName);
    if (!valid) {
      tool.displayErrorInfo('Token name only can be a mix of capital letters and numbers with length between 5 and 12.');
      return;
    }

    const tokenId = tool.convertTokenName2Num(this.state.tokenName);
    Contracts.NonReservedNativeTokenManager.getNativeTokenInfo([tokenId]).then(tokenInfo => {
      console.log(tokenInfo);
      tokenInfo.createTime = tokenInfo[0].toNumber();
      tokenInfo.owner = tokenInfo[1];
      tokenInfo.totalSupply = tokenInfo[2];
      this.setState({checkImgVisible: tokenInfo.createTime == 0});
      if (tokenInfo.createTime > 0) {
        Notification.config({placement: 'br'});
        Notification.open({
          title: 'Warning',
          content: 'Token name has been auctioned and can not be auctioned again.',
          type: 'warning',
          duration: 0
        });
      }
    });
  }

  bidNow = () => {
    const valid = /[0-9A-Z]{5,12}$/.test(this.state.tokenName);
    if (!valid) {
      Notification.config({placement: 'br'});
      Notification.open({
        title: 'Error',
        content: 'Token name only can be a mix of capital letters and numbers with length between 5 and 12.',
        type: 'error',
        duration: 0
      });
      return;
    }
    this.state.highestBidderIsMe = this.state.auctionStateInfo.addrOfHighestBid == this.state.curAccount;
   
    Contracts.NonReservedNativeTokenManager.balances(this.state.curAccount).then(balance => {
      const bidPrice = new BigNumber(this.state.bidPrice).shiftedBy(18);
      balance = new BigNumber(balance.toHexString(), 16);
      if (this.state.highestBidderIsMe && !this.state.sameRound) {
        balance = balance.minus(new BigNumber(this.state.auctionStateInfo.highestBid).shiftedBy(18));
      }

      let remainBalance = balance.minus(bidPrice.toNumber());
      
      if (remainBalance.gte(0)) {
        remainBalance = 0;
      } else {
        remainBalance = remainBalance.abs().shiftedBy(-18).toString(10);
      }
      this.setState({balance: balance.shiftedBy(-18).toString(10), remainBalance, confimationVisible: true});
    });
  }

  bidNewToken = () => {
    const tokenId = convertTokenName2Num(this.state.tokenName);
    const bidPrice = '0x' + new BigNumber(this.state.bidPrice).shiftedBy(18).toString(16);
    Contracts.NonReservedNativeTokenManager.bidNewToken([tokenId, bidPrice, this.state.curRound],
      {transferAmount: new BigNumber(this.state.remainBalance)}).then(txId => {
        console.log(txId);
        this.setState({confimationVisible: false});
        if (new BigNumber(txId, 16).toNumber() == 0) {
          tool.displayErrorInfo('Fail to send transaction.');
        } else {
          this.setState({mintTokenVisible: false});
          Notification.config({placement: 'br'});
          Notification.open({
              title: 'Result of Transaction',
              content:
              <a href={'https://devnet.quarkchain.io/tx/' + txId} target='_blank'>Transaction has been sent successfully, please click here to check it.</a>,
              type: 'success',
              duration: 0
          });
        }
      }).catch(error => {
        if (error.code == 4001) return;
        tool.displayErrorInfo(error);
      });
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>#{this.state.curRound} Round Token Auction</div>
  
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={money} className={styles.imgItem}/>
              <div className={styles.desc}>Highest Bid:</div>
            </li>
            <div className={styles.value}>{this.state.start ? (this.state.auctionStateInfo.highestBid + ' QKC') : 'N / A'}</div>
          </li>
  
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={id} className={styles.imgItem}/>
              <div className={styles.desc}>Proposed Name:</div>
            </li>
            <div className={styles.value}>{this.state.start ? tool.convertTokenNum2Name(this.state.auctionStateInfo.tokenId) : 'N / A'}</div>
          </li>
          
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={leftime} className={styles.imgItem}/>
              <div className={styles.desc}>Time Left:</div>
            </li>
            <div className={styles.value}>{this.state.start ? tool.displayDate(this.state.auctionStateInfo.endTime) : 'N / A'}</div>
          </li>
  
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={bidder} className={styles.imgItem}/>
              <div className={styles.desc}>Highest Bidder:</div>
            </li>
            <div className={styles.value}>{this.state.start ? tool.displayShortAddr(this.state.auctionStateInfo.addrOfHighestBid) : 'N / A'}</div>
          </li>
  
          {/* <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={bidtime} className={styles.imgItem}/>
              <div className={styles.desc}>Highest Bidding Time:</div>
            </li>
            <div className={styles.value}>{this.state.start ? tool.displayData(this.state.auctionStateInfo.timeOfHighestBid) : 'N / A'}</div>
          </li> */}
          
          <li className={styles.bidInfo}>
            <Input disabled={this.state.paused} style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', width: '250px', height: '25px'}} 
                   placeholder="Token Name" onChange={this.changeTokenName.bind(this)}/>
            {
              this.state.checkImgVisible ? 
                <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: 'transparent', 
                  width: '250px', height: '60px', fontSize: '20px', color: '#00C4FF'
                  }} onClick={this.check.bind(this)}>
                    {
                      this.state.paused ? 
                        <li className={styles.checkItem}>
                          Check Availability 
                        </li>   
                          :
                        <li className={styles.checkItem}>
                          Check Availability 
                          <img src={confirm} className={styles.checkImgItem}/>
                        </li>  
                    }                                          
                </Button>
                   :
                <Button disabled={this.state.paused} type='secondary' style={{ borderRadius: '100px', backgroundColor: 'transparent', 
                  width: '250px', height: '60px', fontSize: '20px', border: '2px solid ' + (this.state.paused ? this.state.pausedColor : '#00C4FF'), 
                  color: '#00C4FF'}} onClick={this.check.bind(this)}>                  
                  {
                    this.state.paused ? 
                      <div style={{color: this.state.pausedColor}}>Check Availability </div>
                        :
                      'Check Availability'
                  } 
                </Button>
            }
          </li>
          
          <li className={styles.bidInfo} style={{width: 700}}>
            <Input disabled={this.state.paused} style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', width: '250px', height: '25px'}} 
                   placeholder="Bid Price"  onChange={this.changeBidPrice.bind(this)}/>
            <p style={{color: 'white', width: 400}}>
            Will check your remaining QKC in auction system smart contract and use them first when possible, 
            then you just need to pay for the difference.</p>
          </li>
  
          <li className={styles.bidBtn}>
            {
              !this.state.paused ? 
                <Button text onClick={this.bidNow.bind(this)}>
                  <div className={styles.bidLink}>
                    <i style={{color: '#00C4FF'}}><b>Bid Now</b></i>
                    <img src={jiantou} className={styles.bidImgItem}/>
                  </div>
                </Button>
                   :
                <Button text >
                  <div className={styles.bidLink}>
                    <i style={{color: this.state.pausedColor}}><b>Paused</b></i>
                  </div>
                </Button>
            }
            
          </li>
        </div>
        <div className={styles.content} style={{color: 'white', paddingLeft: 120}}>
          <div className={styles.title} style={{fontSize: 30}}>Rules:</div>
          <p style={{fontSize: 18, lineHeight: '150%'}}>1. You can start next token auction by bidding at least 5000 QKC.</p>
          <br/>
          <p style={{fontSize: 18, lineHeight: '150%'}}>
            2. The auction process lasts at least one week, the bidder with the highest price wins the auction, 
            and others can get their QKC deposits back at any time.
          </p>
          <br/>
          <p style={{fontSize: 18, lineHeight: '150%'}}>3. If there is a new valid bid during the last five minutes of the auction, it will extend five more minutes.</p>
          <br/>
          <p style={{fontSize: 18, lineHeight: '150%'}}>4. A new bid price needs to be at least 5 percent more than the current.</p>
        </div>
        <Dialog style={{ width: "25%" }}
          visible={this.state.confimationVisible}
          closeable="esc,mask"
          onOk={this.bidNewToken.bind(this)}
          onCancel={() => this.setState({confimationVisible: false})}
          onClose={() => this.setState({confimationVisible: false})}
          title='Pay for Bid'
          footerAlign='right'
          footer={this.state.confimationFooter}
        >
          <p style={{fontSize: 20, lineHeight: '180%', marginRight: 30, marginLeft: 30}}>
          You current bid is {this.state.bidPrice} QKC, and there are {this.state.balance} QKC left in the auction system smart contract that 
           can be used, you still need to pay {this.state.remainBalance} QKC to place the bid. Continue to proceed?
          </p>
        </Dialog>
      </div>
    );
  }
}
