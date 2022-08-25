import { useState, useEffect } from "react";
import "./App.css";
import { firestore, firebase } from "../config/firebase";
import { Table } from 'antd';
import React from 'react';
function Dashboard() {
  const columns = [
    {
      title: 'Login',
      dataIndex: 'login',
      width: 150,
    },
    {
      title: 'Lembrar Senha',
      dataIndex: 'remember',
      width: 150,
    }
  ];
  const [dados, setDados] = useState([]);
  const [total, setTotal] = useState(0);
  async function submitLogin() {
    const posts = [];
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("dados")
        .get();
      querySnapshot.forEach(function (doc) {
        posts.push({
          key: doc.id,
          login: doc.data().login,
          remember: doc.data().remember === true ? "sim" : "não"
        });
      });
      setDados(posts);
      setTotal(posts.length)
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  }

  useEffect(() => {
    submitLogin();
  }, []);

  return (
    <div>
      <h2>tela de dashboard | Total: {total}</h2>
      {/* {dados.map((item,index)=>(
        <div style={{display: 'flex' , gap: '10px'}} key={index}>
          <h5>Login: {item.login}</h5>
          <span>Lembrar login: {item.remember === true ? "sim" : "não"}</span>
          <span>Id: {item.key}</span>
        </div>
      ))} */}
      <Table columns={columns} dataSource={dados} pagination={{ pageSize: 10 }} scroll={{ y: 500 }} />
    </div>
  );
}

export default Dashboard;
