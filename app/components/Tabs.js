import React, { Component } from 'react';
import Options from './Options';
import Headers from './Headers';
import Body from './Body';

const OPTIONS_ID = 'OPTIONS';
const HEADERS_ID = 'HEADERS';
const BODY_ID = 'BODY';

const tabs = [
  { id: OPTIONS_ID, title: 'Options' },
  { id: HEADERS_ID, title: 'Headers' },
  { id: BODY_ID, title: 'Body' }
];

const Tab = ({ id, title, activeTab, handleTabSwitch }) => {
  const activeClass = id === activeTab ? 'is-active' : '';
  return (
    <li className={`${activeClass}`} onClick={() => handleTabSwitch(id)}>
      <a>{title}</a>
    </li>
  );
};

export default class Tabs extends Component {
  state = {
    activeTab: OPTIONS_ID
  };

  handleTabSwitch = activeTab => this.setState({ activeTab });

  render() {
    const { activeTab } = this.state;
    return (
      <div>
        <div className="tabs">
          <ul>
            {tabs.map(tabData => (
              <Tab
                key={tabData.id}
                id={tabData.id}
                title={tabData.title}
                activeTab={activeTab}
                handleTabSwitch={this.handleTabSwitch}
              />
            ))}
          </ul>
        </div>
        {activeTab === OPTIONS_ID && <Options {...this.props} />}
        {activeTab === HEADERS_ID && <Headers {...this.props} />}
        {activeTab === BODY_ID && <Body {...this.props} />}
      </div>
    );
  }
}
