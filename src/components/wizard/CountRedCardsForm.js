import React, {Component} from 'react';
import {Button, Card, Col, Form,} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";

export default class CountRedCardsForm extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    }

    back = e => {
        this.props.prevStep();
    }

    render() {
        const {values, handleChange} = this.props;
        return (
            <div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={faEdit}/> {"Кількість червоних карток"}
                    </Card.Header>
                    <Form onReset={this.back} onSubmit={this.continue}
                          id="countRedCards">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridMasterTeamName">
                                    <Form.Label>{this.props.masterTeamName}</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="number"
                                        value={values.countMasterRedCards}
                                        onChange={handleChange('countMasterRedCards')}
                                        required
                                        autoComplete="off"
                                        name="masterCountRedCards"
                                        placeholder="Кількість червоних карток"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridSlaveTeamName">
                                    <Form.Label>{this.props.slaveTeamName}</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="number"
                                        value={values.countSlaveRedCards}
                                        onChange={handleChange('countSlaveRedCards')}
                                        required
                                        autoComplete="off"
                                        name="slaveCountRedCards"
                                        placeholder="Кількість червоних карток"/>
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