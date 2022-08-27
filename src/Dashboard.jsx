import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { firestore, firebase } from "../config/firebase";
import { Table, Popconfirm, Tag, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import CsvDownloader from 'react-csv-downloader';
import { FileMarkdownOutlined  } from '@ant-design/icons';
function Dashboard() {
  const headers = [
    { displayName: "Login", id: "login" },
    { displayName: "Lembrar Senha", id: "remember" },
  ];
  const columns = [
    {
      title: "Login",
      dataIndex: "login",
      width: 150,
    },
    {
      title: "Lembrar Senha",
      dataIndex: "remember",
      width: 150,
    },
    {
      title: "Ação",
      dataIndex: "acao",
      width: 150,
      render: (_, record) =>
        dados.length >= 1 ? (
          <Tag color={"geekblue"} key={record.key}>
            <Popconfirm
              title="Deseja realmente deletar?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a>Deletar</a>
            </Popconfirm>
          </Tag>
        ) : null,
    },
  ];
  const [dados, setDados] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  async function submitLogin() {
    setIsLoading(true);
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
          remember: doc.data().remember === true ? "sim" : "não",
        });
      });
      setDados(posts);
      setTotal(posts.length);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    setIsLoading(false);
  }

  async function handleDelete(key) {
    setIsLoading(true);
    await firebase
      .firestore()
      .collection("dados")
      .doc(key)
      .delete()
      .then(submitLogin())
      .catch((error) => console.log(error));
    setIsLoading(false);
  }
  useEffect(() => {
    submitLogin();
  }, []);

  return isLoading ? (
    <div className="spin-loader">
      <Spin />
    </div>
  ) : (
    <div style={{ width: "100%" }}>
      <h2 style={{ padding: "20px", textAlign: "center" }}>
        Dashboard | Total: {total}
      </h2>
      {/* {dados.map((item,index)=>(
        <div style={{display: 'flex' , gap: '10px'}} key={index}>
          <h5>Login: {item.login}</h5>
          <span>Lembrar login: {item.remember === true ? "sim" : "não"}</span>
          <span>Id: {item.key}</span>
          <button onClick={()=>handleDelete(item.key)}></button>
        </div>
      ))} */}
      <div
        style={{
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Table
          columns={columns}
          dataSource={dados}
          pagination={{ pageSize: 5 }}
          scroll={{ y: 500 }}
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}
      >
        <CsvDownloader 
         style={{ marginRight: "10px" }}
         filename="DadosFishingSegInfo"
         extension=".csv"
         separator=";"
         columns={headers}
         datas={dados}
         text="DOWNLOAD" >
        <Button style={{ display: "flex" , alignItems: "center"}}  icon={<FileMarkdownOutlined/>} type="default">Download</Button>
        </CsvDownloader>
        <Link to={"/"}>
          <Button  type="primary">Voltar</Button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
