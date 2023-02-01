import * as React from "react";
import Header from "./Header";
import Mode from "./ui/mode/Mode";

const App: React.FC = () => {
  return (
    <div className="container px-4 my-4 m-auto flex flex-col">
      <Header />
      <Mode />
    </div>
  );
};
export default App;
