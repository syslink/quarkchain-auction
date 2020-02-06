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
              <a className={styles.link}>Developer Portal</a>
              <a className={styles.link}>Whitepaper</a>
              <a className={styles.link}>Boson Consensus</a>
              <a className={styles.link}>Mining Handbook</a>
              <a className={styles.link}>Mainnet</a>
              <a className={styles.link}>QPocket</a>
            </div>
          </Col>
          <Col l="10">
            <h3 className={styles.title}>Resource</h3>
            <div className={styles.nav}>
              <a className={styles.link}>News</a>
              <a className={styles.link}>Media</a>
              <a className={styles.link}>Press</a>
              <a className={styles.link}>Ecosystem</a>
              <a className={styles.link}>Community</a>
            </div>
          </Col>
          <Col l="10">
            <h3 className={styles.title}>Contact</h3>
            <div className={styles.nav}>
              <a className={styles.link}>career@quarkchain.org</a>
              <a className={styles.link}>support@quarkchain.org</a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col l="10">
            <h3 className={styles.title}>About Us</h3>
            <div className={styles.nav}>
              <a className={styles.link}>Team</a>
              <a className={styles.link}>Advisors</a>
              <a className={styles.link}>Investors</a>
              <a className={styles.link}>Careers</a>
            </div>
          </Col>
          <Col l="10">
            <h3 className={styles.title}>Other</h3>
            <div className={styles.nav}>
              <a className={styles.link}>Terms of use</a>
              <a className={styles.link}>Privacy Policy</a>
              <a className={styles.link}>Token Distribution</a>
            </div>
          </Col>
          <Col l="10">
            <h3 className={styles.title}>Social Media</h3>
            <div className={styles.nav}>
              <Row style={{marginBottom: '15px'}}>
                <a href='/'><img src={social1} className={styles.imgItem}/></a>
                <a href='/'><img src={social2} className={styles.imgItem}/></a>
                <a href='/'><img src={social3} className={styles.imgItem}/></a>
                <a href='/'><img src={social4} className={styles.imgItem}/></a>
                <a href='/'><img src={social5} className={styles.imgItem}/></a>
              </Row>
              <Row>
                <a href='/'><img src={social6} className={styles.imgItem}/></a>
                <a href='/'><img src={social7} className={styles.imgItem}/></a>
                <a href='/'><img src={social8} className={styles.imgItem}/></a>
                <a href='/'><img src={social9} className={styles.imgItem}/></a>
                <a href='/'><img src={social10} className={styles.imgItem}/></a>
              </Row>
            </div>
          </Col>
        </Row>
        <p className={styles.copyRight}>Copyright @ 2019 QuarkChain Foundation | All rights reserved</p>
      </div>
    </div>
  );
}
