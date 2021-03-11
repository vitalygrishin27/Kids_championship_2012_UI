import React, {Component} from 'react';
import {Button, Card, Col, Form,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";

export default class PlayersGoalsForm extends Component {

    continue = e => {
        e.preventDefault();
        if (this.checkSelectBoxes() > -1) {
            this.rememberPlayersGoals();
            this.props.nextStep();
        }
    }

    rememberPlayersGoals = () => {
        this.props.masterPlayersGoals.splice(0, this.props.masterPlayersGoals.length);
        this.props.slavePlayersGoals.splice(0, this.props.slavePlayersGoals.length);
        for (let i = 0; i < 2; i++) {
            const selList = document.getElementsByName("select" + i)
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                const indexSelected = sel.selectedIndex;
                const option = sel.querySelectorAll('option')[indexSelected];
                const selectedId = option.getAttribute('id');
                if (i === 0) {
                    this.props.masterPlayersGoals.push(selectedId);
                } else {
                    this.props.slavePlayersGoals.push(selectedId);
                }
            }
        }
        console.log(this.props.masterPlayersGoals);
        console.log(this.props.slavePlayersGoals);

    }

    back = e => {
        e.preventDefault();
        if (this.checkSelectBoxes() > -1) {
            this.rememberPlayersGoals();
            this.props.prevStep();
        }
    }

    componentDidMount() {
        this.fillSelectBox();
    }

    fillSelectBox() {
        if (this.props.masterPlayersGoals.length > 0) {
            const selList = document.getElementsByName("select0")
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                sel.value = this.props.masterPlayersGoals[j];
            }
        }
        if (this.props.slavePlayersGoals.length > 0) {
            const selList = document.getElementsByName("select1")
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                sel.value = this.props.slavePlayersGoals[j];
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
        const {countMasterGoals, countSlaveGoals} = values;
        return (
            <div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={faEdit}/> {"Гравці, які забили голи"}
                    </Card.Header>
                    <Form onReset={this.back} onSubmit={this.continue}
                          id="playersGoals">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridMasterTeamPlayersGoals">
                                    <Form.Label>{this.props.masterTeamName}</Form.Label>
                                    {Array(parseInt(countMasterGoals)).fill(null).map((value, index) => (
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

                                <Form.Group as={Col} controlId="formGridSlaveTeamPlayersGoals">
                                    <Form.Label>{this.props.slaveTeamName}</Form.Label>
                                    {Array(parseInt(countSlaveGoals)).fill(null).map((value, index) => (
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