import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({

  width = '100%',
  height = '400px',
  language = 'cpp',
  theme = 'vs-dark',
  value = '',
  
}) => {

  const cppCode = `#include <iostream>

  int main() {
      cout << "Click on Login or Register to continue.";
      return 0;
  }`;
  return (
    <Editor
      width={width}
      height={height}
      language={language}
      theme={theme}
      value={cppCode}
      options={{ readOnly: true }}
      
    />
  );
};

export default CodeEditor;
