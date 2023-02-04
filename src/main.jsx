import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import Cadastro from "./Cadastro";
import Listar from "./Listar";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route  path="/" element={<Listar />} />
        <Route  path="/cadastro" element={<Cadastro />} />
        <Route  path="/listar" element={<Listar />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<Listar />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
