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
    };
    
    const start = cookie.load('start') == 'true';
    this.state.start = !start;
    if (this.state.start) {
      this.state.paused = Math.floor(Math.random() * 10) > 4;
    }
    cookie.save('start', this.state.start);
  }
  componentDidMount = () => {
    eventProxy.on('pageSelector', (whichPage) => {
      this.setState({whichPage});
    })
  }
  
  render() {
    return (
      <div>
        {
          this.state.whichPage == 'showMyTokens' ? 
            <div>
              <MyTokens />
            </div>
              :
            (
              this.state.whichPage == 'showTokenAuction' ? 
                <div>
                  <Banner start={this.state.start} paused={this.state.paused}/>
                  <AuctionedTokens start={this.state.start}/>
                </div>
                  :
                <div>
                  <Exchange tokenInfo={this.state.whichPage}/>
                </div>
            )
            
        }
      </div>
    );
  }
}
