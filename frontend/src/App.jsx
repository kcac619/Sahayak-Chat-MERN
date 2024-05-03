import * as React from "react";
import "./App.css";

import { ChakraProvider, Divider } from "@chakra-ui/react";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={ChatPage} />
    </div>
  );
}

export default App;
