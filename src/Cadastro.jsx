import { useState ,useEffect } from "react";
import "./App.css";
import { firestore, firebase } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Col, Form, Input, message, Popconfirm, Row, Select, Spin } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {Piadas} from './utils/Piadas'

function Cadastro() {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [collectionList, setCollectionList] = useState([]);
  let navigate = useNavigate();
  function goToDashboard() {
    navigate("/dashboard");
  }

  
  const { Option } = Select;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Ação concluída com sucesso!',
    });
  };
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Ocorreu um erro !',
    });
  };
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      await firestore.collection("oqueeumando")
        .doc(values.type).collection("dados").add({
        status: values.status,
        text: values.textArea,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      success()
      form.resetFields();
    } catch (e) {
      error()
      console.error("Error adding document: ", e);
    }
    // console.log(values);
    // console.log(values.type);
    setIsLoading(false);
    
  };

  const onReset = () => {
    form.resetFields();
  };

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
        // console.log(doc.id, '=>', doc.data())
       } );
      setCollectionList(posts);
      // console.log(posts);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    setIsLoading(false);
  }

  async function cadastrarTudo() {
    setIsLoading(true);
    try {
      for (var i = 0; i < Piadas.length;) {
       
      
        await firestore.collection("oqueeumando")
          .doc("piadas").collection("dados").add({
          status: true,
          text: Piadas[i].frase,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(i++);
      }
      success()
      form.resetFields();
    } catch (e) {
      error()
      console.error("Error adding document: ", e);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    // submitLogin();
    getCollectionList();
    // console.log(Assuntos)
    // cadastrarTudo()
  }, []);
  return (
    <>
      {contextHolder}
      {isLoading && (
        <div className="spin-loader overlay relative">
          <Spin />
        </div>
      )}
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        initialValues={{ status: true }}
        style={{ maxWidth: 600 }}
      >
        {/* <Form.Item name="note" label="Note" rules={[{ required: true }]}>
          <Input />
        </Form.Item> */}
        <Form.Item name="textArea" label="TextArea" rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
          <Select
            placeholder="Selecione uma opção..."
            // onChange={onGenderChange}
            allowClear
          >
            {collectionList.map(item => (
            <Option key={item} value={item}>{item}</Option>
            ))}
            {/* <Option value="other">other</Option> */}
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.type !== currentValues.type
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("type") === "other" ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item
          name="status"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Ativo</Checkbox>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
          <Popconfirm title="Deseja realmente resetar?" onConfirm={onReset}>
            <Button htmlType="button">Resetar</Button>
          </Popconfirm>
        </Form.Item>
      </Form>
      <Link to={"/"} style={{ marginRight: "10px" }}>
          <Button type="primary">Voltar</Button>
      </Link>
    </>
  );
}

export default Cadastro;
