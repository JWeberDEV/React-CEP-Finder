# 🔍 Consultor de CEP

Um projeto desenvolvido com **React**, utilizando **Formik**, **Reactstrap** e **React-Select** para criar uma ferramenta responsiva que permite **consultar CEPs e buscar endereços no Brasil**.  

---

## ✅ **Funcionalidades**
✔ Consultar informações de um **CEP**  
✔ Buscar **CEP pelo endereço** (Estado, Cidade e Rua)  
✔ Responsividade para **mobile, tablet e desktop**  
✔ Feedback amigável com **toast notifications**  
✔ Alternar entre **modo CEP** e **modo Endereço**  
✔ Integração com **API ViaCEP** e **IBGE** para dados oficiais  

---

## 🖼 **Demonstração**
> (Adicione um print do projeto aqui)
![Preview do projeto](./assets/preview.png)

---

## 🛠 **Tecnologias Utilizadas**
- **React** (hooks, componentização)
- **Formik** (manipulação de formulários)
- **Reactstrap** (componentes responsivos com Bootstrap)
- **React-Select** (dropdown estilizado)
- **React-Toastify** (notificações)
- **Axios** (requisições HTTP)
- **IBGE API** (lista de estados e cidades)
- **ViaCEP API** (busca de CEPs)

---

## 📂 **Estrutura do Projeto**

```js
src/
│
├── components/
│ ├── Form.jsx # Componente para exibir o resultado do CEP
│
├── services/
│ └── api.js # Configuração do Axios para chamadas à API
│
├── App.jsx # Componente principal com lógica de busca
├── App.css # Estilos globais
└── main.jsx # Ponto de entrada da aplicação
```

---

## ▶ **Como Rodar o Projeto**

### **Pré-requisitos**
- [Node.js](https://nodejs.org/) instalado
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### **Instalação**
```bash
# Clone este repositório
git clone https://github.com/seu-usuario/nome-do-repositorio.git

# Acesse a pasta do projeto
cd nome-do-repositorio

# Instale as dependências
yarn install
yarn dev

```

O projeto estará disponível em: https://github.com/JWeberDEV/React-CEP-Finder
.

🔍 Como Usar

Escolha Buscar por CEP ou Buscar por Endereço

Digite o CEP ou selecione Estado → Cidade → Rua

Clique em Buscar e visualize as informações detalhadas

📫 Contato

📧 E-mail: weberjosias1@gmail.com

📞 WhatsApp: +55 (51) 99490-2991