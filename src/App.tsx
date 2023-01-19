import * as React from "react";
import JsonEditor from "./JsonEditor";

const App: React.FC = () => {
  return (
    <JsonEditor
      className="h-full"
      value='{ "hello": "world" }'
      onChange={console.log}
    />
  );
};

export default App;
