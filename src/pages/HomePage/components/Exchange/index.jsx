import React, { Component } from 'react';
import { Button, Dialog, Input, Grid, Notification } from '@alifd/next';
import BigNumber from 'bignumber.js';
import styles from './index.module.scss';
import * as Contracts from '../../../../utils/contracts';
import * as tool from '../../../../utils/global';

const { Row, Col } = Grid;
const asset = require('./images/asset.png');
const greenIcon = require('./images/green.png');
const redIcon = require('./images/red.png');
const yellowIcon = require('./images/yellow.png');

export default class Exchange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenName: props.location.search.length > 1 ? props.location.search.substr(1) : '',
      tokenInfo: props.tokenInfo != null ? props.tokenInfo : null,
      tokenId: 0,
      registerVisible: false,
      exchangeRateVisible: false,
      depositGasReserveVisible: false,
      curBalance: 0,
      curShardIndex: 0,
      allShardsInfo:  [{admin: '', exchangeRate: 0, gasReserve: 0, refundRate: 0, needRegister: true},
                       {admin: '', exchangeRate: 0, gasReserve: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, gasReserve: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, gasReserve: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, gasReserve: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, gasReserve: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, gasReserve: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, gasReserve: 0, refundRate: 0, needRegister: true}],
      registerFooter: (<view style={{marginRight: '30px', marginBottom: '80px'}}>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({registerVisible: false})}>                  
          Cancel
        </Button>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={this.sendRegisterTx.bind(this)}>                  
          OK
        </Button>
      </view>),
      depositGasReserveFooter:  (<view style={{marginBottom: '80px'}}>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({depositGasReserveVisible: false})}>                  
          Cancel
        </Button>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={this.depositGasReserve.bind(this)}>                  
          OK
        </Button>
        </view>),
      exchangeRateFooter: (<view style={{marginRight: '30px', marginBottom: '80px'}}>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({exchangeRateVisible: false})}>                  
          Cancel
        </Button>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={this.changeExchangeRate.bind(this)}>                  
          OK
        </Button>
      </view>),
    };
  }
  componentDidMount = () => {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    this.state.tokenName = nextProps.location.search.length > 1 ? nextProps.location.search.substr(1) : '';
    this.getData();
  }

  getData = () => {
    if (this.state.tokenName == '') return;
    Contracts.initContractObj(tool.qkcWeb3).then(result => {
      tool.qkcWeb3.eth.getAccounts().then(accounts => {
        this.state.tokenId = tool.convertTokenName2Num(this.state.tokenName);
        tool.qkcWeb3.eth.getAccounts().then(accounts => {
          Contracts.NonReservedNativeTokenManager.getNativeTokenInfo(this.state.tokenId).then(tokenInfo => {
            console.log(tokenInfo);
            tokenInfo.createTime = tokenInfo[0].toNumber();
            tokenInfo.owner = tokenInfo[1];
            tokenInfo.totalSupply = tokenInfo[2];
            if (tokenInfo.createTime == 0) {
              Notification.config({placement: 'br'});
              Notification.open({
                title: 'Warning',
                content: 'There is no token with this name.',
                type: 'warning',
                duration: 0
              });
            } else {
              tokenInfo.tokenName = this.state.tokenName;
              tokenInfo.curAccount = accounts[0];
              this.setState({tokenInfo})
            }
          });

          for (let i = 0; i < Contracts.GeneralNativeTokenManagers.length; i++) {
            const GeneralNativeTokenManager = Contracts.GeneralNativeTokenManagers[i];
            GeneralNativeTokenManager.registrationRequired().then(required => {
              GeneralNativeTokenManager.registeredTokens(this.state.tokenId).then(registered => {
                this.state.allShardsInfo[i].needRegister = required && !registered;
                GeneralNativeTokenManager.gasReserves(this.state.tokenId).then(gasReserve => {
                  this.state.allShardsInfo[i].admin = gasReserve.admin;
                  const exchangeRate = !gasReserve.exchangeRate.denominator.isZero() ? gasReserve.exchangeRate.numerator.toNumber() * 100 / gasReserve.exchangeRate.denominator.toNumber() : 0;
                  this.state.allShardsInfo[i].exchangeRate = exchangeRate;// != 0 ? exchangeRate.mul(100).toNumber() : 0;
                  this.state.allShardsInfo[i].refundRate = gasReserve.refundPercentage.toNumber();
                  GeneralNativeTokenManager.gasReserveBalance([this.state.tokenId, accounts[0]]).then(gasReserve => {
                    this.state.allShardsInfo[i].gasReserve = new BigNumber(gasReserve.toHexString(), 16).shiftedBy(-18).toNumber();
                    this.setState({allShardsInfo: this.state.allShardsInfo});
                  });
                });
              });
            });
          }
        });  
      });    
    });
  }

  withdraw = (shardIndex) => {
    Contracts.GeneralNativeTokenManagers[shardIndex].withdrawGasReserve(this.state.tokenId, {}).then(txId => {
      if (new BigNumber(txId, 16).toNumber() == 0) {
        tool.displayErrorInfo('Fail to send transaction.');
        return;
      }

      Notification.config({placement: 'br'});
      Notification.open({
          title: 'Success',
          content:
          <a href={'https://devnet.quarkchain.io/tx/' + txId} target='_blank'>Transaction has been sent successfully, please click here to check it.</a>,
          type: 'success',
          duration: 0
      });
    }).catch(error => {
      if (error.code == 4001) return;
      tool.displayErrorInfo(error);
    });
  }

  register = (shardIndex) => {    
    this.setState({registerVisible: true, curShardIndex: shardIndex});
  }

  changeTokenAmount = (v) => {
    this.state.tokenAmount = v;
  }

  sendRegisterTx = () => {    
    Contracts.GeneralNativeTokenManagers[this.state.curShardIndex].registerToken([], 
      {transferTokenId: this.state.tokenId, transferAmount: new BigNumber(this.state.tokenAmount)}).then(txId => {
      if (new BigNumber(txId, 16).toNumber() == 0) {
        tool.displayErrorInfo('Fail to send transaction.');
        return;
      }
      this.setState({registerVisible: false});
      Notification.config({placement: 'br'});
      Notification.open({
          title: 'Success',
          content:
          <a href={'https://devnet.quarkchain.io/tx/' + txId} target='_blank'>Transaction has been sent successfully, please click here to check it.</a>,
          type: 'success',
          duration: 0
      });
    }).catch(error => {
      if (error.code == 4001) return;
      tool.displayErrorInfo(error);
    });
  }

  showExchangeRateDialog = (shardIndex) => {
    this.setState({exchangeRateVisible: true, curShardIndex: shardIndex});
  }

  onChangeExchangeRate = (v) => {
    this.state.exchangeRateValue = v;
  }

  onChangeGasReserveAmount = (v) => {
    this.state.gasReserveAmountValue = v;
  }

  changeExchangeRate = () => {
    if (this.state.exchangeRateValue == null || this.state.gasReserveAmountValue == null) {
      tool.displayErrorInfo('Please input required value.');
      return;
    }
    const dotIndex = this.state.exchangeRateValue.indexOf('.');
    let decimals = 0;
    let numerator = 0;
    let denominator = 1;
    if (dotIndex > -1) {
      decimals = this.state.exchangeRateValue.length - dotIndex - 1;
      denominator = new BigNumber(1).shiftedBy(decimals).toNumber();
    }
    numerator = this.state.exchangeRateValue.substr(0, dotIndex) +  this.state.exchangeRateValue.substr(dotIndex + 1);
    numerator = new BigNumber(numerator).toNumber();

    let valid = /^[1-9][0-9]*$/.test(numerator);
    if (!valid) {
      tool.displayErrorInfo('Exchange rate is wrong.');
      return;
    }
    valid = /^[1-9][0-9]*$/.test(this.state.gasReserveAmountValue);
    if (!valid) {
      tool.displayErrorInfo('Gas reserve amount is wrong.');
      return;
    }

    if (this.state.allShardsInfo[this.state.curShardIndex].exchangeRate >= this.state.exchangeRateValue * 100) {
      tool.displayErrorInfo('Exchange rate must be bigger than the current value.');
      return;
    }

    Contracts.GeneralNativeTokenManagers[this.state.curShardIndex].proposeNewExchangeRate([this.state.tokenId, numerator, denominator], 
      {transferAmount: new BigNumber(this.state.gasReserveAmountValue)}).then(txId => {
      if (new BigNumber(txId, 16).toNumber() == 0) {
        tool.displayErrorInfo('Fail to send transaction.');
        return;
      }
      this.setState({exchangeRateVisible: false});
      Notification.config({placement: 'br'});
      Notification.open({
          title: 'Success',
          content:
          <a href={'https://devnet.quarkchain.io/tx/' + txId} target='_blank'>Transaction has been sent successfully, please click here to check it.</a>,
          type: 'success',
          duration: 0
      });
    }).catch(error => {
      if (error.code == 4001) return;
      tool.displayErrorInfo(error);
    });

  }

  depositGasReserve = () => {
    Contracts.GeneralNativeTokenManagers[this.state.curShardIndex].depositGasReserve(this.state.tokenId, {transferAmount: new BigNumber(this.state.tokenAmount)}).then(txId => {
      if (new BigNumber(txId, 16).toNumber() == 0) {
        tool.displayErrorInfo('Fail to send transaction.');
        return;
      }
      this.setState({depositGasReserveVisible: false});
      Notification.config({placement: 'br'});
      Notification.open({
          title: 'Success',
          content:
          <a href={'https://devnet.quarkchain.io/tx/' + txId} target='_blank'>Transaction has been sent successfully, please click here to check it.</a>,
          type: 'success',
          duration: 0
      });
    });
  }
  
  render() {
    if (this.state.tokenInfo == null) {
      return <div></div>
    }
    return (
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.content}>
            <div className={styles.title}>{this.state.tokenInfo.tokenName}</div>
    
            <li className={styles.navItem}>
              <li className={styles.auctionInfo}>
                <div className={styles.desc}>Created Time:</div>
              </li>
              <div className={styles.value}>{tool.displayDate(this.state.tokenInfo.createTime)}</div>
            </li>
            {/* <li className={styles.navItem}>
              <li className={styles.auctionInfo}>
                <div className={styles.desc}>Auctioned Price:</div>
              </li>
              <div className={styles.value}>50000 QKC</div>
            </li> */}
            <li className={styles.navItem}>
              <li className={styles.navItem}>
                <li className={styles.auctionInfo}>
                  <div className={styles.desc}>Total Supply:</div>
                </li>
                <div className={styles.value}>{tool.convert2BaseUnit(this.state.tokenInfo.totalSupply)}</div>
              </li>
            </li>
          </div> 
          <div>
            <img src={asset} className={styles.imgItem}/>
          </div>
        </div>
        {
         this.state.allShardsInfo.map((oneShard, i) => 
          <div className={(i % 2 == 0) ? styles.oddShard : styles.evenShard}>
            <Row align='center'>
              <div className={styles.shardTitle}>Shard {i}</div>
              <img src={greenIcon} className={styles.iconItem}/>
            </Row>
            <Row style={{marginTop: '20px'}}>
              <Col>
                  <div className={styles.value}>Admin: {tool.displayShortAddr(oneShard.admin)}</div>
              </Col>
              <Col>
                <Row justify='start'>
                  <div style={{ width: '200px'}} className={styles.value}>Exchange Rate: {oneShard.exchangeRate}%</div>
                  {
                    oneShard.needRegister ?                   
                      ''
                        :
                      <Button text style={{ color: '#00C4FF'}} onClick={this.showExchangeRateDialog.bind(this, i)}>                  
                      Set Rate >>
                      </Button>
                  }
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row justify='start'>
                  <div  style={{ width: '200px'}} className={styles.nextValue}>Gas Reserve: {oneShard.gasReserve} QKC</div>
                  {
                    oneShard.needRegister ?                   
                      ''
                        :
                      <Button text style={{ color: '#00C4FF'}} onClick={() => this.setState({depositGasReserveVisible: true, curShardIndex: i})}>                  
                      Deposit >>
                      </Button>
                  }
                  
                </Row>
              </Col>
              <Col>
                <Row align='center'>
                  <div style={{ width: '200px'}}  className={styles.nextValue}>Refund Rate: {oneShard.refundRate}%</div>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row justify='start' style={{marginTop: '20px'}}>                
                  <div style={{ width: '200px'}} className={styles.nextValue}>Balance: {oneShard.gasReserve} QKC</div>
                  {
                        oneShard.needRegister ?                   
                          ''
                            :
                        <Button text style={{ color: '#00C4FF'}} onClick={this.withdraw.bind(this, i)}>                  
                        Withdraw >>
                        </Button>
                  }
                </Row>
              </Col>
              <Col>
                <Row align='center' style={{marginTop: '20px'}}>
                  {
                    oneShard.needRegister ?                   
                      <Button text style={{ color: '#00C4FF', marginLeft: '200px'}} onClick={this.register.bind(this, i)}>                  
                      Register >>
                      </Button>
                        :
                      ''
                  }
                </Row>
              </Col>
            </Row>
          </div> 
         )
        }
        
        <Dialog style={{ width: "30%"}}
          visible={this.state.registerVisible}
          closeable="esc,mask"
          onOk={() => this.setState({registerVisible: false})}
          onCancel={() => this.setState({registerVisible: false})}
          onClose={() => this.setState({registerVisible: false})}
          title='Register'
          footerAlign='right'
          footer={this.state.registerFooter}
        >
          <Input autoFocus style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', marginLeft: 30, width: '85%', height: '25px'}} 
                 placeholder="Token Amount"
                 onChange={this.changeTokenAmount.bind(this)}
                 innerAfter={<div fontSize='20'>{this.state.tokenInfo.tokenName}</div>}
                 onPressEnter={this.sendRegisterTx.bind(this)}/>
          <p style={{fontSize: 16, lineHeight: '180%', marginRight: 30, marginLeft: 30}}>
          A token must be registered in a specified shard to enable gas reserve operation. Sending any amount of the token to our system contract will complete registration. Continue to proceed?
          </p>
        </Dialog>

        <Dialog style={{ width: "30%"}}
          visible={this.state.depositGasReserveVisible}
          closeable="esc,mask"
          onOk={() => this.setState({depositGasReserveVisible: false})}
          onCancel={() => this.setState({depositGasReserveVisible: false})}
          onClose={() => this.setState({depositGasReserveVisible: false})}
          title='Deposit Gas Reserve'
          footerAlign='center'
          footer={this.state.depositGasReserveFooter}
        >
          <Input autoFocus style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', marginLeft: 30, width: '85%', height: '25px'}} 
                 placeholder="Token Amount"
                 onChange={this.changeTokenAmount.bind(this)}
                 innerAfter='QKC'
                 onPressEnter={this.depositGasReserve.bind(this)}/>
        </Dialog>
        
        <Dialog style={{ width: "30%" }}
          visible={this.state.exchangeRateVisible}
          closeable="esc,mask"
          onOk={() => this.setState({exchangeRateVisible: false})}
          onCancel={() => this.setState({exchangeRateVisible: false})}
          onClose={() => this.setState({exchangeRateVisible: false})}
          title='Exchange Rate'
          footerAlign='right'
          footer={this.state.exchangeRateFooter}
        >
          <Input autoFocus style={{borderRadius: '100px', padding: '15px 32px', margin: '0 20px 10px 30px', width: '85%', height: '25px'}} 
                 placeholder="Exchange Rate"
                 onChange={this.onChangeExchangeRate.bind(this)}/>
          <Input style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', marginLeft: 30, width: '85%', height: '25px'}} 
                placeholder="Gas Reserve Amount"
                onChange={this.onChangeGasReserveAmount.bind(this)}
                onPressEnter={this.changeExchangeRate.bind(this)}/>
          <p style={{fontSize: 14, color: '#FB7C6E', lineHeight: '180%', marginRight: 30, marginLeft: 30}}>
          Must be more than 500 QKC
          </p>
        </Dialog>
      </div>
    );
  }
}
