import React, {Component} from 'react';
import {Button, Card, Col, Form,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";

export default class PlayersYellowCardsForm extends Component {

    continue = e => {
        e.preventDefault();
        if (this.checkSelectBoxes() > -1) {
            this.rememberPlayersYellowCards();
            this.props.nextStep();
        }
    }

    rememberPlayersYellowCards = () => {
        this.props.masterPlayersYellowCards.splice(0, this.props.masterPlayersYellowCards.length);
        this.props.slavePlayersYellowCards.splice(0, this.props.slavePlayersYellowCards.length);
        for (let i = 0; i < 2; i++) {
            const selList = document.getElementsByName("select" + i)
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                const indexSelected = sel.selectedIndex;
                const option = sel.querySelectorAll('option')[indexSelected];
                const selectedId = option.getAttribute('id');
                if (i === 0) {
                    this.props.masterPlayersYellowCards.push(selectedId);
                } else {
                    this.props.slavePlayersYellowCards.push(selectedId);
                }
            }
        }
        console.log(this.props.masterPlayersYellowCards);
        console.log(this.props.slavePlayersYellowCards);

    }

    back = e => {
        e.preventDefault();
        if (this.checkSelectBoxes() > -1) {
            this.rememberPlayersYellowCards();
            this.props.prevStep();
        }
    }

    componentDidMount() {
        this.fillSelectBox();
    }

    fillSelectBox() {
        if (this.props.masterPlayersYellowCards.length > 0) {
            const selList = document.getElementsByName("select0")
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                sel.value = this.props.masterPlayersYellowCards[j];
            }
        }
        if (this.props.slavePlayersYellowCards.length > 0) {
            const selList = document.getElementsByName("select1")
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                sel.value = this.props.slavePlayersYellowCards[j];
            }
        }
    }

    checkSelectBoxes = () => {
        for (let i = 0; i < 2; i++) {
            const selList = document.getElementsByName("select" + i)
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                const indexSelected = sel.selectedIndex;
                if(indexSelected===-1){
                    return -1;
                }
            }
        }
        return 0;
    }

    render() {
        const {values, handleChange} = this.props;
        const {countMasterYellowCards, countSlaveYellowCards} = values;
        return (
            <div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={faEdit}/> {"Гравці, які отримали жовті картки"}
                    </Card.Header>
                    <Form onReset={this.back} onSubmit={this.continue}
                          id="playersYellowCards">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridMasterTeamPlayersYellowCards">
                                    <Form.Label>{this.props.masterTeamName}</Form.Label>
                                    {Array(parseInt(countMasterYellowCards)).fill(null).map((value, index) => (
                                        <div>
                                            <select name="select0" className="form-control" onSelect={this.onSelect}>
                                                {this.props.masterPlayersList.map((player) => (
                                                    <option value={player.id}
                                                            id={player.id}>{player.playerName}</option>
                                                ))}
                                            </select>
                                            <br/>
                                        </div>
                                    ))}

                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridSlaveTeamPlayersYellowCards">
                                    <Form.Label>{this.props.slaveTeamName}</Form.Label>
                                    {Array(parseInt(countSlaveYellowCards)).fill(null).map((value, index) => (
                                        <div>
                                            <select name="select1" className="form-control" onSelect={this.onSelect}>
                                                {this.props.slavePlayersList.map((player) => (
                                                    <option value={player.id}
                                                            id={player.id}>{player.playerName}</option>
                                                ))}
                                            </select>
                                            <br/>
                                        </div>
                                    ))}

                                </Form.Group>

                            </Form.Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="warning" type="reset">
                                <FontAwesomeIcon icon={faStepBackward}/> {"Назад"}
                            </Button>{'  '}
                            <Button size="sm" variant="success" type="submit">
                                {"Продовжити"} <FontAwesomeIcon icon={faStepForward}/>
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
                <div style={{"height": 50}}></div>
            </div>
        );

    }
}