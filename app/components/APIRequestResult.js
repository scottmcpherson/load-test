import React from 'react';
import styles from './Styles.css';

const APIRequestResult = ({ apiRequestResult }) => {
  const {
    rps,
    minLatencyMs,
    maxLatencyMs,
    meanLatencyMs,
    percentiles,
    totalRequests,
    totalTimeSeconds
  } = apiRequestResult;
  const fiftey = percentiles && percentiles['50'];
  const nintey = percentiles && percentiles['90'];
  const ninteyFive = percentiles && percentiles['95'];
  const ninteyNine = percentiles && percentiles['99'];

  return (
    <div>
      <h4 className="title is-4">Summary</h4>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.summaryLabelColumn}`}>
          Min Latency:
        </div>
        <div className={`column`}>{minLatencyMs} ms</div>
      </div>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.summaryLabelColumn}`}>
          Max Latency:
        </div>
        <div className={`column`}>{maxLatencyMs} ms</div>
      </div>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.summaryLabelColumn}`}>
          Mean Latency:
        </div>
        <div className={`column`}>{meanLatencyMs} ms</div>
      </div>
      <br />
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.summaryLabelColumn}`}>
          Total requests:
        </div>
        <div className={`column`}>{totalRequests}</div>
      </div>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.summaryLabelColumn}`}>
          Requests per second:
        </div>
        <div className={`column`}>{rps}</div>
      </div>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.summaryLabelColumn}`}>Total time:</div>
        <div className={`column`}>{totalTimeSeconds} s</div>
      </div>
      <br />
      <h4 className="title is-4">
        Percentage of the requests served within a certain time
      </h4>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.percentLabelColumn}`}>50%</div>
        <div className={`column`}>{fiftey} ms</div>
      </div>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.percentLabelColumn}`}>90%</div>
        <div className={`column`}>{nintey} ms</div>
      </div>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.percentLabelColumn}`}>95%</div>
        <div className={`column`}>{ninteyFive} ms</div>
      </div>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.percentLabelColumn}`}>99%</div>
        <div className={`column`}>{ninteyNine} ms</div>
      </div>
      <div className={`columns ${styles.dataColumns}`}>
        <div className={`column ${styles.percentLabelColumn}`}>100%</div>
        <div className={`column`}>{maxLatencyMs} ms (longest request)</div>
      </div>
      <br />
    </div>
  );
};

export default APIRequestResult;
