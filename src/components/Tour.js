import React, {Component} from "react";
import {Card, Form, Button, Col, Image, DropdownButton, Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle, faSave, faEdit, faTrash, faUndo, faList, faUpload} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ToastMessage from "./ToastMessage";
import ScreenBlocker from "./ScreenBlocker";

export default class Tour extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.loadingTours = false;
        this.state.blockScreen = false;
        this.state.error = false;
        this.submitTour = this.submitTour.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    initialState = {
        tourId: -1,
        tourName: '',
        competitionId: -1,
        competitionName: '',
        date: '',
        method: 'post',
        blockScreen: false,
    };

    componentDidMount() {
        const tourId = +this.props.match.params.tourId;
        const tourName = this.props.match.params.tourName;
        const competitionId = +this.props.match.params.competitionId;
        const competitionName = this.props.match.params.competitionName;
        this.setState({
            competitionId: competitionId,
            competitionName: competitionName,
            tourName: tourName,
            tourId: tourId,
        });
        if (tourId && tourId != -1) {

             this.findTourById(tourId);
        }
       // this.fillBoxes();
    };

    /*  componentDidUpdate(prevProps, prevState, snapshot) {
          if (this.state.id !== prevState.id && this.state.id) {
              this.findPlayerById(this.state.id);
          }
      };
  */
   /* fillBoxes = () => {
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
            })
            .catch((error) => {
                console.error("Error" + error);
                this.setState({
                    loadingTeams: false,
                });
            });
    };*/

    findTourById = (tourId) => {
        this.setState({
            blockScreen: true
        });
        axios.get(localStorage.getItem("host") + "competition/tours/" + tourId)
            // axios.get("http://localhost:8092/ui/players/" + playerId)
            .then(response => {
        //        console.log(response);
                if (response.data != null) {
                    this.setState({
                        tourId: response.data.id,
                        tourName: response.data.name,
                        tourDate: response.data.date ? (response.data.date).toString().substring(0, 10) : '',
                        method: 'put',
                        blockScreen: false,
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    blockScreen: false,
                });
  //              console.error("Error" + error);
            });
    };

    resetForm = () => {
        this.setState({
            tourId: -1,
            tourName: '',
            tourDate: '',
            blockScreen: false,
        });
    };

    tourList = () => {
        return this.props.history.goBack();
    };

    submitTour = event => {
        event.preventDefault();
        let data = new FormData();
        data.append('tourId', this.state.tourId);
        data.append('tourName', this.state.tourName);
        data.append('competitionId', this.state.competitionId);
        data.append('tourDate', this.state.tourDate ? (new Date(this.state.tourDate)).toUTCString() : new Date(2020, 0, 1));
  //      console.log("Send POST with: ");
  //      for (const pair of data.entries()) {
    //        console.log(pair[0] + ', ' + pair[1]);
    //    }
        this.setState({blockScreen: true});
        // axios.post("http://localhost:8092/ui/player", data)
        axios.post(localStorage.getItem("host") + "tours/" + this.state.tourId, data)
            .then((res) => {
     //           console.log("RESPONSE RECEIVED: ", res);
                this.setState({
                        tourId: -1,
                        tourName: '',
                        tourDate: '',
                        blockScreen: false,
                    }
                );
                this.setState({"show": true, "error": false, "method": 'post'});
                setTimeout(() => this.setState({"show": false}), 3000);
            })
            .catch((err) => {
                this.setState({"error": true, "show": true, "blockScreen": false});
                setTimeout(() => this.setState({"show": false}), 3000);
      //          console.log("AXIOS ERROR: ", err);
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
    tourChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const {
            tourId,
            tourName,
            tourDate,
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
                        message={!this.state.error ? (this.state.method === "put" ? "Оновлення пройшло успішно!" : "Створення пройшло успішно!") : "Помилка при збереженні"}
                    />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon
                        icon={this.state.id ? faEdit : faPlusCircle}/> {this.state.tourId !=-1 ? "Оновити дані туру " + this.state.tourName : "Зареєструвати новий тур "}
                    </Card.Header>
                    <Form onReset={this.resetForm} onSubmit={this.state.tourId!=-1 ? this.submitTour : this.submitTour}
                          id="TourFormId">
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridTourName">
                                    <Form.Label>Назва</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="text"
                                        value={tourName}
                                        onChange={this.tourChange}
                                        required
                                        autoComplete="off"
                                        name="tourName"
                                        placeholder="Назва"/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridTourDate">
                                    <Form.Label>Дата</Form.Label>
                                    <Form.Control
                                        className={"bg-dark text-white"}
                                        type="date"
                                        value={tourDate}
                                        onChange={this.tourChange}
                                        name="tourDate"
                                        autoComplete="off"
                                        placeholder="Дата"/>
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon
                                    icon={faSave}/> {this.state.tourId!=-1 ? "Оновити дані " : "Створити новий тур "}
                            </Button>{' '}
                            <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Очистити
                            </Button>{' '}
                            <Button size="sm" variant="info" type="button" onClick={this.tourList.bind()}>
                                <FontAwesomeIcon icon={faList}/> Список турів
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
                <div style={{"height": 50}}></div>
            </div>

        );
    }


}