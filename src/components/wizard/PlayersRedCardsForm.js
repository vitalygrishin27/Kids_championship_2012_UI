import React, {Component} from 'react';
import {Button, Card, Col, Form,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";

export default class PlayersRedCardsForm extends Component {

    continue = e => {
        e.preventDefault();
        if (this.checkSelectBoxes() > -1) {
            this.rememberPlayersRedCards();
            this.props.nextStep();
        }
    }

    rememberPlayersRedCards = () => {
        this.props.masterPlayersRedCards.splice(0, this.props.masterPlayersRedCards.length);
        this.props.slavePlayersRedCards.splice(0, this.props.slavePlayersRedCards.length);
        for (let i = 0; i < 2; i++) {
            const selList = document.getElementsByName("select" + i)
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                const indexSelected = sel.selectedIndex;
                const option = sel.querySelectorAll('option')[indexSelected];
                const selectedId = option.getAttribute('id');
                if (i === 0) {
                    this.props.masterPlayersRedCards.push(selectedId);
                } else {
                    this.props.slavePlayersRedCards.push(selectedId);
                }
            }
        }
        console.log(this.props.masterPlayersRedCards);
        console.log(this.props.slavePlayersRedCards);

    }

    back = e => {
        e.preventDefault();
        if (this.checkSelectBoxes() > -1) {
            this.rememberPlayersRedCards();
            this.props.prevStep();
        }
    }

    componentDidMount() {
        this.fillSelectBox();
    }

    fillSelectBox() {
        if (this.props.masterPlayersRedCards.length > 0) {
            const selList = document.getElementsByName("select0")
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                sel.value = this.props.masterPlayersRedCards[j];
            }
        }
        if (this.props.slavePlayersRedCards.length > 0) {
            const selList = document.getElementsByName("select1")
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                sel.value = this.props.slavePlayersRedCards[j];
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
        const {countMasterRedCards, countSlaveRedCards} = values;
        return (
            <div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={faEdit}/> {"Гравці, які отримали червоні картки"}
                    </Card.Header>
                    <Form onReset={this.back} onSubmit={this.continue}
                          id="playersRedCards">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridMasterTeamPlayersRedCards">
                                    <Form.Label>{this.props.masterTeamName}</Form.Label>
                                    {Array(parseInt(countMasterRedCards)).fill(null).map((value, index) => (
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

                                <Form.Group as={Col} controlId="formGridSlaveTeamPlayersRedCards">
                                    <Form.Label>{this.props.slaveTeamName}</Form.Label>
                                    {Array(parseInt(countSlaveRedCards)).fill(null).map((value, index) => (
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