import React, { Fragment, useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Toolbar, Typography, Paper, IconButton, Tooltip,
    InputBase
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import RefreshIcon from '@material-ui/icons/Refresh';
import { cpfMask } from 'utils/mask';
import moment from 'moment';
import { useStyles } from 'style/Style';
import { cabecalhoTabelaAgenda, MARCACAO_INICIAL } from 'api/apiTeste';
import { useAuth } from 'providers/auth';
import axios from 'axios';

let pagina = 1;
const AgendaLista = () => {
    const { linhaSelecionadaAgenda, setLinhaSelecionadaAgenda,
        setIndex, refresh, setRefresh, setResposta, setMarcacoesG } = useAuth();
    const classes = useStyles();

    const [itemPagina, setItempagina] = useState([]);
    const [marcacoes, setMarcacoes] = useState(MARCACAO_INICIAL);
    const [pesquisa, setPesquisa] = useState("");

    const procurarAgenda = () => {
        axios.get(`http://localhost:8080/clinica-devinhouse/v1/agenda/procurar/filtrar?cpf=${pesquisa}`)
            .then(response => {
                setMarcacoes(response.data);
                setPaginaLista(response.data);
                setResposta(207);
            })
    }

    const GETListaCompleta = () => {
        axios.get("http://localhost:8080/clinica-devinhouse/v1/agenda/todos")
            .then(response => {
                setMarcacoes(response.data);
                setPaginaLista(response.data);
                setMarcacoesG(response.data);
            })
    }

    useEffect(() => {
        GETListaCompleta();
        setRefresh(false);
        setPesquisa("");
        setLinhaSelecionadaAgenda({ ...linhaSelecionadaAgenda, id: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const setPaginaLista = (lista) => {
        const offSetLinhaPagina = pagina === 1 ? 1 : (pagina - 1) * 5 + 1
        const limiteLinhaPagina = pagina * 5;
        let paginaProvisoria = [];
        let linhaAtual = 1;

        lista.map((linha) => {
            if (linhaAtual <= limiteLinhaPagina) {
                if (linhaAtual >= offSetLinhaPagina) {
                    paginaProvisoria.push(linha);
                }
            }
            linhaAtual++;
        })

        setItempagina(paginaProvisoria);
    }

    const proximaPagina = () => {
        if (marcacoes.length > pagina * 5) {
            pagina++;
            setPaginaLista();
        }
    }

    const paginaAnterior = () => {
        if (pagina > 1) {
            pagina--;
            setPaginaLista();
        }
    }

    return (
        <Fragment>
            <Paper>
                <div className={classes.divPesquisa}>
                    <IconButton aria-label="Editar" onClick={() => {
                        if (pesquisa.length > 0) {
                            procurarAgenda();
                            setRefresh(true);
                        }
                    }}>
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        placeholder="Pesquisar"
                        className={classes.pesquisa}
                        title={"Apenas por CPF"}
                        value={pesquisa}
                        onChange={(e) => { setPesquisa(cpfMask(e.target.value)) }}
                    />
                    {refresh &&
                        <IconButton aria-label="Editar" onClick={() => {
                            GETListaCompleta();
                            setRefresh(false);
                            setPesquisa("");
                            setLinhaSelecionadaAgenda({ ...linhaSelecionadaAgenda, id: 0 });
                        }}>
                            <RefreshIcon />
                        </IconButton>
                    }
                </div>
                <Toolbar className={classes.toolbar} style={{ backgroundColor: linhaSelecionadaAgenda.id !== 0 ? "#ff8a80" : "#fff" }}>
                    <div>
                        {linhaSelecionadaAgenda.id !== 0
                            ? <Typography>Selecionado</Typography>
                            : <Typography>Agenda</Typography>
                        }
                    </div>
                    <div>
                        {linhaSelecionadaAgenda.id !== 0
                            ? //--------------------------------------
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <Tooltip title="Editar">
                                    <IconButton aria-label="Editar" onClick={() => setIndex(3)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                    <IconButton aria-label="Excluir" onClick={() => setIndex(4)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            : //--------------------------------------
                            <Tooltip title="Cadastrar">
                                <IconButton aria-label="Cadastrar" onClick={() => { setIndex(2) }}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                </Toolbar>
                <TableContainer>
                    {itemPagina.length === 0 &&
                        <Toolbar>
                            <Typography>
                                Não encontramos nenhuma marcação, cadastre a primeira!
                            </Typography>
                        </Toolbar>
                    }
                    {itemPagina.length > 0 &&
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {
                                        cabecalhoTabelaAgenda.map((linha) => {
                                            return (
                                                <TableCell key={linha.id} align="center">
                                                    <TableContainer><b>{linha.coluna}</b></TableContainer>
                                                </TableCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    itemPagina.map((linha) => (
                                        <TableRow
                                            key={linha.id}
                                            onClick={() => linha.id === linhaSelecionadaAgenda.id
                                                ? setLinhaSelecionadaAgenda({ ...linhaSelecionadaAgenda, id: 0 })
                                                : setLinhaSelecionadaAgenda(linha)}
                                            style={{
                                                backgroundColor: linhaSelecionadaAgenda.id === linha.id ? "#ff8a80" : "#fff"
                                            }}
                                        >
                                            <TableCell align="center" component="th" scope="row">{linha.pacienteNome}</TableCell>
                                            <TableCell align="center">{linha.cpf}</TableCell>
                                            <TableCell align="center">{moment(linha.data).format("DD/MM/yyyy") + " - " + linha.hora}</TableCell>
                                            <TableCell align="center">{linha.exame}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    }
                </TableContainer>
                {itemPagina.length > 0 &&
                    <Toolbar className={classes.contadorDePagina}>
                        <Tooltip title="Página anterior">
                            <IconButton aria-label="Página anterior" onClick={() => { paginaAnterior() }}>
                                <ArrowBackIosIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography>
                            {(pagina === 1
                                ? 1
                                : (pagina - 1) * 5 + 1)
                                + "-" +
                                (pagina * 5 > marcacoes.length && pagina > 1
                                    ? marcacoes.length
                                    : marcacoes.length < 5
                                        ? marcacoes.length
                                        : pagina * 5)
                                + " de " + (marcacoes.length)}
                        </Typography>
                        <Tooltip title="Proxíma página">
                            <IconButton aria-label="Proxíma página" onClick={() => { proximaPagina() }}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                }
            </Paper>
        </Fragment>
    )
}

export default AgendaLista;