import React, { Component } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';

const placeholder = `{

}`;

export default class Body extends Component {
  state = { code: placeholder };

  render() {
    const { code } = this.state;
    return (
      <div className="column">
        <Editor
          value={code}
          onValueChange={newCode => this.setState({ code: newCode })}
          highlight={newCode => highlight(newCode, languages.json)}
          padding={10}
          style={{
            fontFamily: 'Arial, Helvetica, "Helvetica Neue", serif',
            fontSize: 14,
            backgroundColor: '#fff',
            boxShadow: 'inset 0 1px 2px rgba(10, 10, 10, 0.1)',
            border: '1px solid #dbdbdb',
            borderRadius: '4px'
          }}
        />
      </div>
    );
  }
}
