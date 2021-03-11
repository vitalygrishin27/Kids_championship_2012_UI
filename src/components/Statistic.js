import React, {Component} from "react";
import axios from "axios";
import {Button, ButtonGroup, Card, Image, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressBook, faEdit, faList, faTrash} from "@fortawesome/free-solid-svg-icons";

export default class Standings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            isSkipGamesTable: false,
            isLoading: false,
            dataInfo: [],
        };
    }

    componentDidMount() {
        //yellowCards
        //skipGames
        //bombardiers
        this.getStatisticFromBackEnd("bombardiers");
    }

    getStatisticFromBackEnd = (command) => {
        console.log(command);
        this.setState({
            isLoading: true,
            isErrorLoading: false,
        });
        axios.get(localStorage.getItem("host") + "statistic/" + command)
            // axios.get("http://localhost:8092/ui/statistic/" + command)
            .then(response => response.data)
            .then((data) => {
                // alert(data);
                this.setState({
                    title: command === "skipGames" ? "Пропуск ігор" : command === "yellowCards" ? "Жовті картки" : "Бомбардири",
                    isSkipGamesTable: command === "skipGames",
                    dataInfo: data,
                    isLoading: false,
                    isErrorLoading: false,
                });
                console.log(this.state.dataInfo);
            }).catch(() => {
            this.setState({
                dataInfo: [],
                isLoading: false,
                isErrorLoading: true,
            });
        });
    }

    render() {
        const isLoading = this.state.isLoading;
        const dataInfo = this.state.dataInfo;
        const isErrorLoading = this.state.isErrorLoading;
        const isSkipGamesTable = this.state.isSkipGamesTable;
        return (
            <div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={faList}/> &nbsp;{this.state.title}&nbsp;
                        <ButtonGroup>
                            <Button size={"sm"} variant={"outline-success"}
                                    onClick={this.getStatisticFromBackEnd.bind(this, "bombardiers")}>Бомбардири</Button>&nbsp;
                            <Button size={"sm"} variant={"outline-warning"}
                                    onClick={this.getStatisticFromBackEnd.bind(this, "yellowCards")}>Жовті
                                картки</Button>&nbsp;
                            <Button size={"sm"} variant={"outline-danger"}
                                    onClick={this.getStatisticFromBackEnd.bind(this, "skipGames")}>Пропуск
                                ігор</Button>&nbsp;
                        </ButtonGroup>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant={"dark"}>
                            {
                                !isSkipGamesTable ?
                                    <thead>
                                    <tr style={{"color": "#ffcb3b"}}>
                                        <th colSpan='4' style={{
                                            "fontSize": "15pt",
                                            "fontWeight": "600",
                                            "textAlign": "center"
                                        }}> {this.state.title}
                                        </th>
                                    </tr>
                                    <tr style={{"color": "#ffcb3b"}}>
                                        <th>№</th>
                                        <th>Гравець</th>
                                        <th>Команда</th>
                                        <th>Кількість</th>
                                    </tr>
                                    </thead> :
                                    <thead>
                                    <tr style={{"color": "#ffcb3b"}}>
                                        <th colSpan='5' style={{
                                            "fontSize": "15pt",
                                            "fontWeight": "600",
                                            "textAlign": "center"
                                        }}> {this.state.title}
                                        </th>
                                    </tr>
                                    <tr style={{"color": "#ffcb3b"}}>
                                        <th>№</th>
                                        <th>Гравець</th>
                                        <th>Команда</th>
                                        <th>Дата</th>
                                        <th>Інформація</th>
                                    </tr>
                                    </thead>
                            }
                            <tbody>
                            {
                                isErrorLoading ?
                                    <tr align={"center"}>
                                        <td colSpan={"11"}>Статистика ще формується на сервері. Перезавантажте сторінку пізніше.</td>
                                    </tr> :
                                    dataInfo.length === 0 && !isLoading ?
                                        <tr align={"center"}>
                                            <td colSpan={"11"}>Нема даних</td>
                                        </tr> :
                                        isLoading ?
                                            <tr align={"center"}>
                                                <td colSpan={"11"}>Завантаження</td>
                                            </tr> :
                                            dataInfo.map((row, count) => (
                                                <tr style={{
                                                    "fontSize": "13pt",
                                                    "fontWeight": "600",
                                                    "textAlign": "left"
                                                }}>
                                                    <td>{count + 1}</td>
                                                    <td><Image src={row.photoString} rounded width={"50"}
                                                               height={"71"}/>{'  '} {row.playerName}</td>
                                                    <td><Image src={row.symbolString} roundedCircle width={"50"}
                                                               height={"50"}/>{'  '} {row.teamName}</td>
                                                    <td style={{
                                                        "fontSize": "15pt",
                                                        "fontWeight": "600",
                                                        "textAlign": "center"
                                                    }}>{!isSkipGamesTable ? row.value : row.stringDate}</td>
                                                    {isSkipGamesTable ?
                                                        <td>{row.details}</td> :
                                                        ''
                                                    }
                                                </tr>
                                            ))
                            }

                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>
                <div style={{"height": 50}}></div>
            </div>
        );
    }

}
