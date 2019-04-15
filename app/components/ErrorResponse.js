import React from 'react';
import styles from './Styles.css';

const ErrorResponse = ({ apiRequestResult }) => {
  const { totalErrors, errors } = apiRequestResult;
  return (
    <div>
      <h4 className="title is-4">Errors</h4>
      {errors.map(error => (
        <div key={error.index} className={`columns ${styles.dataColumns}`}>
          <div className={`column ${styles.errorLabelColumn}`}>
            Status {error.statusCode}:{' '}
          </div>
          <div className={`column`}>{error.occurances}</div>
        </div>
      ))}
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.errorLabelColumn}`}>Total errors:</div>
        <div className={`column`}>{totalErrors}</div>
      </div>
      <br />
    </div>
  );
};

export default ErrorResponse;
