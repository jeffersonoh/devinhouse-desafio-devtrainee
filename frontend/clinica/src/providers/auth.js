import React, { useEffect, useState } from 'react';
import { exames, listaDeAgenda, listaDeClientes } from 'api/apiTeste'
import axios from 'axios';

export const AuthContext = React.createContext({});

const CLIENTE_INICIAL = {
  nome: "",
  cpf: "",
  ddn: ""
};

const MARCACAO_INICIAL = {
  data: "",
  exame: "",
  pacienteNome: "",
  cpf: ""
};

const DATAAGENDA_INICIAL = {
  data: "",
  hora: ""
}

const AuthProvider = (props) => {
  const [index, setIndex] = useState(0);
  const [dialogo, setDialogo] = useState(false);
  const [resposta, setResposta] = useState(0);

  const [linhaSelecionadaCliente, setLinhaSelecionadaCliente] = useState({ id: 0 });
  const [clientes, setClientes] = useState({});
  const [novoCliente, setNovoCliente] = useState(CLIENTE_INICIAL);
  const [pesquisaCliente, setPesquisaCliente] = useState("");
  const [clienteCriadoComboBox, setClienteCriadoComboBox] = useState(false);

  const [linhaSelecionadaAgenda, setLinhaSelecionadaAgenda] = useState({ id: 0 });
  const [marcacoes, setMarcacoes] = useState({});
  const [novaMarcacao, setNovaMarcacao] = useState(MARCACAO_INICIAL);
  const [pesquisaMarcacao, setPesquisaMarcacao] = useState("");
  const [examesOfertados, setExamesOfertados] = useState({});
  const [dataAgenda, setDataAgenda] = useState(DATAAGENDA_INICIAL);

  const [chamadoHTTP, setChamadoHTTP] = useState("");
  const [atualizar, setAtualizar] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/clinica-devinhouse/v1/exames")
      .then(response => {
        setExamesOfertados(response.data);
      })

    axios.get("http://localhost:8080/clinica-devinhouse/v1/clientes/procurar/todos")
      .then(response => {
        setClientes(response.data);
      })

    axios.get("http://localhost:8080/clinica-devinhouse/v1/agenda/todos")
      .then(response => {
        setMarcacoes(response.data);
      })
  }, [atualizar])

  useEffect(() => {
    setAtualizar(!atualizar);
  }, [])
  useEffect(() => {

    switch (chamadoHTTP) {
      case "POST_NOVOCLIENTE":
        POSTCliente();
        break;
      case "PUT_CLIENTE":
        PUTCliente();
        break;
      case "DELETE_CLIENTE":
        DELETECliente();
        break;
      case "FIND_CLIENTE":
        FINDCliente();
        break;
      case "POST_NOVAMARCACAO":
        POSTAgenda();
        break;
      case "POST_NOVOCLIENTECOMBOBOX":
        POSTClienteComboBox();
        break;
      case "PUT_AGENDA":
        PUTAgenda();
        break;
      case "DELETE_AGENDA":
        DELETEAgenda();
        break;
      case "FIND_AGENDA":
        FINDAgenda();
        break;
      case "GET_LISTA":
        GETListaCliente();
        break;
      case "GET_LISTAAGENDA":
        GETListaAgenda();
        break;
    }
    setChamadoHTTP("");
  }, [chamadoHTTP])

  function validarCliente(cliente) {
    if (cliente.nome.length === 0) {
      setResposta(907);
      return false;
    }
    if (cliente.cpf.length !== 14) {
      setResposta(908);
      return false;
    }
    if (cliente.ddn.length !== 10) {
      setResposta(909);
      return false;
    }
    return true;
  }

  function validarMarcacao(agenda) {
    const validarHora = dataAgenda.hora.split(":");
    if (agenda.pacienteNome.length === 0) {
      setResposta(901);
      return false;
    }
    if (dataAgenda.data.length !== 10) {
      setResposta(902);
      return false;
    }
    if (dataAgenda.hora.length !== 5) {
      setResposta(903);
      return false;
    }
    if (validarHora[0] >= 24 || validarHora[0] < 0) {
      setResposta(904);
      return false;
    }
    if (validarHora[1] >= 60 || validarHora[1] < 0) {
      setResposta(905);
      return false;
    }
    if (agenda.exame.length === 0) {
      setResposta(906);
      return false;
    }
    return true;
  }

  const POSTAgenda = () => {
    if (validarMarcacao(novaMarcacao)) {
      axios.post("http://localhost:8080/clinica-devinhouse/v1/agenda/cadastrar", novaMarcacao)
        .then(response => {
          setAtualizar(!atualizar);
          setNovaMarcacao(MARCACAO_INICIAL);
          setDataAgenda(DATAAGENDA_INICIAL)
          setResposta(201);
          setIndex(1);
        })
        .catch(error => {
          setResposta(401);
        })
    }
  }

  const POSTClienteComboBox = () => {
    if (validarCliente(novoCliente)) {
      axios.post("http://localhost:8080/clinica-devinhouse/v1/clientes/cadastrar", novoCliente)
        .then(response => {
          setAtualizar(!atualizar);
          setNovoCliente(CLIENTE_INICIAL);
          setClienteCriadoComboBox(false);
          setResposta(204);
          setIndex(2);
        })
        .catch(error => {
          setResposta(404);
        })
    }
  }

  const PUTAgenda = () => {
    if (validarMarcacao(linhaSelecionadaAgenda)) {
      axios.put(`http://localhost:8080/clinica-devinhouse/v1/agenda/atualizar/${linhaSelecionadaAgenda.id}`, linhaSelecionadaAgenda)
        .then(response => {
          setAtualizar(!atualizar);
          setResposta(202);
          setDataAgenda(DATAAGENDA_INICIAL)
          setLinhaSelecionadaAgenda({ id: 0 });
          setIndex(1)
        })
        .catch(error => {
          setResposta(402);
        })
    }
  }

  const DELETEAgenda = () => {
    console.log("linhaSelecionadaAgenda", linhaSelecionadaAgenda);
    axios.delete(`http://localhost:8080/clinica-devinhouse/v1/agenda/deletar/${linhaSelecionadaAgenda.id}`)
      .then(response => {
        setAtualizar(!atualizar);
        setResposta(203);
        setDataAgenda(DATAAGENDA_INICIAL)
        setLinhaSelecionadaAgenda({ id: 0 });
        setIndex(1)
      })
      .catch(error => {
        console.log(error);
        setResposta(403);
      })

  }

  const FINDAgenda = () => {
    if (pesquisaMarcacao.length > 0) {
      axios.get(`http://localhost:8080/clinica-devinhouse/v1/agenda/procurar/filtrar?cpf=${pesquisaMarcacao}`)
        .then(response => {
          setMarcacoes(response.data);
          setResposta(207);
        })
    }
  }

  const GETListaAgenda = () => {
    axios.get("http://localhost:8080/clinica-devinhouse/v1/agenda/todos")
      .then(response => {
        setMarcacoes(response.data);
      })
  }

  const POSTCliente = () => {
    if (validarCliente(novoCliente)) {
      axios.post("http://localhost:8080/clinica-devinhouse/v1/clientes/cadastrar", novoCliente)
        .then(response => {
          setAtualizar(!atualizar);
          setNovoCliente(CLIENTE_INICIAL);
          setResposta(204);
          setIndex(1);
        })
        .catch(error => {
          setResposta(404);
        })
    }
  }

  const PUTCliente = () => {
    if (validarCliente(linhaSelecionadaCliente)) {
      axios.put(`http://localhost:8080/clinica-devinhouse/v1/clientes/atualizar/${linhaSelecionadaCliente.id}`, linhaSelecionadaCliente)
        .then(response => {
          setAtualizar(!atualizar);
          setLinhaSelecionadaCliente({ id: 0 });
          setResposta(205);
          setIndex(1)
        })
        .catch(error => {
          setResposta(405);
        })
    }
  }

  const DELETECliente = () => {
    axios.delete(`http://localhost:8080/clinica-devinhouse/v1/clientes/deletar/${linhaSelecionadaCliente.id}`)
      .then(response => {
        setAtualizar(!atualizar);
        setLinhaSelecionadaCliente({ id: 0 });
        setResposta(206);
        setIndex(1)
      })
      .catch(error => {
        setResposta(406);
      })
  }

  const FINDCliente = () => {
    if (pesquisaCliente.length > 0) {
      axios.get(`http://localhost:8080/clinica-devinhouse/v1/clientes/procurar/filtrar?cpf=${pesquisaCliente}`)
        .then(response => {
          setClientes(response.data);
          setResposta(207);
        })
    }
  }

  const GETListaCliente = () => {
    axios.get("http://localhost:8080/clinica-devinhouse/v1/clientes/procurar/todos")
      .then(response => {
        setClientes(response.data);
      })
  }

  return (
    <AuthContext.Provider value={{
      index, setIndex,
      resposta, setResposta,
      novoCliente, setNovoCliente,
      chamadoHTTP, setChamadoHTTP,
      clientes, setClientes,
      linhaSelecionadaCliente, setLinhaSelecionadaCliente,
      dialogo, setDialogo,
      pesquisaCliente, setPesquisaCliente,
      linhaSelecionadaAgenda, setLinhaSelecionadaAgenda,
      marcacoes, setMarcacoes,
      novaMarcacao, setNovaMarcacao,
      pesquisaMarcacao, setPesquisaMarcacao,
      clienteCriadoComboBox, setClienteCriadoComboBox,
      examesOfertados, setExamesOfertados,
      dataAgenda, setDataAgenda,
      refresh, setRefresh
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useAuth = () => React.useContext(AuthContext);