import React, {Component} from "react";
import {Card, Form, Button, Col} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faUser,
    faUndo,
    faForward
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ToastMessage from "./ToastMessage";
import ScreenBlocker from "./ScreenBlocker";

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            blockScreen: false,
            isAuthenticated: false,
            error: false,
            login: '',
            pass: '',
        };
        this.userChange = this.userChange.bind(this);
        this.submitUserCredential = this.submitUserCredential.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    resetForm = () => {
        this.setState({
            login: '',
            pass: '',
        });
    };

    submitUserCredential = event => {
        event.preventDefault();
        let data = new FormData();
        data.append('login', this.state.login);
        data.append('pass', this.state.pass);
        this.setState({blockScreen: true});
         //  axios.post("http://localhost:8092/ui/users/authenticate", data)
        axios.post(localStorage.getItem("host")+"users/authenticate", data)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                localStorage.setItem("user", res.data.userName);
                localStorage.setItem("teamIds", res.data.teamsIds);
                localStorage.setItem("role", res.data.role);
               // this.setState({"error": false, "user": res.data, "isAuthenticated": true});
                this.props.history.goBack();
            })
            .catch((err) => {
                this.setState({"error": true, "show": true, "blockScreen": false});
                localStorage.removeItem("user");
                setTimeout(() => this.setState({"show": false}), 3000);
                console.log("AXIOS ERROR: ", err);
            })
    };

    userChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const {
            login,
            pass,
        } = this.state;

        return (
            <div>
                <div style={{"display": this.state.blockScreen ? "block" : "none"}}>
                    <ScreenBlocker show={this.state.blockScreen}/>
                </div>

                <div style={{"display": this.state.show ? "block" : "none"}}>
                    <ToastMessage
                        show={this.state.show}
                        error={this.state.error}
                        message={!this.state.error ? "" : "Помилка під час авторизації"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={faUser}/> {"Увійти до системи"}
                    </Card.Header>
                    <Form onReset={this.resetForm} onSubmit={this.submitUserCredential} id="userFormId">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridLogin">
                                    <Form.Label>Логин</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="text"
                                        value={login}
                                        onChange={this.userChange}
                                        required
                                        autoComplete="off"
                                        name="login"
                                        placeholder="Логін"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridPass">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="password"
                                        value={pass}
                                        onChange={this.userChange}
                                        required
                                        autoComplete="off"
                                        name="pass"
                                        placeholder="Пароль"/>
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faForward}/> {"Увійти"}
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Очистити форму
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        );
    }
}