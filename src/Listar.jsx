import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import { firestore, firebase } from "../config/firebase";
import { Table, Popconfirm, Tag, Button, Spin, Select } from "antd";
import { Link } from "react-router-dom";
import CsvDownloader from "react-csv-downloader";
import { FileMarkdownOutlined } from "@ant-design/icons";
function Listar() {
  const { Option } = Select;
  const headers = [
    { displayName: "Texto", id: "text" },
    { displayName: "Ativo ? ", id: "status" },
    { displayName: "Data de criação", id: "createdAt" },
  ];
  const columns = [
    {
      title: "Texto",
      dataIndex: "text",
      width: 350,
    },
    {
      title: "Ativo ?",
      dataIndex: "status",
      width: 50,
    },
    {
      title: "Data de criação",
      dataIndex: "createdAt",
      width: 100,
    },
    // {
    //   title: "Alterar",
    //   dataIndex: "change",
    //   width: 150,
    //   render: (_, record) =>
    //     dados.length >= 1 ? (
    //       <Tag color={"geekblue"} key={record.key}>
    //         <Popconfirm
    //           title="Deseja realmente alterar?"
    //           onConfirm={() => handleChange(record.key)}
    //         >
    //           <a>Alterar</a>
    //         </Popconfirm>
    //       </Tag>
    //     ) : null,
    // },
    {
      title: "Deletar",
      dataIndex: "delete",
      width: 50,
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
  const [collection, setCollection] = useState(null);
  const [collectionList, setCollectionList] = useState([]);
  async function submitLogin() {
    setIsLoading(true);
    const posts = [];
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("oqueeumando")
        .doc("piadas")
        .collection("dados")
        .orderBy("createdAt", "desc")
        .get();

      querySnapshot.forEach(function (doc) {
        const timestamp = {
          nanoseconds: doc.data().createdAt.nanoseconds,
          seconds: doc.data().createdAt.seconds,
        };
        var date = new Date(timestamp.seconds * 1000);
        posts.push({
          key: doc.id,
          text: doc.data().text,
          status: doc.data().status === true ? "Sim" : "Não",
          createdAt: date.toLocaleString(),
        });
      });
      setDados(posts);
      setTotal(posts.length);
      console.log(posts);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    setIsLoading(false);
  }

  async function handleDelete(key) {
    setIsLoading(true);
    await firebase
      .firestore()
      .collection("oqueeumando")
      .doc(collection)
      .collection("dados")
      .doc(key)
      .delete()
      .then(submitLogin())
      .catch((error) => console.log(error));
    setIsLoading(false);
  }

  async function getCollectionList() {
    setIsLoading(true)
    const posts = [];
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("oqueeumando")
        .get();

      querySnapshot.forEach(function (doc) {
        posts.push(doc.id)
        console.log(doc.id, '=>', doc.data())
       } );
      setCollectionList(posts);
      console.log(posts);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    setIsLoading(false);
  }
  async function handleChange(key) {
    setIsLoading(true);
    await firebase
      .firestore()
      .collection("oqueeumando")
      .doc(key)
      .update()
      .then(submitLogin())
      .catch((error) => console.log(error));
    setIsLoading(false);
  }

  async function reloadTable(value) {
    setIsLoading(true);
    setCollection(value);
    const posts = [];
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("oqueeumando")
        .doc(value)
        .collection("dados")
        .orderBy("createdAt", "desc")
        .get();

      querySnapshot.forEach(function (doc) {
        const timestamp = {
          nanoseconds: doc.data().createdAt.nanoseconds,
          seconds: doc.data().createdAt.seconds,
        };
        var date = new Date(timestamp.seconds * 1000);
        posts.push({
          key: doc.id,
          text: doc.data().text,
          status: doc.data().status === true ? "Sim" : "Não",
          createdAt: date.toLocaleString(),
        });
      });
      setDados(posts);
      setTotal(posts.length);
      console.log(posts);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    setIsLoading(false);
  }

  async function handleDeleteAll() {
    setIsLoading(true);
    try {
      const query = await firebase
        .firestore()
        .collection("oqueeumando")
        .doc(collection)
        .collection("dados")
        .orderBy("createdAt", "desc")
        .get();
      query.forEach((element) => {
        element.ref.delete();
      });
      submitLogin();
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    // submitLogin();
    getCollectionList();
  }, []);

  return isLoading ? (
    <div className="spin-loader">
      <Spin />
    </div>
  ) : (
    <div style={{ width: "100%" }}>
      <h2 style={{ padding: "20px", textAlign: "center" }}>
        Dashboard do Oqueeumando | Total: {total}
      </h2>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Select
          placeholder="Selecione uma opção..."
          onChange={(value) => {
            reloadTable(value);
          }}
          value={collection}
        >
          {collectionList.map(item => (
            <Option key={item} value={item}>{item}</Option>
          ))}
          
          {/* <Option value="piadas">piadas</Option> */}
          {/* <Option value="other">other</Option> */}
        </Select>
      </div>

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
        {collection && (
          <Popconfirm
            title="Deseja realmente deletar todos os registros?"
            onConfirm={handleDeleteAll}
          >
            <Button style={{ marginRight: "10px" }} type="default">
              Deletar todos
            </Button>
          </Popconfirm>
        )}

        <CsvDownloader
          style={{ marginRight: "10px" }}
          filename="DadosFishingSegInfo"
          extension=".csv"
          separator=";"
          columns={headers}
          datas={dados}
          text="DOWNLOAD"
        >
          <Button
            style={{ display: "flex", alignItems: "center" }}
            icon={<FileMarkdownOutlined />}
            type="default"
          >
            Download
          </Button>
        </CsvDownloader>
        <Link to={"/"} style={{ marginRight: "10px" }}>
          <Button type="primary">Voltar</Button>
        </Link>
        <Link to={"/cadastro"}>
          <Button type="primary">Cadastro</Button>
        </Link>
      </div>
    </div>
  );
}

export default Listar;
