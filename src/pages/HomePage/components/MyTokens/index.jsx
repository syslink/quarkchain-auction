import React, { Component } from 'react';
import { createHashHistory } from 'history';
import { Button, Dialog, Input, Grid, Message, Notification } from '@alifd/next';
import BigNumber from 'bignumber.js';
import styles from './index.module.scss';
import * as Contracts from '../../../../utils/contracts';
import eventProxy from '../../../../utils/eventProxy';
import * as tool from '../../../../utils/global';

export const history = createHashHistory();
const { Row, Col } = Grid;

export default class MyTokens extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenName: props.location.search.length > 1 ? props.location.search.substr(1) : '',
      tokenData: props.tokenData != null ? props.tokenData : [],
      mintTokenVisible: false,
      curMintedTokenName: '',
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
      if (!result) return;
      tool.qkcWeb3.eth.getAccounts().then(accounts => {
        if (accounts == null || accounts.length == 0) {
          return;
        }
        const tokenId = tool.convertTokenName2Num(this.state.tokenName);
        Contracts.NonReservedNativeTokenManager.getNativeTokenInfo([tokenId]).then(tokenInfo => {
          console.log(tokenInfo);
          tokenInfo.createTime = tokenInfo[0].toNumber();
          tokenInfo.owner = tokenInfo[1];
          tokenInfo.totalSupply = tokenInfo[2];
          if (tokenInfo.createTime == 0) {
            tool.displayWarningInfo('There is no token with this name.');
          } else {
            tokenInfo.tokenName = this.state.tokenName;
            tokenInfo.curAccount = accounts[0];
            this.setState({tokenData: [tokenInfo]})
          }
        });
      });    
    });
  }

  openMintTokenDialog = (v) => {
    this.setState({mintTokenVisible: true, curMintedTokenName: v});
  }

  changeTokenAmount = (v) => {
    this.state.mintedTokenAmount = v;
  }

  mintToken = () => {
    const valid = /^[1-9][0-9]*$/.test(this.state.mintedTokenAmount);
    if (!valid) {
      Message.error('Token amount only can be a number.');
      return;
    }
    const amount = '0x' + new BigNumber(this.state.mintedTokenAmount).shiftedBy(18).toString(16);
    const tokenId = tool.convertTokenName2Num(this.state.curMintedTokenName);
    Contracts.NonReservedNativeTokenManager.mintNewToken([tokenId, amount], {}).then(txId => {
      if (new BigNumber(txId, 16).toNumber() == 0) {
        tool.displayErrorInfo('Fail to send transaction.');
      } else {
        this.setState({mintTokenVisible: false});
        tool.displayTxInfo(txId);
      }
    }).catch(error => {
      if (error.code == 4001) return;
      tool.displayErrorInfo(error.message);
    });
  }

  showExchange = (tokenInfo) => {
    history.push('/exchange?' + this.state.tokenName);
  }
  
  render() {
    let displayData = [];
    if (this.state.tokenData.length > 1) {
        displayData = this.state.tokenData.map(tokenInfo =>
                                              <div className={styles.content}>
                                                <div className={styles.title}>
                                                  <Button text onClick={this.showExchange.bind(this, tokenInfo)}>
                                                    <div className={styles.title}>{tokenInfo.tokenName}</div>
                                                  </Button>
                                                </div>
                                        
                                                <li className={styles.navItem}>
                                                  <li className={styles.auctionInfo}>
                                                    <div className={styles.desc}>Created Time:</div>
                                                  </li>
                                                  <div className={styles.value}>{tokenInfo.createdTime}</div>
                                                </li>
                                                {/* <li className={styles.navItem}>
                                                  <li className={styles.auctionInfo}>
                                                    <div className={styles.desc}>Auctioned Price:</div>
                                                  </li>
                                                  <div className={styles.value}>{tokenInfo.auctionedPrice}</div>
                                                </li> */}
                                                <li className={styles.navItem}>
                                                  <li className={styles.auctionInfo}>
                                                    <div className={styles.desc}>Total Supply:</div>
                                                  </li>
                                                  <div className={styles.value}>{tokenInfo.totalSupply}</div>
                                                </li>
                                                <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
                                                  width: '120px', height: '50px', fontSize: '20px',
                                                  color: '#FFFFFF', marginTop: '20px'}} onClick={() => this.openMintTokenDialog.bind(this, tokenInfo.tokenName)}>                  
                                                  Mint Token
                                              </Button>
                                            </div> 
                                            );

    }
    return (
      <div className={styles.container}>
        {
          this.state.tokenData.length == 0 ? '' : (this.state.tokenData.length == 1) ? 
            <div className={styles.content}>
              
              <div className={styles.title}>
                <Button text onClick={this.showExchange.bind(this, this.state.tokenData[0])}>
                  <div className={styles.title}>{this.state.tokenData[0].tokenName}</div>
                </Button>
              </div>
      
              <li className={styles.navItem}>
                <li className={styles.auctionInfo}>
                  <div className={styles.desc}>Created Time:</div>
                </li>
                <div className={styles.value}>{tool.displayDate(this.state.tokenData[0].createTime)}</div>
              </li>
              <li className={styles.navItem} style={{ width: '1050px'}}>
                <li className={styles.navItem}>
                  <li className={styles.auctionInfo}>
                    <div className={styles.desc}>Total Supply:</div>
                  </li>
                  <div className={styles.value}>{tool.convert2BaseUnit(this.state.tokenData[0].totalSupply)}</div>
                </li>
                {
                  this.state.tokenData[0].owner == this.state.tokenData[0].curAccount ? 
                    <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
                      width: '120px', height: '50px', fontSize: '20px', color: '#FFFFFF', marginTop: '-30px'}} 
                      onClick={this.openMintTokenDialog.bind(this, this.state.tokenData[0].tokenName)}>                  
                      Mint Token
                    </Button>
                    :
                    ""
                }
              </li>
            </div> 
          : 
          <div>
            <Row wrap justify="center" fixedWidth="xl" style={{ width: '100%' }}>
              {
              displayData.map(data => <Col span="10">{data}</Col>)
              }
            </Row>
          </div>
          
        }
        
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
                 placeholder="Token Amount"
                 onChange={this.changeTokenAmount.bind(this)}
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
