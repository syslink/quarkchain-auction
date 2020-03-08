import React, { Component } from 'react';
import { Button, Dialog, Input, Grid  } from '@alifd/next';
import styles from './index.module.scss';

const { Row, Col } = Grid;
const asset = require('./images/asset.png');
const greenIcon = require('./images/green.png');
const redIcon = require('./images/red.png');
const yellowIcon = require('./images/yellow.png');

export default class Exchange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenInfo: props.tokenInfo,
      registerVisible: false,
      exchangeRateVisible: false,
      registerFooter: (<view style={{marginRight: '30px', marginBottom: '80px'}}>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '25%', height: '30px', fontSize: '16px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({registerVisible: false})}>                  
          Cancel
        </Button>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '25%', height: '30px', fontSize: '16px',
          color: '#FFFFFF'}} onClick={() => this.setState({registerVisible: false})}>                  
          OK
        </Button>
      </view>),
      exchangeRateFooter: (<view style={{marginRight: '30px', marginBottom: '80px'}}>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '25%', height: '30px', fontSize: '16px',
          color: '#FFFFFF', marginRight: '20px'}} onClick={() => this.setState({exchangeRateVisible: false})}>                  
          Cancel
        </Button>
        <Button type='secondary' style={{ borderRadius: '100px', border: '2px solid #00C4FF', backgroundColor: '#00C4FF', 
          width: '25%', height: '30px', fontSize: '16px',
          color: '#FFFFFF'}} onClick={() => this.setState({exchangeRateVisible: false})}>                  
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

  register = () => {
    this.setState({registerVisible: true});
  }

  exchangeRate = () => {
    this.setState({exchangeRateVisible: true});
  }
  
  render() {

    return (
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.content}>
            <div className={styles.title}>{this.state.tokenInfo.tokenName}</div>
    
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
            <li className={styles.navItem}>
              <li className={styles.navItem}>
                <li className={styles.auctionInfo}>
                  <div className={styles.desc}>Total Supply:</div>
                </li>
                <div className={styles.value}>1000000</div>
              </li>
            </li>
            <li className={styles.navItem} style={{ width: '1050px', justifyContent: 'start'}} >
              <li className={styles.navItem}>
                <li className={styles.auctionInfo}>
                  <div className={styles.desc}>Balance:</div>
                </li>
                <div className={styles.value}>30000</div>
              </li>
              <Button text style={{ color: '#00C4FF', margin: '-25px 0 0 20px'}}>                  
                Withdraw >>
              </Button>
            </li>
          </div> 
          <div>
            <img src={asset} className={styles.imgItem}/>
          </div>
        </div>

        <div className={styles.oddShard}>
          <Row align='center'>
            <div className={styles.shardTitle}>Shard 0</div>
            <img src={greenIcon} className={styles.iconItem}/>
          </Row>
          <Row style={{marginTop: '20px'}}>
            <Col>
              <Row>
                <div className={styles.value}>Admin:</div>
                <div className={styles.value}>0x1bcd1...1D99ecd</div>
              </Row>
            </Col>
            <Col>
              <Row>
                <div className={styles.value}>Exchange Rate:</div>
                <div className={styles.value}>0.5</div>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <div className={styles.nextValue}>Gas Reserve:</div>
                <div className={styles.nextValue}>1000 QKC</div>
              </Row>
            </Col>
            <Col>
              <Row align='center'>
                <div className={styles.nextValue}>Refund Rate:</div>
                <div className={styles.nextValue}>0.2</div>
                <Button text style={{ color: '#00C4FF', margin: '0 0 0 100px'}} onClick={() => this.exchangeRate()}>                  
                Provide Higher Rate >>
                </Button>
              </Row>
            </Col>
          </Row>
        </div> 
        <div className={styles.evenShard}>
          <Row align='center'>
            <div className={styles.shardTitle}>Shard 1</div>
            <img src={yellowIcon} className={styles.iconItem}/>
          </Row>
          <Row style={{marginTop: '20px'}}>
            <Col>
              <Row>
                <div className={styles.value}>Admin:</div>
                <div className={styles.value}>0x1bcd1...1D99ecd</div>
              </Row>
            </Col>
            <Col>
              <Row>
                <div className={styles.value}>Exchange Rate:</div>
                <div className={styles.value}>0.5</div>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <div className={styles.warnValue}>Gas Reserve:</div>
                <div className={styles.warnValue}>1000 QKC</div>
              </Row>
            </Col>
            <Col>
              <Row align='center'>
                <div className={styles.nextValue}>Refund Rate:</div>
                <div className={styles.nextValue}>0.2</div>
                <Button text style={{ color: '#00C4FF', margin: '0 0 0 100px'}} onClick={() => this.exchangeRate()}>                  
                Set Rate >>
                </Button>
              </Row>
            </Col>
          </Row>
        </div> 
        <div className={styles.oddShard}>
          <Row align='center'>
            <div className={styles.shardTitle}>Shard 2</div>
            <img src={redIcon} className={styles.iconItem}/>
          </Row>
          <Row style={{marginTop: '20px'}}>
            <Col>
              <Row>
                <div className={styles.value}>Admin:</div>
                <div className={styles.value}>N/A</div>
              </Row>
            </Col>
            <Col>
              <Row>
                <div className={styles.value}>Exchange Rate:</div>
                <div className={styles.value}>N/A</div>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <div className={styles.nextValue}>Gas Reserve:</div>
                <div className={styles.nextValue}>N/A</div>
              </Row>
            </Col>
            <Col>
              <Row align='center'>
                <div className={styles.nextValue}>Refund Rate:</div>
                <div className={styles.nextValue}>N/A</div>
                <Button text style={{ color: '#00C4FF', margin: '0 0 0 100px'}} onClick={() => this.register()}>                  
                Register >>
                </Button>
              </Row>
            </Col>
          </Row>
        </div>  
        <div className={styles.evenShard}>
          <Row align='center'>
            <div className={styles.shardTitle}>Shard 3</div>
            <img src={redIcon} className={styles.iconItem}/>
          </Row>
          <Row style={{marginTop: '20px'}}>
            <Col>
              <Row>
                <div className={styles.value}>Admin:</div>
                <div className={styles.value}>N/A</div>
              </Row>
            </Col>
            <Col>
              <Row>
                <div className={styles.value}>Exchange Rate:</div>
                <div className={styles.value}>N/A</div>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <div className={styles.nextValue}>Gas Reserve:</div>
                <div className={styles.nextValue}>N/A</div>
              </Row>
            </Col>
            <Col>
              <Row align='center'>
                <div className={styles.nextValue}>Refund Rate:</div>
                <div className={styles.nextValue}>N/A</div>
                <Button text style={{ color: '#00C4FF', margin: '0 0 0 100px'}} onClick={() => this.register()}>                  
                Register >>
                </Button>
              </Row>
            </Col>
          </Row>
        </div>  
        <div className={styles.oddShard}>
          <Row align='center'>
            <div className={styles.shardTitle}>Shard 4</div>
            <img src={redIcon} className={styles.iconItem}/>
          </Row>
          <Row style={{marginTop: '20px'}}>
            <Col>
              <Row>
                <div className={styles.value}>Admin:</div>
                <div className={styles.value}>0x1bcd1...1D99ecd</div>
              </Row>
            </Col>
            <Col>
              <Row>
                <div className={styles.value}>Exchange Rate:</div>
                <div className={styles.value}>0.5</div>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <div className={styles.warnValue}>Gas Reserve:</div>
                <div className={styles.warnValue}>1000 QKC</div>
              </Row>
            </Col>
            <Col>
              <Row align='center'>
                <div className={styles.nextValue}>Refund Rate:</div>
                <div className={styles.nextValue}>0.2</div>
                <Button text style={{ color: '#00C4FF', margin: '0 0 0 100px'}} onClick={() => this.exchangeRate()}>                  
                Set Rate >>
                </Button>
              </Row>
            </Col>
          </Row>
        </div> 
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
          <Input style={{borderRadius: '4px', marginRight: '20px', marginLeft: 30, width: '85%', height: '25px'}} 
                 placeholder="Token Amount" addonTextAfter="Satoshi"/>
          <p style={{fontSize: 16, lineHeight: '180%', marginRight: 30, marginLeft: 30}}>
          A token must be registered in a specified shard to enable gas reserve operation. Sending any amount of the token to our system contract will complete registration. Continue to proceed?
          </p>
        </Dialog>
        
        <Dialog style={{ width: "30%" }}
          visible={this.state.exchangeRateVisible}
          closeable="esc,mask"
          onOk={() => this.setState({exchangeRateVisible: false})}
          onCancel={() => this.setState({exchangeRateVisible: false})}
          onClose={() => this.setState({exchangeRateVisible: false})}
          title='Exchange Rate'
          footerAlign='right'
          footer={this.state.registerFooter}
        >
          <Input style={{borderRadius: '4px', margin: '0 20px 20px 30px', width: '85%', height: '25px'}} 
                 placeholder="Exchange Rate"/>
          <Input style={{borderRadius: '4px', margin: '0 20px 0px 30px', width: '85%', height: '25px'}} 
                placeholder="Gas Reserve Amount"/>
          <p style={{fontSize: 14, color: '#FB7C6E', lineHeight: '180%', marginRight: 30, marginLeft: 30}}>
          Must be more than 500 QKC
          </p>
        </Dialog>
      </div>
    );
  }
}
