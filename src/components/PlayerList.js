import React, {Component} from "react";
import axios from "axios";
import ToastMessage from "./ToastMessage";
import {Button, ButtonGroup, Card, Image, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressBook, faEdit, faList, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

export default class PlayerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teamId: null,
            teamName: null,
            isAuthenticated: false,
            currentSeasonYear: null,
            isLoadingPlayerList: false,
            isLoadingSeason: false,
            isErrorLoading: false,
            players: [],
        };
    }

    componentDidMount() {

        const teamName = this.props.match.params.teamName;
        const teamId = +this.props.match.params.id;
        this.setState({
            teamId: teamId,
            teamName: teamName,
            isErrorLoading: false,
            isAuthenticated: localStorage.getItem("user") && localStorage.getItem("teamIds") && localStorage.getItem("role"),
        });
        this.getCurrentSeason();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.currentSeasonYear !== prevState.currentSeasonYear) {
            this.getAllPlayersForTeamInCurrentSeason(this.state.teamId, this.state.currentSeasonYear);
        }
    };

    getAllPlayersForTeamInCurrentSeason(teamId, year) {
        this.setState({
            isLoadingPlayerList: true,
        });
        axios.get(localStorage.getItem("host")+"seasons/" + year + "/teams/" + teamId + "/players")
        //     axios.get("http://localhost:8092/ui/seasons/"+year+"/teams/"+teamId+"/players")
            .then(response => response.data)
            .then((data) => {
                //  console.log(data);
                this.setState({
                    players: data,
                    isLoadingPlayerList: false,
                    isErrorLoading: false,
                });
            }).catch(() => {
            this.setState({
                isErrorLoading: true,
                isLoadingPlayerList: false,
            });
        });
    };

    getCurrentSeason() {
        this.setState({
            isLoadingSeason: true,
        });
        axios.get(localStorage.getItem("host")+"currentSeason")
            // axios.get("http://localhost:8092/ui/currentSeason")
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    currentSeasonYear: data,
                    isLoadingSeason: false,
                    isErrorLoading: false,
                });
            }).catch(() => {
            this.setState({
                isErrorLoading: true,
                isLoadingSeason: false,
            });
        });
    };

    deletePlayer = (playerId) => {
        axios.delete(localStorage.getItem("host")+"players/" + playerId)
            // axios.delete("http://localhost:8092/ui/players/" + playerId)
            .then(response => {
                if (response.data != null) {
             //       console.log("Delete OK");
             //       console.log(response.data);
                    this.setState({"error": false, "show": true, "blockScreen": false});
                    setTimeout(() => this.setState({"show": false}), 3000);
                    this.setState({
                        players: this.state.players.filter(player => player.id !== playerId)
                    });
                }
            }).catch(() => {
            this.setState({"error": true, "show": true, "blockScreen": false});
            setTimeout(() => this.setState({"show": false}), 3000);
     //       console.log("Error during deletion");
        });
    };

    playerCard = () => {
        return this.props.history.push("/team/" + this.state.teamId + "/" + this.state.teamName + "/players/null");
    };

    render() {
        const isLoadingSeason = this.state.isLoadingSeason;
        const isLoadingPlayerList = this.state.isLoadingPlayerList;
        const isErrorLoading = this.state.isErrorLoading;
        let info;
        /* if (isLoadingSeason || isLoadingPlayerList) {
             info = <tr align={"center"}>
                 <td colSpan={"5"}>Идет загрузка</td>
             </tr>;
         }*/
        if (isErrorLoading) {
            info = <tr align={"center"}>
                <td colSpan={"11"}>Помилка завантаження</td>
            </tr>;
        }
        return (
            <div>
                <div style={{"display": this.state.show ? "block" : "none"}}>
                    <ToastMessage
                        show={this.state.show}
                        error={this.state.error}
                        message={!this.state.error ? "Вилучення пройшло успішно!" : "Помилка під час вилучення"}
                    />
                </div>
                <Card className={"text-white"} style={{ backgroundColor: 'transparent' }}>
                    <Card.Header><FontAwesomeIcon icon={faList}/> Гравці команди  {this.state.teamName}
                        {'  '}<Button size="sm" variant="info" type="button"
                                style={{"display": (localStorage.getItem("role") && localStorage.getItem("role").match("ADMINISTRATOR")) || (this.state.isAuthenticated && (localStorage.getItem("teamIds").match(this.state.teamId))) ? "inline" : "none"}}
                                onClick={this.playerCard.bind()}>
                            <FontAwesomeIcon icon={faList}/> Заявити гравця
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant={"dark"} style={{"width": "50%", 'display': 'table'}}>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Фото</th>
                                <th>Ім’я</th>
                                <th>Дата народження</th>
                                <th>Амплуа</th>
                                <th>Прописка</th>
                                <th>Легіонер</th>
                                <th>Голи</th>
                                <th>Жовті картки</th>
                                <th>Красні картки</th>
                                {(localStorage.getItem("role") && localStorage.getItem("role").match("ADMINISTRATOR")) || (this.state.isAuthenticated && (localStorage.getItem("teamIds").match(this.state.teamId))) ?
                                    <th>Дії</th> : ""}
                            </tr>
                            </thead>
                            <tbody>
                            {info}
                            {
                                this.state.players.length === 0 && !isLoadingPlayerList && !isLoadingSeason ?
                                    <tr align={"center"}>
                                        <td colSpan={"11"}>Зареєстровані гравці відсутні</td>
                                    </tr> :
                                    isLoadingPlayerList || isLoadingSeason ?
                                        <tr align={"center"}>
                                            <td colSpan={"11"}>Завантаження...</td>
                                        </tr> :
                                        this.state.players.map((player, count) => (
                                            <tr key={player.id}>
                                                <td>{count + 1}</td>
                                                <td><Image src={player.photoString} rounded width={"50"} height={"71"}/>
                                                </td>
                                                <td>
                                                    {player.lastName}
                                                    {' '}{player.firstName}
                                                    {' '}{player.secondName}</td>
                                                <td>{player.birthday ? player.birthday.toString().substring(0, 10) : ''}</td>
                                                <td>{player.role}</td>
                                                <td>{player.registration}</td>
                                                <td>{player.isLegionary ? "+" : "-"}</td>
                                                <td>{player.goalsCount}</td>
                                                <td>{player.yellowCardCount}</td>
                                                <td>{player.redCardCount}</td>
                                                {(localStorage.getItem("role") && localStorage.getItem("role").match("ADMINISTRATOR")) || (this.state.isAuthenticated && (localStorage.getItem("teamIds").match(this.state.teamId))) ?
                                                    <td>
                                                        <ButtonGroup>
                                                            <Link className="btn btn-sm btn-outline-warning"
                                                                  style={{"display": (localStorage.getItem("role") && localStorage.getItem("role").match("ADMINISTRATOR")) || (this.state.isAuthenticated && (localStorage.getItem("teamIds").match(this.state.teamId))) ? "block" : "none"}}
                                                                  to={"/team/" + this.state.teamId + "/" + this.state.teamName + "/players/" + player.id}>{' '}
                                                                <FontAwesomeIcon icon={faAddressBook}/>
                                                            </Link>{' '}
                                                            <Button size={"sm"} variant={"outline-danger"}
                                                                    style={{"display": (localStorage.getItem("role") && localStorage.getItem("role").match("ADMINISTRATOR")) || (this.state.isAuthenticated && (localStorage.getItem("teamIds").match(this.state.teamId))) ? "block" : "none"}}
                                                                    onClick={this.deletePlayer.bind(this, player.id)}><FontAwesomeIcon
                                                                icon={faTrash}/></Button>{' '}
                                                        </ButtonGroup>
                                                    </td>
                                                    : ""}
                                            </tr>
                                        ))
                            }

                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>
            </div>
        );
    };


}