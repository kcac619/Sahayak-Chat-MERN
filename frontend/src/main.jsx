import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { ChakraProvider, Divider } from "@chakra-ui/react";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
);
