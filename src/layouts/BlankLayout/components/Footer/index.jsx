import React from 'react';
import { Grid } from '@alifd/next';
import styles from './index.module.scss';

const { Row, Col } = Grid;


const social1 = require('./images/1.png');
const social2 = require('./images/2.png');
const social3 = require('./images/3.png');
const social4 = require('./images/4.png');
const social5 = require('./images/5.png');
const social6 = require('./images/6.png');
const social7 = require('./images/7.png');
const social8 = require('./images/8.png');
const social9 = require('./images/9.png');
const social10 = require('./images/10.png');

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Row>
          <Col l="10">
            <h3 className={styles.title}>Technology</h3>
            <div className={styles.nav}>
              <a href='https://developers.quarkchain.io/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Developer Portal</div></a>
              <a href='https://quarkchain.io/wp-content/uploads/2018/11/QUARK-CHAIN-Public-Version-CN-0.3.4.pdf' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Whitepaper</div></a>
              <a href='https://github.com/QuarkChain/pyquarkchain/blob/master/papers/boson.pdf' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Boson Consensus</div></a>
              <a href='https://quarkchain.io/wp-content/uploads/2019/12/QuarkChain_Miner_Handbook_CN.pdf' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Mining Handbook</div></a>
              <a href='https://mainnet.quarkchain.io/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Mainnet</div></a>
              <a href='https://qpocket.io/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>QPocket</div></a>
            </div>
          </Col>
          <Col l="10">
            <h3 className={styles.title}>Resource</h3>
            <div className={styles.nav}>
              <a href='https://www.huoxing24.com/userCenter/7289d0e0c85e4f3494690d9711ad5aff' target='_blank' className={styles.link}><div style={{color: '#fff'}}>News</div></a>
              <a href='https://quarkchain.io/cn/resources/#media' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Media</div></a>
              <a href='https://quarkchain.io/cn/resources/#press' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Press</div></a>
              <a href='https://quarkchain.io/cn/ecosystem/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Ecosystem</div></a>
              <a href='https://quarkchain.io/cn/community/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Community</div></a>
            </div>
          </Col>
          <Col l="10">
            <h3 className={styles.title}>Contact</h3>
            <div className={styles.nav}>
              <a href='mailto:career@quarkchain.org' className={styles.link}><div style={{color: '#fff'}}>career@quarkchain.org</div></a>
              <a href='mailto:support@quarkchain.org' className={styles.link}><div style={{color: '#fff'}}>support@quarkchain.org</div></a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col l="10">
            <h3 className={styles.title}>About Us</h3>
            <div className={styles.nav}>
              <a href='https://quarkchain.io/cn/about-us/#team' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Team</div></a>
              <a href='https://quarkchain.io/cn/about-us/#advisors' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Advisors</div></a>
              <a href='https://quarkchain.io/cn/about-us/#investors' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Investors</div></a>
              <a href='https://quarkchain.io/careers/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Careers</div></a>
            </div>
          </Col>
          <Col l="10">
            <h3 className={styles.title}>Other</h3>
            <div className={styles.nav}>
              <a href='https://quarkchain.io/terms-of-use/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Terms of use</div></a>
              <a href='https://quarkchain.io/privacy-policy/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Privacy Policy</div></a>
              <a href='https://quarkchain.io/cn/token-release-schedule-update/' target='_blank' className={styles.link}><div style={{color: '#fff'}}>Token Distribution</div></a>
            </div>
          </Col>
          <Col l="10">
            <h3 className={styles.title}>Social Media</h3>
            {/* <div style={{width: '55%'}}> */}
              <Row justify='space-between' align='center' style={{marginBottom: '15px', width: '55%'}}>
                <Col>
                  <a href='http://discord.me/quarkchain' target='_blank'><img src={social1} className={styles.imgItem}/></a>
                  <a href='https://www.youtube.com/channel/UCbgmRMFedbOj4yRFl2gtUDA' target='_blank'><img src={social6} className={styles.imgItem}/></a>
                </Col>
                <Col>
                  <a href='https://medium.com/quarkchain-official' target='_blank'><img src={social2} className={styles.imgItem}/></a>
                  <a href='https://github.com/QuarkChain' target='_blank'><img src={social7} className={styles.imgItem}/></a>
                </Col>
                <Col>
                  <a href='https://twitter.com/Quark_Chain' target='_blank'><img src={social3} className={styles.imgItem}/></a>
                  <a href='https://t.me/quarkchainio' target='_blank'><img src={social8} className={styles.imgItem}/></a>
                </Col>
                <Col>
                  <a href='https://www.reddit.com/r/quarkchainio/' target='_blank'><img src={social4} className={styles.imgItem}/></a>
                  <a href='https://www.facebook.com/quarkchainofficial/' target='_blank'><img src={social9} className={styles.imgItem} style={{marginLeft: '10px'}}/></a>
                </Col>
                <Col>
                  <a href='https://weibo.com/QuarkChain' target='_blank'><img src={social5} className={styles.imgItem}/></a>
                  <a href='https://quarkchain.io/wp-content/uploads/2018/10/wechat.jpeg' target='_blank'><img src={social10} className={styles.imgItem}/></a>
                </Col>
              </Row>
              {/* <Row justify='space-between' style={{marginBottom: '15px', width: '55%'}}>
              </Row> */}
            {/* </div> */}
          </Col>
        </Row>
        <p className={styles.copyRight}>Copyright @ 2019 QuarkChain Foundation | All rights reserved</p>
      </div>
    </div>
  );
}
