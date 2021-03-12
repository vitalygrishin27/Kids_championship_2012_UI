import React, {Component} from "react";
import {Card, Form, Button, Col, Image, DropdownButton, Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle, faSave, faEdit, faTrash, faUndo, faList, faUpload} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ToastMessage from "./ToastMessage";
import ScreenBlocker from "./ScreenBlocker";

export default class Team extends Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.blockScreen = false;
        this.state.filePreview = null;
        this.state.error = false;
        this.state.isAuthenticated = false;
        this.teamChange = this.teamChange.bind(this);
        this.submitTeam = this.submitTeam.bind(this);
        this.fileChose = this.fileChose.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    initialState = {
        id: '',
        teamName: '',
        date: '',
        boss: '',
        phone: '',
        village: '',
        symbol: '',
        error: '',
        blockScreen: false,
        unRegisteredTeams: [],
    };

    componentDidMount() {
        const teamId = +this.props.match.params.id;
        if (teamId) {
            this.findTeamById(teamId);
        }
        this.fillListUnRegisteredTeam();
        this.setState({
            isAuthenticated: localStorage.getItem("user") && localStorage.getItem("teamIds") && localStorage.getItem("role"),
        });

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.id !== prevState.id && this.state.id) {
            this.findTeamById(this.state.id);
        }
    };

    fillListUnRegisteredTeam = () => {
        axios.get(localStorage.getItem("host")+"unRegisteredTeams")
            // axios.get("http://localhost:8092/ui/unRegisteredTeams")
            .then(response => {
                console.log(response);
                if (response.data != null) {
                    this.setState({
                        unRegisteredTeams: response.data,
                    });
                }
            })
            .catch((error) => {
                console.error("Error" + error);
            });
    };

    findTeamById = (teamId) => {
        this.setState({
            blockScreen: true
        });
        axios.get(localStorage.getItem("host")+"team/" + teamId)
            //  axios.get("http://localhost:8092/ui/team/" + teamId)
            .then(response => {
         //       console.log(response);
                if (response.data != null) {
                    this.setState({
                        id: response.data.id,
                        teamName: response.data.teamName,
                        date: response.data.date ? (response.data.date).toString().substring(0, 10) : '',
                        boss: response.data.boss,
                        phone: response.data.phone,
                        village: response.data.village,
                        filePreview: response.data.symbolString,
                        symbolString: response.data.symbolString,
                        blockScreen: false,
                    });
                }
            })
            .catch((error) => {
                console.error("Error" + error);
            });
    };

    resetForm = () => {
        this.setState(() => this.initialState);
        this.fillListUnRegisteredTeam();
    };

    resetFileInput = () => {
        document.getElementById("fileBox").value = "";
        this.setState({
            filePreview: null,
            symbol: '',
        });
    };

    submitTeam = event => {
        event.preventDefault();
        let data = new FormData();
        data.append('file', this.state.symbol);
        data.append('teamName', this.state.teamName);
        data.append('date', this.state.date ? (new Date(this.state.date)).toUTCString() : new Date(2020, 0, 1));
        data.append('boss', this.state.boss);
        data.append('phone', this.state.phone);
        data.append('village', this.state.village);
        data.append('userName', localStorage.getItem("user"));

        console.log("Send POST with: ");
        for (const pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        this.setState({blockScreen: true});
        //    axios.post("http://localhost:8092/ui/team", data)
        axios.post(localStorage.getItem("host")+"team", data)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                this.setState(this.initialState);
                this.setState({"show": true, "error": false, method: 'post'});
                setTimeout(() => this.setState({"show": false}), 3000);
            })
            .catch((err) => {
                this.setState({"error": true, "show": true, "blockScreen": false});
                setTimeout(() => this.setState({"show": false}), 3000);
                console.log("AXIOS ERROR: ", err);
            })

    };

    updateTeam = event => {
        event.preventDefault();
        let data = new FormData();
        data.append('id', this.state.id);
        data.append('file', this.state.symbol);
        data.append('teamName', this.state.teamName);
        data.append('date', this.state.date ? (new Date(this.state.date)).toUTCString() : new Date(2020, 0, 1));
        data.append('boss', this.state.boss);
        data.append('phone', this.state.phone);
        data.append('village', this.state.village);
        data.append('symbolString', this.state.filePreview);
        data.append('userName', localStorage.getItem("user"));

        console.log("Send POST with: ");
   //     for (const pair of data.entries()) {
   //         console.log(pair[0] + ', ' + pair[1]);
   //     }
        this.setState({blockScreen: true});
        // axios.put("http://localhost:8092/ui/team", data)
        axios.put(localStorage.getItem("host")+"team", data)
            .then((res) => {
    //            console.log("RESPONSE RECEIVED: ", res);
                this.setState(this.initialState);
                this.setState({"show": true, "error": false, method: 'put'});
                setTimeout(() => this.setState({"show": false}), 3000);
                setTimeout(() => this.teamList(), 3000);

            })
            .catch((err) => {
                this.setState({"error": true, "show": true, "blockScreen": false});
                setTimeout(() => this.setState({"show": false}), 3000);
        //        console.log("AXIOS ERROR: ", err);
            })

    };

    teamChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    teamList = () => {
        return this.props.history.push("/list");
    };

    fileChose = event => {
        this.setState({
            filePreview: URL.createObjectURL(event.target.files[0]),
            symbol: event.target.files[0],
        });
    };

    render() {
        const {
            teamName,
            date,
            boss,
            phone,
            village,
            filePreview,
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
                        message={!this.state.error ? (this.state.method === "put" ? "Оновлення пройшло успішно!" : "Створення пройшло успішно!") : "Помилка під час збереження"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={this.state.id ? faEdit : faPlusCircle}/> {this.state.id ? "Оновити дані" : "Зареєструвати команду"}
                        <div style={{"height":10}}/>
                        <DropdownButton id="dropdown-basic-button" title="Доступні команди">
                            {this.state.unRegisteredTeams.map((team, count) => (
                                <Dropdown.Item>
                                    <Button size="sm"
                                            variant="secondary"
                                            type="button"
                                            onClick={() => this.setState({id: team.id})}
                                    >{team.teamName}</Button>
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Card.Header>
                    <Form onReset={this.resetForm} onSubmit={this.state.id ? this.updateTeam : this.submitTeam}
                          id="teamFormId">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridTeamName">
                                    <Form.Label>Назва</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="text"
                                        value={teamName}
                                        onChange={this.teamChange}
                                        required
                                        autoComplete="off"
                                        name="teamName"
                                        placeholder="Назва"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridVillage">
                                    <Form.Label>Населений пункт</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="text"
                                        value={village}
                                        onChange={this.teamChange}
                                        required
                                        autoComplete="off"
                                        name="village"
                                        placeholder="Населений пункт"/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridBoss">
                                    <Form.Label>Керівник</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="text"
                                        value={boss}
                                        onChange={this.teamChange}
                                        required
                                        autoComplete="off"
                                        name="boss"
                                        placeholder="Керівник"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridPhone">
                                    <Form.Label>Телефон</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="text"
                                        value={phone}
                                        onChange={this.teamChange}
                                        name="phone"
                                        autoComplete="off"
                                        placeholder="Телефон"/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridDate">
                                    <Form.Label>Дата заснування</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="date"
                                        value={date}
                                        onChange={this.teamChange}
                                        name="date"
                                        autoComplete="off"
                                        placeholder="Дата заснування"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridSymbol">
                                    <Form.Label>Емблема</Form.Label>
                                    <input style={{display: "none"}}
                                           id="fileBox"
                                           type="file"
                                           onChange={this.fileChose}
                                           ref={fileInput => this.fileInput = fileInput}/>
                                    <br/>
                                    <Button size="sm"
                                            variant="secondary"
                                            type="button"
                                            onClick={() => this.fileInput.click()}
                                    >
                                        <FontAwesomeIcon icon={faUpload}/> Обрати
                                    </Button> &nbsp;&nbsp;
                                    <Image style={{"display": filePreview ? "inline-block" : "none"}}
                                           src={this.state.filePreview} roundedCircle width={"50"}
                                           height={"50"}/>&nbsp;&nbsp;
                                    <Button size={"sm"}
                                            variant={"outline-danger"}
                                            style={{"display": filePreview ? "inline-block" : "none"}}
                                            onClick={this.resetFileInput}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </Button>
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave}/> {this.state.id ? "Оновити" : "Заявити"}
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Очистити
                            </Button>{' '}
                            <Button size="sm" variant="info" type="button" onClick={this.teamList.bind()}>
                                <FontAwesomeIcon icon={faList}/> Список команд
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>


        );
    }
}


/*  const axiosConfig = {
headers: {
"Content-Type": "image/jpeg",
"Access-Control-Allow-Origin": "*",
}
};*/
//contentType: "image/jpeg"
//  application/octet-stream
//  const formData = new FormData()
//  formData.append("team",team.toString());