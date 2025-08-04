// Importações necessárias de bibliotecas e componentes para o funcionamento da ferramenta
import "./App.css";
import { AiOutlineSearch } from "react-icons/ai";
import { Button, Input, Container, Row, Col, Spinner } from "reactstrap";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
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

  async function searchCep() {
    console.log(location);

    if (!input) {
      return alert("Infomre o CEP");
    }

    if (input.length > 9) {
      return alert("CEP invalido");
    }

    let cep = input.replace("-", "").trim(); //Remove o traço do cep

    //Tratamento de exeções da função do botão
    try {
      setLoading(true);
      const response = await api.get(`${cep}/json`);
      if (response.data.erro) {
        throw new Error("CEP não encontrado");
      }
      setCep(response.data);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setInput("");
      setLoading(false);
    }
  }

  const getStates = async () => {
    try {
      const response = await api.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`
      );

      const options = response.data.map((element) => ({
        value: element.id,
        label: element.nome,
      }));

      setStates(options);
    } catch {
      // toast.error("Não foi possível carregar os setores", {
      //   theme: "colored",
      // });
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
      // toast.error("Não foi possível carregar os setores", {
      //   theme: "colored",
      // });
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

  return (
    <>
      {(isMobile || isTablet) && (
        <Container>
          <h4 className="title">Consultor de CEP</h4>
          <Row className="d-flex flex-wrap align-items-center justify-content-center p-3">
            <Col xs="7">
              <Input
                type="text"
                placeholder="Informe o cep..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Col>

            <Col xs="2">
              {/* ()=>searchCep() exemplo de uma callbak, que serve para não executar a chamada da função no momento em que a aplicação é iniciada*/}
              <Button
                type="button"
                size="sm"
                disabled={isLoading}
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
            <Col xs="3" className="text-end">
              <Button className="p-1" style={{ fontSize: 10 }}>
                {" "}
                Não sei o Cep
              </Button>
            </Col>
            {cep && (
              // prop é uma propriedade que você cria para um componente
              <Col md="12" className=" border rounded-4 p-3 mt-3 bg-white">
                <Form
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
        <Container fluid>
          <h1 className="title">Consultor de CEP</h1>
          <Row className="d-flex justify-content-center p-3">
            <Col md="8" sm="8">
              {adress ? (
                <>
                  <Formik initialValues={formData}>
                    <Form>
                      <Row>
                        <Col md="12" className="text-start">
                          <Select
                            className="text-start basic-single"
                            options={states}
                            value={location.state}
                            styles={customStyles}
                            placeholder="Selecione o estado"
                            onChange={(e) => getCities(e.value)}
                          />
                        </Col>
                        <Col md="6" className="mt-2 text-start">
                          <Select
                            className="text-start basic-single"
                            options={cities}
                            value={location.city}
                            styles={customStyles}
                            placeholder="Selecione a cidade"
                          />
                        </Col>
                        <Col md="6" className="mt-2">
                          <Input
                            placeholder="Informe a rua"
                            value={location.street}
                          ></Input>
                        </Col>
                      </Row>
                    </Form>
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
              <Col md="12" className=" border rounded-4 p-3 mt-3 bg-white">
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
