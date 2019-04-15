import React, { Component } from 'react';
import loadtest from 'loadtest';
import Tabs from './Tabs';
import styles from './Styles.css';
import APIRequestStore from '../utils/APIRequestStore';
import APIRequestResultStore from '../utils/APIRequestResultStore';
import APIRequestResult from './APIRequestResult';
import ErrorResponse from './ErrorResponse';
import ListItem from './ListItem';
import { GET } from '../constants';
import { httpMethods } from '../constants/data';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.apiRequestStore = new APIRequestStore();
    this.apiRequestResultStore = new APIRequestResultStore();
    const apiRequests = this.apiRequestStore.getAll();
    const defaultOptions = {
      url: '',
      cookies: [],
      method: GET,
      maxRequests: 10,
      concurrency: 1,
      requestsPerSecond: 1,
      headers: {}
    };
    const isOptions = Array.isArray(apiRequests) && apiRequests.length;
    const options = isOptions ? apiRequests[0] : defaultOptions;
    const apiRequestResult = isOptions
      ? this.apiRequestResultStore.getLatest(options.key)
      : null;
    this.state = {
      searchTerm: '',
      apiRequests: this.apiRequestStore.getAll(),
      apiRequestResult,
      statusResults: [],
      options
    };
  }

  statusCallback = (error, result, latency) => {
    const { isFetchingKey } = this.state;
    const { path, statusCode, requestIndex } = result;
    const { meanLatencyMs, rps } = latency;
    const status = {
      rps,
      path,
      meanLatencyMs,
      key: isFetchingKey,
      index: requestIndex,
      statusCode: statusCode.toString()
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
    const results = this.apiRequestStore.set(key, options);
    const selectedOptions = this.apiRequestStore.get(key);
    if (this.canParseJsonString(body)) {
      options = {
        ...options,
        body: JSON.parse(body)
      };
    }

    this.setState(
      {
        options: selectedOptions,
        isFetchingKey: key,
        statusResults: [],
        apiRequestResult: null,
        apiRequests: results
      },
      () => {
        const reqOptions = {
          ...options,
          statusCallback: this.statusCallback
        };
        loadtest.loadTest(reqOptions, (error, result) => {
          const errors = Object.keys(result.errorCodes).map((k, i) => ({
            index: i,
            statusCode: k,
            occurances: result.errorCodes[k]
          }));

          const data = {
            ...result,
            errors
          };

          const apiRequestResult = this.apiRequestResultStore.set(key, data);
          this.setState({ apiRequestResult, isFetchingKey: null });
        });
      }
    );
  };

  requestExists = key => {
    const { apiRequests } = this.state;
    return !!apiRequests.find(req => req.key === key);
  };

  handleDelete = key => {
    const results = this.apiRequestStore.remove(key);
    this.setState({ apiRequests: results });
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

  filterAPIRequests = (searchTerm, requests) => {
    if (!searchTerm) return requests;
    const filter = searchTerm.toUpperCase();
    return requests.filter(
      req =>
        req.method.toUpperCase().indexOf(filter) > -1 ||
        req.url.toUpperCase().indexOf(filter) > -1
    );
  };

  handleRequestSelect = key => {
    const { apiRequests } = this.state;
    const options = apiRequests.find(req => req.key === key);
    const apiRequestResult = this.apiRequestResultStore.getLatest(key);
    this.setState({
      options,
      apiRequestResult
    });
  };

  render() {
    const {
      options,
      searchTerm,
      statusResults,
      isFetchingKey,
      apiRequests,
      apiRequestResult
    } = this.state;
    const optionsKey = options && options.key;
    const statusResultsFiltered = statusResults.filter(
      res => res.key === optionsKey
    );
    const hasStatusResults = !!(
      Array.isArray(statusResultsFiltered) && statusResultsFiltered.length
    );
    const apiRequestResultKey = apiRequestResult && apiRequestResult.key;
    const errors = apiRequestResult && apiRequestResult.errors;
    const hasErrors = !!(Array.isArray(errors) && errors.length);
    const { url, method } = options;
    const data = this.filterAPIRequests(searchTerm, apiRequests);

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
            {optionsKey === apiRequestResultKey &&
              isFetchingKey !== apiRequestResultKey && (
                <APIRequestResult apiRequestResult={apiRequestResult} />
              )}
            {optionsKey === apiRequestResultKey && hasErrors && (
              <ErrorResponse apiRequestResult={apiRequestResult} />
            )}
            {hasStatusResults &&
              statusResultsFiltered.map(status => (
                <div key={status.index} className={`column ${styles.listItem}`}>
                  {status.statusCode.startsWith('2') ? (
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
