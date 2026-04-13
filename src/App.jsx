import './App.css'
import { Form } from './components/Form'

function App() {
  return (
    <div className="container px-4">
      <h3 className="text-sm font-medium text-slate-700 mt-1 mb-3">
        Após preencher os campos, clique no botão Calcular!
      </h3>

      <Form />
    </div>
  )
}

export default App
