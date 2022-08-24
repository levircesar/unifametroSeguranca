import { useState } from "react";
import "./App.css";
import { firestore } from "../config/firebase";

function App() {
  const [remember, setRemember] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginErro, setLoginErro] = useState(false);

  async function submitLogin(e) {
    e.preventDefault();
    if (login === "" || password === "") {
      setLoginErro(true);
      return;
    }
    const dados = {
      login: login,
      remember: remember,
    };
    console.table(dados);
    try {
      await firestore.collection("dados").add({
        login: login,
        remember: remember,
      });

      setRemember(false);
      setPassword("");
      setLogin("");
      setLoginErro(false);
      alerta();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  function handleChange() {
    setRemember(!remember);
  }

  function alerta() {
    alert("Você quase sofreu um fishing ! - Tenha mais cuidado.");
  }

  return (
    <div
      id="page-login-index"
      className="App format-site path-login gecko dir-ltr lang-pt_br yui-skin-sam yui3-skin-sam educacaoonline-unifametro-edu-br pagelayout-login course-1 context-1 notloggedin moove-login"
    >
      <div
        id="page-login-index"
        className="format-site path-login gecko dir-ltr lang-pt_br yui-skin-sam yui3-skin-sam educacaoonline-unifametro-edu-br pagelayout-login course-1 context-1 notloggedin moove-login"
      >
        <div
          className="toast-wrapper mx-auto py-0 fixed-top"
          role="status"
          aria-live="polite"
        ></div>

        <div id="page-wrapper">
          <div>
            <a className="sr-only sr-only-focusable" href="#maincontent">
              Ir para o conteúdo principal
            </a>
          </div>

          <div id="page" className="container-fluid mt-0">
            <div id="page-content" className="row">
              <div id="region-main-box" className="col-12">
                <section id="region-main" className="col-12">
                  <span
                    className="notifications"
                    id="user-notifications"
                  ></span>
                  <div role="main">
                    <span id="maincontent"></span>
                    <div className="my-1 my-sm-5"></div>

                    <div className="row justify-content-center logo">
                      <img
                        src="//educacaoonline.unifametro.edu.br/pluginfile.php/1/theme_moove/logo/1650979445/marca-educacao%20online.png"
                        title="UNIFAMETRO 2022"
                        alt="UNIFAMETRO 2022"
                      />
                    </div>

                    <div className="row justify-content-center my-4">
                      <div className="col-12 col-md-12 col-lg-8">
                        {loginErro && (
                          <div className="loginerrors">
                            <a
                              href="#"
                              id="loginerrormessage"
                              className="accesshide"
                            >
                              Nome de usuário ou senha errados. Por favor tente
                              outra vez.
                            </a>
                            <div className="alert alert-danger" role="alert">
                              Nome de usuário ou senha errados. Por favor tente
                              outra vez.
                            </div>
                          </div>
                        )}
                        <div className="card loginpanel">
                          <div className="card-block">
                            <div className="row">
                              <div className="col-md-7 instructions">
                                <h2>UNIFAMETRO 2022</h2>
                                <hr align="left" />

                                <div className="m-t-1">
                                  <i className="fa fa-check-circle-o"></i>O uso
                                  de Cookies deve ser permitido no seu navegador
                                  <a
                                    className="btn btn-link p-0"
                                    role="button"
                                    data-html="true"
                                    data-trigger="focus"
                                  >
                                    <i
                                      className="icon fa slicon-question text-info fa-fw"
                                      title="Ajuda com O uso de Cookies deve ser permitido no seu navegador"
                                      aria-label="Ajuda com O uso de Cookies deve ser permitido no seu navegador"
                                    ></i>
                                  </a>
                                </div>

                                <h3 className="m-t-1">
                                  Esta é a sua primeira vez aqui?
                                </h3>
                                <div>
                                  <p dir="ltr"></p>
                                  <h3>Esta é a sua primeira vez aqui?</h3>
                                  <br />
                                  <p dir="ltr">
                                    Para acessar o ambiente utilize as mesmas
                                    credenciais do Portal Acadêmico.
                                  </p>
                                  <p dir="ltr">
                                    Caso não consiga efetuar seu login, envie
                                    e-mail para:{" "}
                                    <strong>suporte@unifametro.edu.br</strong>
                                  </p>
                                </div>
                              </div>

                              <div className="col-md-5 form">
                                <input
                                  id="anchor"
                                  type="hidden"
                                  name="anchor"
                                  value=""
                                />

                                <p className="welcome">
                                  Você possui uma conta?
                                </p>
                                <form onSubmit={(e) => submitLogin(e)}>
                                  <label htmlFor="username" className="sr-only">
                                    Identificação de usuário
                                  </label>
                                  <div className="input-group input-group-username">
                                    <span className="input-group-addon">
                                      <i className="fa fa-user-circle"></i>
                                    </span>
                                    <input
                                      type="text"
                                      id="username"
                                      value={login}
                                      className="form-control"
                                      placeholder="Identificação de usuário"
                                      onChange={(e) => setLogin(e.target.value)}
                                    />
                                  </div>

                                  <label htmlFor="password" className="sr-only">
                                    Senha
                                  </label>
                                  <div className="input-group input-group-password">
                                    <span className="input-group-addon">
                                      <i className="fa fa-lock"></i>
                                    </span>
                                    <input
                                      type="password"
                                      id="password"
                                      className="form-control"
                                      placeholder="Senha"
                                      value={password}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                    />
                                  </div>

                                  <div className="rememberpass m-t-1">
                                    <input
                                      type="checkbox"
                                      checked={remember}
                                      onChange={handleChange}
                                    />
                                    <label htmlFor="rememberusername">
                                      Lembrar identificação de usuário
                                    </label>
                                  </div>

                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    id="loginbtn"
                                  >
                                    Acessar
                                  </button>
                                </form>
                                <div className="forgetpass m-t-1">
                                  <p>
                                    <a href="http://educacaoonline.unifametro.edu.br/login/forgot_password.php">
                                      Esqueceu o seu usuário ou senha?
                                    </a>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
