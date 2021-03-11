import React, {Component} from "react";
import {Card, Form, Button, Col, Image, DropdownButton, Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle, faSave, faEdit, faTrash, faUndo, faList, faUpload} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ToastMessage from "./ToastMessage";
import ScreenBlocker from "./ScreenBlocker";

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.loadingTeams = false;
        this.state.blockScreen = false;
        this.state.error = false;
        //  this.gameChange = this.gameChange.bind(this);
        //   this.checkBoxChange = this.checkBoxChange.bind(this);
        this.submitGame = this.submitGame.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    initialState = {
        tourId: -1,
        tourName: '',
        gameId: -1,
        teams: [],
        masterTeamId: -1,
        slaveTeamId: -1,
        blockScreen: false,
    };

    componentDidMount() {
        const tourName = this.props.match.params.tourName;
        const gameId = +this.props.match.params.gameId;
        const tourId = +this.props.match.params.tourId;
        this.setState({
            tourName: tourName,
            gameId: gameId,
            tourId: tourId,
        });
        if (gameId && gameId != -1) {
            this.findGameById(gameId);
        }
            this.fillBoxes();
    };

    /*  componentDidUpdate(prevProps, prevState, snapshot) {
          if (this.state.id !== prevState.id && this.state.id) {
              this.findPlayerById(this.state.id);
          }
      };
  */
    fillBoxes = () => {
        this.setState({
            loadingTeams: true,
        });

        axios.get(localStorage.getItem("host") + "teamsList")
            //axios.get("http://localhost:8092/ui/unRegisteredPlayers")
            .then(response => {
                console.log(response);
                if (response.data != null) {
                    this.setState({
                        teams: response.data,
                        loadingTeams: false,
                    });
                }
                if(this.state.gameId!=-1){this.fillBoxesFromResponse()};
            })
            .catch((error) => {
                console.error("Error" + error);
                this.setState({
                    loadingTeams: false,
                });
            });
    };

    fillBoxesFromResponse = () => {
            const selList = document.getElementsByName("select0")
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                sel.value = this.state.masterTeamId;
            }

            const selList1 = document.getElementsByName("select1")
            for (let j = 0; j < selList1.length; j++) {
                const sel = selList1[j];
                sel.value = this.state.slaveTeamId;
            }
        }


    findGameById = (gameId) => {
        this.setState({
            blockScreen: true
        });
        axios.get(localStorage.getItem("host") + "games/" + gameId)
            // axios.get("http://localhost:8092/ui/players/" + playerId)
            .then(response => {
                console.log(response);
                if (response.data != null) {
                    this.setState({
                        // tourId: response.data.tourId,
                        //  tourName: response.data.tourName,
                        //  gameId: response.data.gameId,
                        masterTeamId: response.data.masterTeamId,
                        slaveTeamId: response.data.slaveTeamId,
                        //  date: response.data.date ? (response.data.date).toString().substring(0, 10) : '',
                        blockScreen: false,
                    });
                    this.fillBoxesFromResponse();
                }
            })
            .catch((error) => {
                console.error("Error" + error);
            });
    };

    resetForm = () => {
        this.setState({
            gameId: -1,
            masterTeamId: -1,
            slaveTeamId: -1,
            blockScreen: false,
        });
    };

    gameList = () => {
        return this.props.history.goBack();
    };

    setValuesFromSelectBoxesToState() {
        for (let i = 0; i < 2; i++) {
            const selList = document.getElementsByName("select" + i)
            for (let j = 0; j < selList.length; j++) {
                const sel = selList[j];
                const indexSelected = sel.selectedIndex;
                const option = sel.querySelectorAll('option')[indexSelected];
                const selectedId = option.getAttribute('id');
                if (i === 0) {
                    this.state.masterTeamId = selectedId;
                } else {
                    this.state.slaveTeamId = selectedId;
                }
            }
        }
    }

    submitGame = event => {
        event.preventDefault();
        this.setValuesFromSelectBoxesToState();
        let data = new FormData();
        data.append('tourId', this.state.tourId);
        data.append('gameId', this.state.gameId);
        data.append('masterTeamId', this.state.masterTeamId);
        data.append('slaveTeamId', this.state.slaveTeamId);

        console.log("Send POST with: ");
        for (const pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        this.setState({blockScreen: true});
        // axios.post("http://localhost:8092/ui/player", data)
        axios.post(localStorage.getItem("host") + "games/" + this.state.gameId, data)
            .then((res) => {
                console.log("RESPONSE RECEIVED: ", res);
                this.setState({
                        gameId: -1,
                        masterTeamId: -1,
                        slaveTeamId: -1,
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
    render() {
        const {
            tourId,
            tourName,
            gameId,
            teams,
            masterTeamId,
            slaveTeamId,
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
                        message={!this.state.error ? (this.state.method === "put" ? "Обновление прошло успешно!" : "Сохранение прошло успешно!") : "Ошибка при сохранении"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={this.state.id ? faEdit : faPlusCircle}/> {this.state.gameId != -1 ? "Оновити дані матчу. " + this.state.tourName : "Створити матч. " + this.state.tourName}
                    </Card.Header>
                    <Form onReset={this.resetForm} onSubmit={this.state.id ? this.submitGame : this.submitGame}
                          id="GameFormId">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridGameMasterTeam">
                                    <Form.Label>Господарі</Form.Label>
                                    <select name="select0" className="form-control" onSelect={this.onSelect}>
                                        {this.state.teams.map((team) => (
                                            <option value={team.id}
                                                    id={team.id}>{team.teamName}</option>
                                        ))}
                                    </select>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridGameSlaveTeam">
                                    <Form.Label>Гості</Form.Label>
                                    <select name="select1" className="form-control" onSelect={this.onSelect}>
                                        {this.state.teams.map((team) => (
                                            <option value={team.id}
                                                    id={team.id}>{team.teamName}</option>
                                        ))}
                                    </select>
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon
                                    icon={faSave}/> {this.state.gameId != -1 ? "Оновити дані матчу" : "Створити матч"}
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Очистити
                            </Button>{' '}
                            <Button size="sm" variant="info" type="button" onClick={this.gameList.bind()}>
                                <FontAwesomeIcon icon={faList}/> Список матчів
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
                <div style={{"height": 50}}></div>
            </div>

        );
    }


}