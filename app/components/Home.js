import React, { Component } from 'react';
import loadtest from 'loadtest';
import Tabs from './Tabs';
import styles from './Home.css';
import RequestStore from '../utils/requestStore';

function statusCallback(error, result, latency) {
  console.log(
    'Current latency %j, result %j, error %j',
    latency,
    result,
    error
  );
  console.log('----');
  console.log('Request elapsed milliseconds: ', result.requestElapsed);
  console.log('Request index: ', result.requestIndex);
  console.log('Request loadtest() instance index: ', result.instanceIndex);
}

const GET = 'GET';
const POST = 'POST';

const httpMethods = [{ value: GET }, { value: POST }];

const HTTPMethod = ({ value }) => <option value={value}>{value}</option>;
const ListItem = ({ req, handleRequestSelect }) => (
  <div
    role="button"
    tabIndex={0}
    title={req.url}
    className={styles.listItem}
    onClick={() => handleRequestSelect(req.key)}
  >
    {req.method} {req.url}
  </div>
);

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.httpRequestStore = new RequestStore();
    this.state = {
      searchTerm: '',
      httpRequests: this.httpRequestStore.getAll(),
      options: {
        url: '',
        cookies: [],
        method: GET,
        maxRequests: 10
      }
    };
  }

  getOptions = () => {};

  handleLoadTest = () => {
    const { options } = this.state;
    const { method, url } = options;
    const key = `${method}-${url}`;
    const results = this.httpRequestStore.set(key, options);

    this.setState({ httpRequests: results }, () => {
      const reqOptions = {
        ...options,
        statusCallback
      };
      loadtest.loadTest(reqOptions, (error, result) => {
        if (error) {
          return console.error('Got an error: %s', error);
        }
        console.log('Tests run successfully: ', result);
      });
    });
  };

  requestExists = key => {
    const { httpRequests } = this.state;
    return !!httpRequests.find(req => req.key === key);
  };

  handleDelete = key => {
    const results = this.httpRequestStore.remove(key);
    this.setState({ httpRequests: results });
  };

  handleSearch = e => {
    this.setState({ searchTerm: e.target.value });
  };

  handleOptionsChange = (key, value) => {
    this.setState(state => ({ options: { ...state.options, [key]: value } }));
  };

  filterHTTPRequests = (searchTerm, requests) => {
    if (!searchTerm) return requests;
    const filter = searchTerm.toUpperCase();
    return requests.filter(
      req =>
        req.method.toUpperCase().indexOf(filter) > -1 ||
        req.url.toUpperCase().indexOf(filter) > -1
    );
  };

  handleRequestSelect = key => {
    const { httpRequests } = this.state;
    const options = httpRequests.find(req => req.key === key);
    this.setState({ options });
  };

  render() {
    const { options, searchTerm, httpRequests } = this.state;
    const { url, method } = options;
    const data = this.filterHTTPRequests(searchTerm, httpRequests);

    return (
      <div className="columns is-fullheight">
        <div
          className={`column is-one-third is-fullheight ${styles.leftColumn}`}
        >
          <div className="column">
            <div className="field">
              <p className="control has-icons-left">
                <input
                  type="text"
                  className="input"
                  placeholder="Filter"
                  onChange={this.handleSearch}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-search" />
                </span>
              </p>
            </div>
          </div>
          <div className="column">
            {data.map(req => (
              <ListItem
                key={req.key}
                req={req}
                handleRequestSelect={this.handleRequestSelect}
                handleDelete={this.handleDelete}
              />
            ))}
          </div>
        </div>
        <div className={`column ${styles.rightColumn}`}>
          <div className="column">
            <div className="field has-addons">
              <p className="control">
                <span className="select">
                  <select
                    value={method}
                    onChange={e => {
                      e.persist();
                      this.handleOptionsChange('method', e.target.value);
                    }}
                  >
                    {httpMethods.map(httpMethod => (
                      <HTTPMethod
                        key={httpMethod.value}
                        value={httpMethod.value}
                      />
                    ))}
                  </select>
                </span>
              </p>
              <p className="control is-expanded">
                <input
                  type="text"
                  value={url}
                  className="input"
                  placeholder="Request URL"
                  onChange={e => {
                    e.persist();
                    this.handleOptionsChange('url', e.target.value);
                  }}
                />
              </p>
              <p className="control">
                <a
                  role="link"
                  tabIndex="0"
                  className="button is-info"
                  onClick={this.handleLoadTest}
                >
                  Begin Load Test
                </a>
              </p>
            </div>
          </div>
          <div className="column">
            <Tabs
              options={options}
              handleOptionsChange={this.handleOptionsChange}
            />
          </div>
          <div className={`column ${styles.resultsColumn}`}>
            <a className="button">Results</a>
          </div>
        </div>
      </div>
    );
  }
}
