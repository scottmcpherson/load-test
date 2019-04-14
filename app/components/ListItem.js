import React from 'react';
import styles from './Styles.css';
import { GET } from '../constants';

const ListItem = ({ req, options, handleRequestSelect, handleDelete }) => {
  const { key } = options;
  const methodClass = req.method === GET ? 'has-text-primary' : 'has-text-info';
  const activeClass = req.key === key ? styles.activeClass : '';

  return (
    <div className={`${styles.listItemWrapper} ${activeClass}`}>
      <div
        role="button"
        tabIndex={0}
        title={req.url}
        className={`${styles.listItem}`}
        onClick={() => handleRequestSelect(req.key)}
      >
        <span className={`is-size-6	${methodClass} ${styles.methodTag}`}>
          {req.method}
        </span>{' '}
        {req.url}
      </div>
      <a
        role="button"
        tabIndex={0}
        className={`tag is-delete ${styles.delete}`}
        onClick={() => handleDelete(req.key)}
      />
    </div>
  );
};

export default ListItem;
