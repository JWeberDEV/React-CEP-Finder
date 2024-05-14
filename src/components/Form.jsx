
// Componente é uma função que retorna trechos de html
// para receber uma prop, basta passar o parâmetro props(boa prática) na criação doelemento
// feito desta forma, para que possa exemplificar a criação de um componente
function Form(props){
  return (
    <>
      <main className="text-dark">
        <h2>CEP: {props.cep}</h2>

        <div>Rua: {props.logradouro}</div>
        <div>Complemento: {props.complemento}</div>
        <div>Bairro: {props.bairro}</div>
        <div>Cidade: {props.localidade} - {props.uf}</div>

      </main>
    </>
  )
}

export default Form