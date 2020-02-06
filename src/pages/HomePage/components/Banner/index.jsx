import React, { Component } from 'react';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';
import { Input, Button, Dialog } from '@alifd/next';

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
      paused: props.paused,
      start: props.start,
      pausedColor: 'rgb(203,203,203)',
      confimationFooter: (<view style={{marginRight: '40px', marginBottom: '80px'}}>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({confimationVisible: false})}>                  
          Cancel
        </Button>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '120px', height: '50px', fontSize: '20px',
          color: '#FFFFFF'}} onClick={() => this.setState({confimationVisible: false})}>                  
          OK
        </Button>
      </view>),
    };
  }

  componentDidMount = () => {
    
  }

  check = () => {
    this.setState({checkImgVisible: !this.state.checkImgVisible});
  }

  bidNow = () => {
    this.setState({confimationVisible: true});
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>#3 Round Token Auction</div>
  
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={money} className={styles.imgItem}/>
              <div className={styles.desc}>Highest Bid:</div>
            </li>
            <div className={styles.value}>{this.state.start ? '6000 QKC' : 'N / A'}</div>
          </li>
  
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={id} className={styles.imgItem}/>
              <div className={styles.desc}>Proposed Name:</div>
            </li>
            <div className={styles.value}>{this.state.start ? 'RMBCoin' : 'N / A'}</div>
          </li>
          
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={leftime} className={styles.imgItem}/>
              <div className={styles.desc}>Time Left:</div>
            </li>
            <div className={styles.value}>{this.state.start ? '3 days : 5 hours : 12 minutes' : 'N / A'}</div>
          </li>
  
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={bidder} className={styles.imgItem}/>
              <div className={styles.desc}>Highest Bidder:</div>
            </li>
            <div className={styles.value}>{this.state.start ? '0x123344...aaabbb' : 'N / A'}</div>
          </li>
  
          <li className={styles.navItem}>
            <li className={styles.auctionInfo}>
              <img src={bidtime} className={styles.imgItem}/>
              <div className={styles.desc}>Highest Bidding Time:</div>
            </li>
            <div className={styles.value}>{this.state.start ? '21:42:12 01/22/2020' : 'N / A'}</div>
          </li>
          
          <li className={styles.bidInfo}>
            <Input disabled={this.state.paused} style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', width: '250px', height: '25px'}} placeholder="Token Name"/>
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
            <Input disabled={this.state.paused} style={{borderRadius: '100px', padding: '15px 32px', marginRight: '20px', width: '250px', height: '25px'}} placeholder="Bid Price"/>
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
          <p style={{fontSize: 18, lineHeight: '150%'}}>4. A new dib price needs to be at least 10 percent more than the current.</p>
        </div>
        <Dialog style={{ width: "25%" }}
          visible={this.state.confimationVisible}
          closeable="esc,mask"
          onOk={() => this.setState({confimationVisible: false})}
          onCancel={() => this.setState({confimationVisible: false})}
          onClose={() => this.setState({confimationVisible: false})}
          title='Pay for Bid'
          footerAlign='right'
          footer={this.state.confimationFooter}
        >
          <p style={{fontSize: 20, lineHeight: '180%', marginRight: 30, marginLeft: 30}}>
          You current bid is 7000 QKC, and there are 3000 QKC left in the auction system smart contract that 
           can be used, you still need to pay 4000 QKC to place the bid. Continue to proceed?
          </p>
        </Dialog>
      </div>
    );
  }
}
