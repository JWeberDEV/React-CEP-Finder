import "./App.css";
import { AiOutlineSearch } from "react-icons/ai";
import Form from "./components/Form";
import { Button, Input, Container, Row, Col, Spinner } from "reactstrap";
import { useMediaQuery } from "react-responsive";
// importação do usestate que serve para trabalhar com estados
import { useState } from "react";
import api from "./services/api";

function App() {
  //Criação de estado que recebe o valor vindo do input
  const [input, setInput] = useState("");
  //Criação de estado que recebe o retorno da API
  const [cep, setCep] = useState();
  //Criação de estado que ajusta afuncionalidade do botão
  const [isLoading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1023px)" });
  const isMinDesktop = useMediaQuery({
    minWidth: "769px",
    maxWidth: "1200px",
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

  async function searchCep() {
    // 999999999/json/

    if (!input) {
      return alert("Infomre o CEP");
    }
    //Tratamento de exeções da função do botão
    try {
      setLoading(true);
      const response = await api.get(`${input}/json`);
      setCep(response.data);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setInput("");
      setLoading(false);
    }
  }

  return (
    <>
      {(isMobile || isTablet) && (
        <Container>
          <h4 className="title">Consultor de CEP</h4>
          <Row className="d-flex justify-content-center p-3">
            <Col md="5" sm="8">
              <Input
                type="text"
                placeholder="Informe o cep..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Col>

            <Col md="1" sm="2">
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
        <Container>
          <h1 className="title">Consultor de CEP</h1>
          <Row className="d-flex justify-content-center p-3">
            <Col md="11" sm="8">
              <Input
                type="text"
                placeholder="Informe o cep..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Col>

            <Col md="1" sm="2">
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
    </>
  );
}

export default App;
