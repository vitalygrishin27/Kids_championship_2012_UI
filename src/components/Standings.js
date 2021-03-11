import React, {Component} from "react";
import axios from "axios";
import {Card, Form, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons";

export default class Standings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullTable: false,
            isLoading: false,
            standings: [],
        };
        this.checkBoxChange = this.checkBoxChange.bind(this);
    }

    componentDidMount() {
        this.getStatisticFromBackEnd();
    }

    getStatisticFromBackEnd = () => {
        this.setState({
            isLoading: true,
        });
        axios.get(localStorage.getItem("host") + "standings")
            //  axios.get("http://localhost:8092/ui/standings")
            .then(response => response.data)
            .then((data) => {
                console.log(data);
                this.setState({
                    standings: data,
                    isLoading: false,
                });
            }).catch(() => {
            this.setState({
                isLoading: false,
                isErrorLoading: true,
            });
        });
    }

    checkBoxChange = () => {
        this.setState({
            fullTable: !this.state.fullTable,
        });
    }

    render() {
        const isLoading = this.state.isLoading;
        const standings = this.state.standings;
        const fullTable = this.state.fullTable;
        return (
            <div>
                {!fullTable ?
                    <Card className={"text-white"} style={{backgroundColor: 'transparent'}}>
                        <Card.Header><FontAwesomeIcon icon={faList}/> Турнірна таблиця
                            <Form.Check
                                className={"bg-dark text-white"}
                                type="checkbox"
                                //  defaultChecked={this.state.isLegionary}
                                //  value={isLegionary}
                                //   checked={isLegionary}
                                checked={this.state.fullTable}
                                onChange={this.checkBoxChange}
                                autoComplete="off"
                                name="fullTable"
                                placeholder="Детально"
                                label="Детальна таблиця"/>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover variant={"dark"}>
                                <thead>
                                <tr style={{"color": "#ffcb3b"}}>
                                    <th>№</th>
                                    <th>Команда</th>
                                    <th>Ігри</th>
                                    <th>П</th>
                                    <th>Н</th>
                                    <th>П</th>
                                    <th>М’ячі</th>
                                    <th>Очки</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.standings.length === 0 && !isLoading ?
                                        <tr align={"center"}>
                                            <td colSpan={"11"}>Нема даних</td>
                                        </tr> :
                                        isLoading ?
                                            <tr align={"center"}>
                                                <td colSpan={"11"}>Завантаження</td>
                                            </tr> :
                                            standings.map((standingsRow, count) => (
                                                <tr key={standingsRow.number} style={{
                                                    "fontSize": "15pt",
                                                    "fontWeight": "600",
                                                    "textAlign": "center"
                                                }}>
                                                    <td>{count + 1}</td>
                                                    <td style={{"textAlign": "left"}}>{standingsRow.teamName}</td>
                                                    <td>{standingsRow.games}</td>
                                                    <td style={{"background": "#328734"}}>{standingsRow.wins}</td>
                                                    <td style={{
                                                        "background": "#e3d432",
                                                        "color": "#252F48"
                                                    }}>{standingsRow.draws}</td>
                                                    <td style={{"background": "#9e1616"}}>{standingsRow.losses}</td>
                                                    <td style={{"fontSize": "11pt"}}>{standingsRow.stringRatioGoals}</td>
                                                    <td>{standingsRow.points}</td>
                                                </tr>
                                            ))
                                }

                                </tbody>
                            </Table>

                        </Card.Body>
                    </Card>
                    :
                    <Card className={"text-white"} style={{backgroundColor: 'transparent'}}>
                        <Card.Header><FontAwesomeIcon icon={faList}/> Детальна турнірна таблиця
                            <Form.Check
                                className={"bg-dark text-white"}
                                type="checkbox"
                                //  defaultChecked={this.state.isLegionary}
                                //  value={isLegionary}
                                //   checked={isLegionary}
                                checked={this.state.fullTable}
                                onChange={this.checkBoxChange}
                                autoComplete="off"
                                name="fullTable"
                                placeholder="Детально"
                                label="Детальна таблиця"/>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover variant={"dark"}>
                                <thead>
                                <tr style={{"color": "#ffcb3b"}}>
                                    <th>№</th>
                                    <th>Команда</th>
                                    {standings.map((standingsRow, count) => (
                                        <th style={{
                                            "textAlign": "center"
                                        }}>{count + 1}</th>
                                    ))}
                                    <th>П</th>
                                    <th>Н</th>
                                    <th>П</th>
                                    <th>Ігри</th>
                                    <th>М’ячі</th>
                                    <th>Очки</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.standings.length === 0 && !isLoading ?
                                        <tr align={"center"}>
                                            <td colSpan={"11"}>Нема даних</td>
                                        </tr> :
                                        isLoading ?
                                            <tr align={"center"}>
                                                <td colSpan={"11"}>Завантаження</td>
                                            </tr> :
                                            this.state.standings.map((standingsRow, count) => (
                                                <tr key={standingsRow.number} style={{
                                                    "fontSize": "15pt",
                                                    "fontWeight": "600",
                                                    "textAlign": "center"
                                                }}>
                                                    <td style={{"vertical-align": "middle"}}>{count + 1}</td>
                                                    <td style={{whiteSpace: "nowrap", "textAlign": "left", "vertical-align": "middle"}}>{standingsRow.teamName}</td>
                                                    {standingsRow.gameResults.map((gameResult) =>(
                                                        <td style={{"vertical-align": "middle"}}>{gameResult}</td>
                                                        //<td>{gameResult}</td>
                                                    ))}
                                                    <td style={{"background": "#328734", "vertical-align": "middle"}}>{standingsRow.wins}</td>
                                                    <td style={{
                                                        "background": "#e3d432",
                                                        "vertical-align": "middle",
                                                        "color": "#252F48"
                                                    }}>{standingsRow.draws}</td>
                                                    <td style={{"background": "#9e1616", "vertical-align": "middle"}}>{standingsRow.losses}</td>
                                                    <td style={{"vertical-align": "middle"}}>{standingsRow.games}</td>
                                                    <td style={{"fontSize": "11pt", "vertical-align": "middle"}}>{standingsRow.stringRatioGoals}</td>
                                                    <td style={{"vertical-align": "middle"}}>{standingsRow.points}</td>
                                                </tr>
                                            ))
                                }

                                </tbody>
                            </Table>

                        </Card.Body>
                    </Card>
                }
                <div style={{"height": 50}}></div>
            </div>
        );
    }

}