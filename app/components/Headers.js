import React, { Component } from 'react';

export default class Headers extends Component {
  state = {};

  render() {
    const { options, handleOptionsChange } = this.props;
    const { cookies } = options;
    const cookieValue =
      (Array.isArray(cookies) && cookies.length && cookies[0]) || '';

    return (
      <div className="column">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Cookie</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  placeholder="cookie_name=cookie_value"
                  value={cookieValue}
                  onChange={e => {
                    handleOptionsChange('cookies', [e.target.value]);
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
