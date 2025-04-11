// importação do axios, para poder trabalhar com protocolos http
import axios from "axios";
// configuração da URL base da API que consulta o CEP
const api = axios.create({
  baseURL: 'https://viacep.com.br/ws/'
})

export default api;