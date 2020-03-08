import React, { Component } from 'react';
import { Button, Dialog, Input, Grid  } from '@alifd/next';
import styles from './index.module.scss';
import eventProxy from '../../../../utils/eventProxy';

const { Row, Col } = Grid;

export default class MyTokens extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenData: [],
      mintTokenVisible: false,
      mintTokenFooter: (<view style={{marginRight: '40px', marginBottom: '80px'}}>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({mintTokenVisible: false})}>                  
          Cancel
        </Button>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF'}} onClick={() => this.setState({mintTokenVisible: false})}>                  
          OK
        </Button>
      </view>),
    };
  }
  componentDidMount = () => {
    let num = Math.floor(Math.random() * 10);
    if (num > 1) num = 6;
    this.state.tokenData = this.generateData(num);
    this.setState({tokenData: this.state.tokenData});
  }

  generateData = (number) => {
    let data = [];
    for (let i = 0; i < number; i++) {
      data.push({tokenName: 'Satoshi-' + i, 
                 auctionedPrice: '50000 QKC', 
                 createdTime: '21:42:12 01/22/2020', 
                 totalSupply: '10000000', 
                 owner: '0xaaaa...bbbb'});
    }
    return data;
  }

  mintToken = () => {
    this.setState({mintTokenVisible: true});
  }

  showExchange = (tokenInfo) => {
    eventProxy.trigger('pageSelector', tokenInfo);
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
                                                <li className={styles.navItem}>
                                                  <li className={styles.auctionInfo}>
                                                    <div className={styles.desc}>Auctioned Price:</div>
                                                  </li>
                                                  <div className={styles.value}>{tokenInfo.auctionedPrice}</div>
                                                </li>
                                                <li className={styles.navItem}>
                                                  <li className={styles.auctionInfo}>
                                                    <div className={styles.desc}>Total Supply:</div>
                                                  </li>
                                                  <div className={styles.value}>{tokenInfo.totalSupply}</div>
                                                </li>
                                                <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
                                                  width: '120px', height: '50px', fontSize: '20px',
                                                  color: '#FFFFFF', marginTop: '20px'}} onClick={() => this.mintToken()}>                  
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
                <Button text onClick={this.showExchange.bind(this, {tokenName: 'Satoshi'})}>
                  <div className={styles.title}>Satoshi</div>
                </Button>
              </div>
      
              <li className={styles.navItem}>
                <li className={styles.auctionInfo}>
                  <div className={styles.desc}>Created Time:</div>
                </li>
                <div className={styles.value}>21:14:12 01/02/2020</div>
              </li>
              <li className={styles.navItem}>
                <li className={styles.auctionInfo}>
                  <div className={styles.desc}>Auctioned Price:</div>
                </li>
                <div className={styles.value}>50000 QKC</div>
              </li>
              <li className={styles.navItem} style={{ width: '1050px'}}>
                <li className={styles.navItem}>
                  <li className={styles.auctionInfo}>
                    <div className={styles.desc}>Total Supply:</div>
                  </li>
                  <div className={styles.value}>1000000</div>
                </li>
                <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
                  width: '120px', height: '50px', fontSize: '20px', color: '#FFFFFF', marginTop: '-30px'}} onClick={() =>  this.mintToken()}>                  
                  Mint Token
                </Button>
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
          onOk={() => this.setState({mintTokenVisible: false})}
          onCancel={() => this.setState({mintTokenVisible: false})}
          onClose={() => this.setState({mintTokenVisible: false})}
          title='Mint Token'
          footerAlign='right'
          footer={this.state.mintTokenFooter}
        >
          <Input style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', marginLeft: 30, width: '85%', height: '25px'}} placeholder="Token Amount"/>
          <p style={{fontSize: 20, lineHeight: '180%', marginRight: 30, marginLeft: 30}}>
          Mint as many new tokens as you want, once the mint transaction succeeded, you can find those new thokens on 
          your current address!
          </p>
        </Dialog>
      </div>
    );
  }
}
