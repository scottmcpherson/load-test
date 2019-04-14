import React, { Component } from 'react';
import styles from './Styles.css';

export default class Options extends Component {
  render() {
    const { options, handleOptionsChange } = this.props;
    const { maxRequests, concurrency, requestsPerSecond } = options;
    return (
      <div className="column">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Max Requests</label>
          </div>
          <div className={`field-body ${styles.fieldBody}`}>
            <div className="field">
              <p className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  placeholder="10"
                  value={maxRequests}
                  onChange={e => {
                    handleOptionsChange('maxRequests', e.target.value);
                  }}
                />
              </p>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Concurrency</label>
          </div>
          <div className={`field-body ${styles.fieldBody}`}>
            <div className="field">
              <p className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  placeholder="1"
                  value={concurrency}
                  onChange={e => {
                    handleOptionsChange('concurrency', e.target.value);
                  }}
                />
              </p>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Requests Per Sec</label>
          </div>
          <div className={`field-body ${styles.fieldBody}`}>
            <div className="field">
              <p className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  placeholder="1"
                  value={requestsPerSecond}
                  onChange={e => {
                    handleOptionsChange('requestsPerSecond', e.target.value);
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
