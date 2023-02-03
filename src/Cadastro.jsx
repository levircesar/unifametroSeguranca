import { useState } from "react";
import "./App.css";
import { firestore, firebase } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Col, Form, Input, Popconfirm, Row, Select, Spin } from "antd";
import TextArea from "antd/lib/input/TextArea";

function Cadastro() {
  const [isLoading, setIsLoading] = useState(false);

  const docs = ["cantadas", "piadas", "whatsapp"];

  let navigate = useNavigate();
  function goToDashboard() {
    navigate("/dashboard");
  }

  // async function submitLogin(e) {
  //   setIsLoading(true);
  //   e.preventDefault();
  //   if (login.trim() === "" || password.trim() === "") {
  //     setLoginErro(true);
  //     setIsLoading(false);
  //     return;
  //   }
  //   const form = {
  //     text: "Vem de zap linda",
  //     status: false,
  //   };
  //   // console.table(dados);
  //   try {
  //     async function saveInDatabase(item) {
  //       await firestore.collection("oqueeumando").doc(item.type).add({
  //         status: item.status,
  //         text: item.text,
  //         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       });
  //     }
  //     await firestore.collection("oqueeumando").doc("whatsapp").add({
  //       status: false,
  //       type: 0,
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //     });

  //     setRemember(false);
  //     setPassword("");
  //     setLogin("");
  //     setLoginErro(false);
  //     alerta();
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  //   setIsLoading(false);
  // }


  const { Option } = Select;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const [form] = Form.useForm();

  const onGenderChange = (value) => {
    switch (value) {
      case "male":
        form.setFieldsValue({ note: "Hi, man!" });
        break;
      case "female":
        form.setFieldsValue({ note: "Hi, lady!" });
        break;
      case "other":
        form.setFieldsValue({ note: "Hi there!" });
        break;
      default:
    }
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
      form.resetFields();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    console.log(values);
    console.log(values.type);
    setIsLoading(false);
    
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
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
            <Option value="cantadas">cantadas</Option>
            <Option value="piadas">piadas</Option>
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
    </>
  );
}

export default Cadastro;
