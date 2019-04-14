import React, { Component } from 'react';
import loadtest from 'loadtest';
import Tabs from './Tabs';
import styles from './Styles.css';
import RequestStore from '../utils/requestStore';
import SuccessResponse from './SuccessResponse';
import ErrorResponse from './ErrorResponse';
import ListItem from './ListItem';
import { GET, STATUS_200 } from '../constants';
import { httpMethods } from '../constants/data';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.httpRequestStore = new RequestStore();
    const httpRequests = this.httpRequestStore.getAll();
    const defaultOptions = {
      url: '',
      cookies: [],
      method: GET,
      maxRequests: 10,
      concurrency: 1,
      requestsPerSecond: 1,
      body: {},
      headers: {}
    };
    const isOptions = Array.isArray(httpRequests) && httpRequests.length;
    const options = isOptions ? httpRequests[0] : defaultOptions;
    this.state = {
      searchTerm: '',
      httpRequests: this.httpRequestStore.getAll(),
      successResponse: null,
      errorResponse: null,
      statusResults: [],
      options
    };
  }

  statusCallback = (error, result, latency) => {
    const { path, statusCode, requestIndex } = result;
    const { meanLatencyMs, rps } = latency;
    const status = {
      rps,
      path,
      statusCode,
      meanLatencyMs,
      index: requestIndex
    };
    this.setState(state => ({
      statusResults: [status, ...state.statusResults]
    }));
  };

  canParseJsonString = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  handleLoadTest = () => {
    let { options } = this.state;
    const { body } = options;
    const { method, url } = options;
    const key = `${method}-${url}`;
    const results = this.httpRequestStore.set(key, options);
    if (this.canParseJsonString(body)) {
      options = {
        ...options,
        body: JSON.parse(body)
      };
    }

    this.setState(
      {
        httpRequests: results,
        statusResults: [],
        errorResponse: null,
        successResponse: null
      },
      () => {
        const reqOptions = {
          ...options,
          statusCallback: this.statusCallback
        };
        loadtest.loadTest(reqOptions, (error, result) => {
          const errors = Object.keys(result.errorCodes).map(k => ({
            statusCode: k,
            occurances: result.errorCodes[k]
          }));
          if (errors.length) {
            this.setState({ errorResponse: errors, successResponse: result });
          } else {
            this.setState({ successResponse: result });
          }
        });
      }
    );
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

  handleHeadersChange = (key, value) => {
    this.setState(state => ({
      options: {
        ...state.options,
        headers: {
          ...state.options.headers,
          [key]: value
        }
      }
    }));
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
    this.setState({
      options,
      statusResults: [],
      errorResponse: null,
      successResponse: null
    });
  };

  render() {
    const {
      options,
      searchTerm,
      statusResults,
      httpRequests,
      successResponse,
      errorResponse
    } = this.state;

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
                options={options}
                handleRequestSelect={this.handleRequestSelect}
                handleDelete={this.handleDelete}
              />
            ))}
          </div>
        </div>
        <div className={`column ${styles.rightColumn}`}>
          <div
            className={`column ${styles.rightHeaderColumn} ${
              styles.rightHeaderColumnFirst
            }`}
          >
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
                      <option key={httpMethod.value} value={httpMethod.value}>
                        {httpMethod.value}
                      </option>
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
                  className="button is-link"
                  onClick={this.handleLoadTest}
                >
                  Begin Load Test
                </a>
              </p>
            </div>
          </div>
          <div className={`column ${styles.rightHeaderColumn}`}>
            <Tabs
              options={options}
              handleHeadersChange={this.handleHeadersChange}
              handleOptionsChange={this.handleOptionsChange}
            />
          </div>
          <div className={`column ${styles.resultsColumn}`}>
            {successResponse && (
              <SuccessResponse successResponse={successResponse} />
            )}
            {errorResponse && (
              <ErrorResponse
                errorResponse={errorResponse}
                successResponse={successResponse}
              />
            )}
            {statusResults.map(status => (
              <div key={status.index} className={`column ${styles.listItem}`}>
                {status.statusCode === STATUS_200 ? (
                  <span className="tag is-success">{status.statusCode}</span>
                ) : (
                  <span className="tag is-danger">{status.statusCode}</span>
                )}
                {` Requests per second: ${status.rps},  mean Latency: ${
                  status.meanLatencyMs
                } ms,  `}
                {status.path}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
