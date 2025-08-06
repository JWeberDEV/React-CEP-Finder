// Importações necessárias de bibliotecas e componentes para o funcionamento da ferramenta
import "./App.css";
import { AiOutlineSearch } from "react-icons/ai";
import { Button, Input, Container, Row, Col, Spinner } from "reactstrap";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import Response from "./components/Form";
import api from "./services/api";
import Select from "react-select";

function App() {
  //Criação de estado que recebe o valor vindo do input
  const [input, setInput] = useState("");
  const [formData] = useState({
    state: "",
    city: "",
    street: "",
  });
  //Criação de estado que recebe o retorno da API
  const [cep, setCep] = useState();
  //Criação de estado que ajusta afuncionalidade do botão
  const [isLoading, setLoading] = useState(false);
  // criação de estado que ajusta a funcionalidade do botão de endereço
  const [adress, setAddress] = useState(false);
  // Criação de estado que recebe os estados brasileiros
  const [states, setStates] = useState([]);
  // Criação de estado que recebe as cidades brasileiras
  const [cities, setCities] = useState([]);
  //Criação das de tamanhos de pixels que ajustam o tamanho da tela
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1023px)" });
  const isMinDesktop = useMediaQuery({
    minWidth: "769px",
    maxWidth: "1200px",
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

  const getStates = async () => {
    try {
      const response = await api.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`
      );

      const options = response.data.map((element) => ({
        value: element.id,
        label: element.sigla,
      }));

      setStates(options);
    } catch {
      toast.error("Não foi possível carregar os estados", {
        theme: "dark",
      });
    }
  };

  const getCities = async (args) => {
    try {
      const response = await api.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${args}/municipios`
      );

      const options = response.data.map((element) => ({
        value: element.id,
        label: element.nome,
      }));

      setCities(options);
    } catch {
      toast.error("Não foi possível carregar as cidades", {
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    getStates();
  }, []);

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      searchCep();
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: "hsla(0, 0%, 40%, 1.00)", // cor do texto
      backgroundColor: state.isFocused ? "#f0f0f0" : "white", // cor de fundo ao focar
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "hsla(0, 0%, 40%, 1.00)", // cor do texto selecionado
    }),
  };

  async function searchCep(data) {
    // Verifica se possui algum valor na variável data.
    if (data) {
      try {
        setLoading(true);
        const response = await api.get(
          `${data.state.label}/${data.city.label}/${data.street}/json`
        );
        console.log("response:", response.data);

        if (response.data.erro || response.data.length === 0) {
          toast.error("Cep invalido ou não encontrado", {
            theme: "dark",
          });
        }
        setCep(response.data[0]);
      } catch (error) {
        toast.error("Cep invalido ou não encontrado", {
          theme: "dark",
        });
      } finally {
        setInput("");
        setLoading(false);
      }
    } else {
      // Verifica se o input está vazio ou se o tamanho do input é maior que 9 caracteres
      if (!input) {
        toast.warning("Infomre o CEP", {
          theme: "dark",
        });
        return;
      }
      // Verifica se o tamanho do input é maior que 9 caracteres
      if (input.length > 9) {
        toast.warning("CEP invalido", {
          theme: "dark",
        });
        return;
      }

      let cep = input.replace("-", "").trim(); //Remove o traço do cep

      //Tratamento de exeções da função que busca o cep
      try {
        setLoading(true);
        const response = await api.get(`${cep}/json`);

        if (response.data.erro) {
          // Se o cep não for encontrado, exibe um alerta
          toast.warning("CEP não encontrado", {
            theme: "dark",
          });
          return;
        }
        setCep(response.data);
        console.log("cep:", cep);
      } catch (error) {
        toast.warning("Cep invalido ou não encontrado", {
          theme: "dark",
        });
      } finally {
        setInput("");
        setLoading(false);
      }
    }
  }

  return (
    <>
      {(isMobile || isTablet) && (
        <Container>
          <h4 className="title">Consultor de CEP</h4>
          <Row className="d-flex flex-wrap align-items-center justify-content-center p-3">
            <Col md="8" xs="12" className="px-0">
              {adress ? (
                <>
                  <Formik initialValues={formData} onSubmit={searchCep}>
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                      isSubmitting,
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col md="10" xs="9" className="text-start">
                            <Select
                              className="text-start"
                              name="state"
                              options={states}
                              value={values.state}
                              styles={customStyles}
                              placeholder="Selecione o estado"
                              onChange={(selected) => {
                                setFieldValue("state", selected);
                                getCities(selected.value);
                              }}
                            />
                          </Col>
                          <Col md="2" xs="2" className="text-end">
                            <Button
                              color="success"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              <AiOutlineSearch size={25} color="#fff" />
                            </Button>
                          </Col>
                          <Col md="12" className="mt-2 text-start">
                            <Select
                              className="text-start"
                              options={cities}
                              value={values.city}
                              styles={customStyles}
                              placeholder="Selecione a cidade"
                              handleChange={handleChange}
                              onChange={(selected) => {
                                setFieldValue("city", selected);
                              }}
                            />
                          </Col>
                          <Col md="12" className="mt-2">
                            <Input
                              placeholder="Informe a rua"
                              name="street"
                              value={values.street}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            ></Input>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </>
              ) : (
                <Input
                  type="text"
                  placeholder="Informe o cep..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDownHandler}
                />
              )}
            </Col>

            {/* ()=>searchCep() exemplo de uma callbak, que serve para não executar a chamada da função no momento em que a aplicação é iniciada*/}
            <Col
              md={adress ? 2 : 4}
              xs={adress ? 4 : 12}
              className={isMobile ? "text-center mt-2" : "text-center"}
            >
              {adress ? (
                <></>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  color="success"
                  disabled={isLoading}
                  onClick={() => searchCep()}
                  className="me-1"
                >
                  {/* O Ternário serve para definir o estado do botão, para quando a função estiver esperando um retorno da requisção. O botão será bloqueádo e aparecerá uma animação para mostrar que está buscando o cep */}
                  {isLoading ? (
                    <Spinner color="light" type="grow" />
                  ) : (
                    <AiOutlineSearch size={20} color="#fff" />
                  )}
                </Button>
              )}
              <Button
                type="button"
                color="primary"
                size="sm"
                onClick={() => setAddress((prev) => !prev)}
                style={{ fontSize: 10 }}
                className="px-0 py-2"
              >
                {!adress ? "Buscar por endereço" : "Buscar por CEP"}
              </Button>
            </Col>
            {cep && (
              // prop é uma propriedade que você cria para um componente
              <Col
                lg="12"
                md="12"
                xs="12"
                className=" border rounded-4 p-3 mt-3 bg-white"
              >
                <Response
                  cep={cep.cep}
                  logradouro={cep.logradouro}
                  complemento={cep.complemento}
                  bairro={cep.bairro}
                  localidade={cep.localidade}
                  uf={cep.uf}
                />
              </Col>
            )}
          </Row>
        </Container>
      )}
      {(isMinDesktop || isDesktop) && (
        <Container>
          <h1 className="title">Consultor de CEP</h1>
          <Row className="d-flex justify-content-center p-3">
            <Col md="8" sm="8">
              {adress ? (
                <>
                  <Formik initialValues={formData} onSubmit={searchCep}>
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                      isSubmitting,
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col md="10" className="text-start">
                            <Select
                              className="text-start"
                              name="state"
                              options={states}
                              value={values.state}
                              styles={customStyles}
                              placeholder="Selecione o estado"
                              onChange={(selected) => {
                                setFieldValue("state", selected);
                                getCities(selected.value);
                              }}
                            />
                          </Col>
                          <Col md="2" className="text-end">
                            <Button
                              color="success"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              <AiOutlineSearch size={25} color="#fff" />
                            </Button>
                          </Col>
                          <Col md="6" className="mt-2 text-start">
                            <Select
                              className="text-start"
                              options={cities}
                              value={values.city}
                              styles={customStyles}
                              placeholder="Selecione a cidade"
                              handleChange={handleChange}
                              onChange={(selected) => {
                                setFieldValue("city", selected);
                              }}
                            />
                          </Col>
                          <Col md="6" className="mt-2">
                            <Input
                              placeholder="Informe a rua"
                              name="street"
                              value={values.street}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            ></Input>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </>
              ) : (
                <Input
                  type="text"
                  placeholder="Informe o cep..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDownHandler}
                />
              )}
            </Col>
            {adress ? (
              <></>
            ) : (
              <Col md="1" sm="2" className="text-center">
                {/* ()=>searchCep() exemplo de uma callbak, que serve para não executar a chamada da função no momento em que a aplicação é iniciada*/}
                <Button
                  type="button"
                  disabled={isLoading}
                  color="success"
                  onClick={() => searchCep()}
                >
                  {/* O Ternário serve para definir o estado do botão, para quando a função estiver esperando um retorno da requisção. O botão será bloqueádo e aparecerá uma animação para mostrar que está buscando o cep */}
                  {isLoading ? (
                    <Spinner color="light" type="grow" />
                  ) : (
                    <AiOutlineSearch size={25} color="#fff" />
                  )}
                </Button>
              </Col>
            )}
            <Col md="3" sm="2" className="text-end">
              <Button
                type="button"
                color="primary"
                onClick={() => setAddress((prev) => !prev)}
                style={{ fontSize: 14 }}
              >
                {!adress ? "Buscar por endereço" : "Buscar por CEP"}
              </Button>
            </Col>
            {cep && (
              // prop é uma propriedade que você cria ou que já existe para enviar informações de configuração ou valores para um componente
              <Col
                lg="12"
                md="12"
                className=" border rounded-4 p-3 mt-3 bg-white"
              >
                <Response
                  cep={cep.cep}
                  logradouro={cep.logradouro}
                  complemento={cep.complemento}
                  bairro={cep.bairro}
                  localidade={cep.localidade}
                  uf={cep.uf}
                />
              </Col>
            )}
          </Row>
        </Container>
      )}
    </>
  );
}

export default App;
