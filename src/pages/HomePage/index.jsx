import React, { Component } from 'react';
import cookie from 'react-cookies';
import Banner from './components/Banner';
import AuctionedTokens from './components/AuctionedTokens';
import MyTokens from './components/MyTokens';
import Exchange from './components/Exchange';
import eventProxy from '../../utils/eventProxy';

export default class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      start: false,
      paused: false,
      whichPage: 'showTokenAuction',
      data: null,
    };
    
    const start = cookie.load('start') == 'true';
    this.state.start = !start;
    if (this.state.start) {
      this.state.paused = Math.floor(Math.random() * 10) > 4;
    }
    cookie.save('start', this.state.start);
  }
  componentDidMount = () => {
    eventProxy.on('pageSelector', (pageInfo) => {
      this.setState({whichPage: pageInfo.type, data: pageInfo.data});
    });
  }
  
  render() {
    return (
      <div>
        {
          this.state.whichPage == 'showMyTokens' ? 
            <div>
              <MyTokens tokenData={this.state.data}/>
            </div>
              :
            (
              this.state.whichPage == 'showTokenAuction' ? 
                <div>
                  <Banner/>
                  {/* <AuctionedTokens start={this.state.start}/> */}
                </div>
                  :
                <div>
                  <Exchange tokenInfo={this.state.data}/>
                </div>
            )
            
        }
      </div>
    );
  }
}
