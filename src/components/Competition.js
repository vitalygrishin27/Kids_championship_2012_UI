import React, {Component} from "react";
import {Card, Form, Button, Col, Image, DropdownButton, Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle, faSave, faEdit, faTrash, faUndo, faList, faUpload} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ToastMessage from "./ToastMessage";
import ScreenBlocker from "./ScreenBlocker";

export default class Competition extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.loadingCompetitions = false;
        this.state.blockScreen = false;
        this.state.error = false;
        this.submitCompetition = this.submitCompetition.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    initialState = {
        competitionId: -1,
        competitionName: '',
        isForStandings: false,
        method: 'post',
        blockScreen: false,
    };

    componentDidMount() {
        const competitionId = +this.props.match.params.competitionId;
        const competitionName = this.props.match.params.competitionName;
        this.setState({
            competitionId: competitionId,
            competitionName: competitionName,
        });
        if(competitionId!=-1){
            this.findCompetitionById(competitionId);
        }
    };


    findCompetitionById = (competitionId) => {
        this.setState({
            blockScreen: true
        });
        axios.get(localStorage.getItem("host") + "competition/" + competitionId)
            // axios.get("http://localhost:8092/ui/players/" + playerId)
            .then(response => {
                console.log(response);
                if (response.data != null) {
                    this.setState({
                        competitionId: response.data.id,
                        competitionName: response.data.name,
                        isForStandings: response.data.forStandings,
                        method: 'put',
                        blockScreen: false,
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    blockScreen: false,
                });
                console.error("Error" + error);
            });
    };

    resetForm = () => {
        this.setState({
            competitionId: -1,
            competitionName: '',
            isForStandings: false,
            blockScreen: false,
        });
    };

    competitionList = () => {
        return this.props.history.goBack();
    };

    submitCompetition = event => {
        event.preventDefault();
        let data = new FormData();
        data.append('id', this.state.competitionId);
        data.append('name', this.state.competitionName);
        data.append('forStandings', this.state.isForStandings);
        console.log("Send POST with: ");
        for (const pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        this.setState({blockScreen: true});
        // axios.post("http://localhost:8092/ui/player", data)
        axios.post(localStorage.getItem("host") + "competition", data)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                this.setState({
                        competitionId: -1,
                        competitionName: '',
                        isForStandings: false,
                        blockScreen: false,
                    }
                );
                this.setState({"show": true, "error": false, "method": 'post'});
                setTimeout(() => this.setState({"show": false}), 3000);
            })
            .catch((err) => {
                this.setState({"error": true, "show": true, "blockScreen": false});
                setTimeout(() => this.setState({"show": false}), 3000);
                console.log("AXIOS ERROR: ", err);
            })

    };

    /*   updateGame = event => {
           event.preventDefault();
           let data = new FormData();
           data.append('teamId', this.state.teamId);
           data.append('id', this.state.id);
           data.append('file', this.state.photo);
           data.append('photoString', this.state.photoString);
           data.append('firstName', this.state.firstName);
           data.append('secondName', this.state.secondName);
           data.append('lastName', this.state.lastName);
           data.append('birthday', this.state.birthday ? (new Date(this.state.birthday)).toUTCString() : new Date(2020, 0, 1));
           data.append('isLegionary', this.state.isLegionary);
           data.append('registration', this.state.registration);
           data.append('role', this.state.role);
           data.append('idCard', this.state.idCard);
           data.append('inn', this.state.inn);
           data.append('userName', localStorage.getItem("user"));

           console.log("Send POST with: ");
           for (const pair of data.entries()) {
               console.log(pair[0] + ', ' + pair[1]);
           }
           this.setState({blockScreen: true});
           //  axios.put("http://localhost:8092/ui/player", data)
           axios.put(localStorage.getItem("host") + "player", data)
               .then((res) => {
                   console.log("RESPONSE RECEIVED: ", res);
                   this.setState({
                       unRegisteredPlayers: this.state.unRegisteredPlayers.filter(player => player.id !== this.state.id)
                   });
                   this.setState({
                           id: '',
                           firstName: '',
                           secondName: '',
                           lastName: '',
                           birthday: '',
                           isLegionary: false,
                           registration: '',
                           role: '',
                           photo: '',
                           idCard: '',
                           inn: '',
                           blockScreen: false,
                           filePreview: '',
                           photoString: '',
                       }
                   );

                   this.setState({"show": true, "error": false, "method": 'put'});
                   setTimeout(() => this.setState({"show": false}), 3000);
                   //  setTimeout(() => this.playerList(), 3000);

               })
               .catch((err) => {
                   this.setState({"error": true, "show": true, "blockScreen": false});
                   setTimeout(() => this.setState({"show": false}), 3000);
                   console.log("AXIOS ERROR: ", err);
               })

       };
   */
    /*  playerChange = event => {
          this.setState({
              [event.target.name]: event.target.value
          });
      };
  */
    /*  playerList = () => {
          return this.props.history.goBack();
      };
  */

    /*
        checkBoxChange = () => {
            this.setState({
                isLegionary: !this.state.isLegionary,
            });
        }
    */
    competitionChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    checkBoxChange = () => {
        this.setState({
            isForStandings: !this.state.isForStandings,
        });
    }

    render() {
        const {
            competitionId,
            competitionName,
            isForStandings,
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
                        message={!this.state.error ? (this.state.method === "put" ? "Оновлення відбулося!" : "Збереження пройшло успішно!") : "Помилка при збереженні"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={this.state.id ? faEdit : faPlusCircle}/> {this.state.competitionId !=-1 ? "Оновити дані змагання " + this.state.competitionName : "Створити нове змагання "}
                    </Card.Header>
                    <Form onReset={this.resetForm}
                          onSubmit={this.state.сompetitionId != -1 ? this.submitCompetition : this.submitCompetition}
                          id="CompetitionFormId">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCompetitionName">
                                    <Form.Label>Назва</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="text"
                                        value={competitionName}
                                        onChange={this.competitionChange}
                                        required
                                        autoComplete="off"
                                        name="competitionName"
                                        placeholder="Назва"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridIsForStandings">
                                    <Form.Label>Використовується у турнірній таблиці</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="checkbox"
                                        //  defaultChecked={this.state.isLegionary}
                                        //  value={isLegionary}
                                        //   checked={isLegionary}
                                        checked={this.state.isForStandings}
                                        onChange={this.checkBoxChange}
                                        autoComplete="off"
                                        name="isForStandings"
                                        placeholder="Використовується у турнірній таблиці"/>
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon
                                    icon={faSave}/> {this.state.competitionId!=-1 ? "Оновити дані " : "Створити нове змагання "}
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Очистити
                            </Button>{' '}
                            <Button size="sm" variant="info" type="button" onClick={this.competitionList.bind()}>
                                <FontAwesomeIcon icon={faList}/> Список змагань
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
                <div style={{"height": 50}}></div>
            </div>

        );
    }


}