import React, {Component} from 'react';
import {Button, Card, Col, Form,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faStepForward} from "@fortawesome/free-solid-svg-icons";

export default class CountGoalsForm extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    render() {
        const {values, handleChange} = this.props;
        return (
            <div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={faEdit}/> {"Кількість голів"}
                    </Card.Header>
                    <Form onSubmit={this.continue}
                          id="countGoals">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridMasterTeamName">
                                    <Form.Label>{this.props.masterTeamName}</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="number"
                                        value={values.countMasterGoals}
                                        onChange={handleChange('countMasterGoals')}
                                        required
                                        autoComplete="off"
                                        name="masterCountGoals"
                                        placeholder="Кількість голів"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridSlaveTeamName">
                                    <Form.Label>{this.props.slaveTeamName}</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="number"
                                        value={values.countSlaveGoals}
                                        onChange={handleChange('countSlaveGoals')}
                                        required
                                        autoComplete="off"
                                        name="slaveCountGoals"
                                        placeholder="Кількість голів"/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId={"formGridMasterTechnicalWin"} style={{"textAlign": "center"}}>
                                    <Form.Label>Техническая победа</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="checkbox"
                                        //  defaultChecked={this.state.isLegionary}
                                        //  value={isLegionary}
                                        //   checked={isLegionary}
                                        checked={this.props.isMasterTechnicalWin}
                                        onChange={this.props.masterCheckBoxChange}
                                        autoComplete="off"
                                        name="isMasterTechnicalWin"
                                        placeholder="Техническая победа"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId={"formGridSlaveTechnicalWin"} style={{"textAlign": "center"}}>
                                    <Form.Label>Техническая победа</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="checkbox"
                                        //  defaultChecked={this.state.isLegionary}
                                        //  value={isLegionary}
                                        //   checked={isLegionary}
                                        checked={this.props.isSlaveTechnicalWin}
                                        onChange={this.props.slaveCheckBoxChange}
                                        autoComplete="off"
                                        name="isSlaveTechnicalWin"
                                        placeholder="Техническая победа"/>
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                {"Продовжити"} <FontAwesomeIcon icon={faStepForward}/>
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        );

    }
}