import React from 'react';
import Editor from '@monaco-editor/react';

const SqlEditor = ({ value, onChange, height = "300px" }) => {
    return (
        <div className="sql-editor-container" style={{ overflow: 'hidden', height: '100%' }}>
            <Editor
                height={height}
                defaultLanguage="sql"
                theme="vs-dark"
                value={value}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 }
                }}
            />
        </div>
    );
};

export default SqlEditor;
