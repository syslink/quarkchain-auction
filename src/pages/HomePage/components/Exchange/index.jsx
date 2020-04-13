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
      mintTokenVisible: false,
      curBalance: 0,
      curShardIndex: 0,
      minGasReserveMaintain: new BigNumber(0),
      minGasReserveInit: new BigNumber(0),
      allShardsInfo:  [{admin: '', exchangeRate: 0, adminGasReserve: 0, userGasReserve: 0, userNativeTokenBalance: 0, refundRate: 0, needRegister: true},
                       {admin: '', exchangeRate: 0, adminGasReserve: 0, userGasReserve: 0, userNativeTokenBalance: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, adminGasReserve: 0, userGasReserve: 0, userNativeTokenBalance: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, adminGasReserve: 0, userGasReserve: 0, userNativeTokenBalance: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, adminGasReserve: 0, userGasReserve: 0, userNativeTokenBalance: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, adminGasReserve: 0, userGasReserve: 0, userNativeTokenBalance: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, adminGasReserve: 0, userGasReserve: 0, userNativeTokenBalance: 0, refundRate: 0, needRegister: true}, 
                       {admin: '', exchangeRate: 0, adminGasReserve: 0, userGasReserve: 0, userNativeTokenBalance: 0, refundRate: 0, needRegister: true}],
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
      mintTokenFooter: (<view style={{marginRight: '40px', marginBottom: '80px'}}>
      <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
        width: '120px', height: '50px', fontSize: '20px',
        color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({mintTokenVisible: false})}>                  
        Cancel
      </Button>
      <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
        width: '120px', height: '50px', fontSize: '20px',
        color: '#FFFFFF'}} onClick={this.mintToken.bind(this)}>                  
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
      this.state.tokenId = tool.convertTokenName2Num(this.state.tokenName);
      tool.qkcWeb3.eth.getAccounts().then(accounts => {
        console.log(accounts);
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
          GeneralNativeTokenManager.minGasReserveMaintain().then(minGasReserveMaintain => {
            this.setState({minGasReserveMaintain: new BigNumber(minGasReserveMaintain.toHexString(), 16)});
          });
          
          GeneralNativeTokenManager.minGasReserveInit().then(minGasReserveInit => {
            this.setState({minGasReserveInit: new BigNumber(minGasReserveInit.toHexString(), 16)});
          });

          GeneralNativeTokenManager.registrationRequired().then(required => {
            GeneralNativeTokenManager.registeredTokens(this.state.tokenId).then(registered => {
              this.state.allShardsInfo[i].needRegister = required && !registered;
              GeneralNativeTokenManager.gasReserves(this.state.tokenId).then(gasReserve => {
                this.state.allShardsInfo[i].admin = gasReserve.admin;
                const exchangeRate = !gasReserve.exchangeRate.denominator.isZero() ? gasReserve.exchangeRate.numerator.toNumber() / gasReserve.exchangeRate.denominator.toNumber() : 0;
                this.state.allShardsInfo[i].exchangeRate = exchangeRate;// != 0 ? exchangeRate.mul(100).toNumber() : 0;
                this.state.allShardsInfo[i].refundRate = gasReserve.refundPercentage.toNumber();
                GeneralNativeTokenManager.gasReserveBalance([this.state.tokenId, gasReserve.admin]).then(gasReserve => {
                  this.state.allShardsInfo[i].adminGasReserve = new BigNumber(gasReserve.toHexString(), 16).shiftedBy(-18).toNumber();
                  this.setState({allShardsInfo: this.state.allShardsInfo});
                });
                GeneralNativeTokenManager.gasReserveBalance([this.state.tokenId, accounts[0]]).then(gasReserve => {
                  this.state.allShardsInfo[i].userGasReserve = new BigNumber(gasReserve.toHexString(), 16).shiftedBy(-18).toNumber();
                  this.setState({allShardsInfo: this.state.allShardsInfo});
                });
                GeneralNativeTokenManager.nativeTokenBalance([this.state.tokenId, accounts[0]]).then(balance => {
                  this.state.allShardsInfo[i].userNativeTokenBalance = new BigNumber(balance.toHexString(), 16).shiftedBy(-18).toNumber();
                  this.setState({allShardsInfo: this.state.allShardsInfo});
                });
              });
            });
          });
        }
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

  withdrawNativeToken = (shardIndex) => {
    Contracts.GeneralNativeTokenManagers[shardIndex].withdrawNativeToken(this.state.tokenId, {}).then(txId => {
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

  changeMintTokenAmount = (v) => {
    this.state.mintedTokenAmount = v;
  }

  mintToken = () => {
    const valid = /^[1-9][0-9]*$/.test(this.state.mintedTokenAmount);
    if (!valid) {
      tool.displayErrorInfo('Token amount only can be a number.');
      return;
    }
    const amount = '0x' + new BigNumber(this.state.mintedTokenAmount).shiftedBy(18).toString(16);
    Contracts.NonReservedNativeTokenManager.mintNewToken([this.state.tokenId, amount], {}).then(txId => {
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
    valid = /^[0-9]*$/.test(this.state.gasReserveAmountValue);
    if (!valid) {
      tool.displayErrorInfo('Gas reserve amount is wrong.');
      return;
    }

    if (this.state.minGasReserveMaintain.isGreaterThan(new BigNumber(this.state.allShardsInfo[this.state.curShardIndex].adminGasReserve).shiftedBy(18))) {
      if (this.state.minGasReserveInit.isGreaterThan(new BigNumber(this.state.gasReserveAmountValue + this.state.allShardsInfo[this.state.curShardIndex].userGasReserve).shiftedBy(18))) {
        tool.displayErrorInfo('Gas reserve amount cannot be less than ' + this.state.minGasReserveInit);
        return;
      }
    } else if (this.state.allShardsInfo[this.state.curShardIndex].exchangeRate >= this.state.exchangeRateValue) {
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
            <li className={styles.navItem}>
              <li className={styles.auctionInfo}>
                <div className={styles.desc}>Owner:</div>
              </li>
                <div className={styles.value}>{tool.displayShortAddr(this.state.tokenInfo.owner)}</div>
            </li>
            <li className={styles.navItem} style={{width: this.state.tokenInfo.owner == this.state.tokenInfo.curAccount ? '500px' : '400px'}}>
              <li className={styles.navItem}>
                <li className={styles.auctionInfo}>
                  <div className={styles.desc}>Total Supply:</div>
                </li>
                <div className={styles.value}>{tool.convert2BaseUnit(this.state.tokenInfo.totalSupply)}</div>
              </li>
              
              {
                  this.state.tokenInfo.owner == this.state.tokenInfo.curAccount ? 
                    <Button text style={{ color: '#00C4FF'}} style={{ color: '#00C4FF', marginTop: '-25px', marginLeft: '30px'}} 
                      onClick={() => this.setState({mintTokenVisible: true})}>                  
                      Mint Token >>
                    </Button>
                    :
                    ""
                }

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
              {
                oneShard.needRegister ?  
                  <Button text style={{ color: '#00C4FF', marginLeft: '40px'}} onClick={() => this.setState({registerVisible: true})}>                  
                  Register >>
                  </Button>
                  :
                  ''
              }
            </Row>
            <Row style={{marginTop: '20px'}}>
              <Col span='14'>
                  <div className={styles.value}>Liquidity Provider: {tool.displayShortAddr(oneShard.admin)}</div>
              </Col>
              <Col span='10'>
                <Row justify='start'>
                  <div style={{ width: '200px'}} className={styles.value}>{this.state.tokenName}/QKC: {oneShard.exchangeRate}</div>
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
              <Col span='14'>
                <Row justify='start'>
                  <div  style={{ width: '300px'}} className={styles.nextValue}>Remaining Gas Reserve: {oneShard.adminGasReserve} QKC</div>
                 
                </Row>
              </Col>
              <Col span='10'>
                <Row align='center'>
                  <div style={{ width: '200px'}}  className={styles.nextValue}>Refund Rate: {oneShard.refundRate}%</div>
                </Row>
              </Col>
            </Row>
            <hr style={{ width: '100%', marginTop: '20px'}}/>
            <Row justify='start' style={{marginTop: '20px'}}>                
              <div  style={{ width: '300px'}} className={styles.nextValue}>User Gas Reserve: {oneShard.userGasReserve} QKC</div>
                {
                  oneShard.needRegister ?                   
                    ''
                      :
                    <Button text style={{ color: '#00C4FF'}} onClick={() => this.setState({depositGasReserveVisible: true, curShardIndex: i})}>                  
                    Deposit >>
                    </Button>
                }
                {
                  oneShard.needRegister ?                   
                    ''
                      :
                    <Button text style={{ color: '#00C4FF', marginLeft: '20px'}} onClick={this.withdraw.bind(this, i)}>                  
                    Withdraw >>
                    </Button>
                }
            </Row>
            <Row justify='start' style={{marginTop: '20px'}}>                
                <div  style={{ width: '300px'}} className={styles.nextValue}>User Native Token Balance: {oneShard.userNativeTokenBalance} {this.state.tokenName}</div>
                {
                  oneShard.needRegister ?                   
                    ''
                      :
                    <Button text style={{ color: '#00C4FF'}} onClick={this.withdrawNativeToken.bind(this, i)}>                  
                    Withdraw >>
                    </Button>
                }
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
                 innerBefore="Token Amount:"
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
                 innerBefore="Token Amount:"
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
                 innerBefore="Exchange Rate:"
                 onChange={this.onChangeExchangeRate.bind(this)}/>
          <Input style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', marginLeft: 30, width: '85%', height: '25px'}} 
                innerBefore="Gas Reserve Amount:"
                onChange={this.onChangeGasReserveAmount.bind(this)}
                onPressEnter={this.changeExchangeRate.bind(this)}/>
          <p style={{fontSize: 14, color: '#FB7C6E', lineHeight: '180%', marginRight: 30, marginLeft: 30}}>           
          The amount of gas reserve should >= {this.state.minGasReserveInit.toString()} QKC
          </p>
        </Dialog>

        <Dialog style={{ width: "35%" }}
          visible={this.state.mintTokenVisible}
          closeable="esc,mask"
          //onOk={() => this.setState({mintTokenVisible: false})}
          onCancel={() => this.setState({mintTokenVisible: false})}
          onClose={() => this.setState({mintTokenVisible: false})}
          title='Mint Token'
          footerAlign='right'
          footer={this.state.mintTokenFooter}
        >
          <Input autoFocus style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', marginLeft: 30, width: '85%', height: '25px'}} 
                 innerBefore="Token Amount:"
                 onChange={this.changeMintTokenAmount.bind(this)}
                 onPressEnter={this.mintToken.bind(this)}/>
          <p style={{fontSize: 20, lineHeight: '180%', marginRight: 30, marginLeft: 30}}>
          Mint as many new tokens as you want, once the mint transaction succeeded, you can find those new thokens on 
          your current address!
          </p>
        </Dialog>

      </div>
    );
  }
}
