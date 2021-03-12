import React, {Component} from "react";

import {Card, Table, Image, ButtonGroup, Button, Dropdown, DropdownButton} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faEdit, faTrash, faAddressBook} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ToastMessage from "./ToastMessage";
import {Link} from "react-router-dom";

export default class TourList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tours: [],
            activeCompetitionId: -1,
            activeCompetitionName: '',
            competitions: [],
            isLoadingCompetitions: false,
            isLoadingToursForCompetition: false,
            isErrorLoading: false,
        };
    }

//Вставить анотацию на класс контроллер @CrossOrigin(origins="http://.....")
    componentDidMount() {
        this.getCompetitionList();
    }

    getAllToursInCompetition(idCompetition) {
        this.setState({
            isLoadingToursForCompetition: true,
        });
        axios.get(localStorage.getItem("host") + "competition/" + this.state.activeCompetitionId+"/tours")
            //  axios.get("http://localhost:8092/ui/teamsInSeason/"+this.state.currentSeasonYear)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    tours: data,
                    isLoadingToursForCompetition: false,
                    isErrorLoading: false,
                });
            }).catch(() => {
            this.setState({
                isErrorLoading: true,
                isLoadingToursForCompetition: false,
            });
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.activeCompetitionId !== prevState.activeCompetitionId) {
            this.getAllToursInCompetition(this.state.activeCompetitionId);
        }
    }

    getCompetitionList() {
        this.setState({
            isLoadingCompetitions: true,
        });
        axios.get(localStorage.getItem("host") + "competitions")
            // axios.get("http://localhost:8092/ui/currentSeason")
            .then(response => response.data)
            .then((data) => {
                console.log(data);
                this.setState({
                    competitions: data,
                    isLoadingCompetitions: false,
                    isErrorLoading: false,
                });
            }).catch(() => {
            this.setState({
                isErrorLoading: true,
                isLoadingCompetitions: false,
            });
        });
    };

    /*  deleteTour = (tourId) => {
          axios.delete(localStorage.getItem("host")+"tour/" + tourId)
              //  axios.delete("http://localhost:8092/ui/team/" + teamId)
              .then(response => {
                  if (response.data != null) {
                      console.log("Delete OK");
                      console.log(response.data);
                      this.setState({"error": false, "show": true, "blockScreen": false});
                      setTimeout(() => this.setState({"show": false}), 3000);
                      this.setState({
                          teams: this.state.teams.filter(team => team.id !== teamId)
                      });
                  }
              }).catch(() => {
              this.setState({"error": true, "show": true, "blockScreen": false});
              setTimeout(() => this.setState({"show": false}), 3000);
              console.log("Error during deletion");
          });
      };
  */
    render() {
        const isLoadingCompetitions = this.state.isLoadingCompetitions;
        const isLoadingToursForCompetition = this.state.isLoadingToursForCompetition;
        const isErrorLoading = this.state.isErrorLoading;
        let info;
        /*  if (isLoadingSeason || isLoadingTeamList) {
              info = <tr align={"center"}>
                  <td colSpan={"5"}>Идет загрузка</td>
              </tr>;
          }*/
        if (isErrorLoading) {
            info = <tr align={"center"}>
                <td colSpan={"5"}>Ошибка загрузки</td>
            </tr>;
        }
        return (
            <div>
                <div style={{"display": this.state.show ? "block" : "none"}}>
                    <ToastMessage
                        show={this.state.show}
                        error={this.state.error}
                        message={!this.state.error ? "Вилучення пройшло успішно!" : "Помилка при вилученні"}
                    />
                </div>
                <Card className={"text-white"} style={{backgroundColor: 'transparent'}}>
                    <div style={{"display": "inline"}}>
                    <Card.Header><FontAwesomeIcon icon={faList}/> Тури змагання</Card.Header>
                    <DropdownButton style={{"display": "inline"}} id="dropdown-basic-button" title=
                        {isLoadingCompetitions ? "Завантаження..." : "Обрати змагання"}>
                        {this.state.competitions.map((competition) => (
                            <Dropdown.Item onClick={() => this.setState({activeCompetitionName: competition.name,
                                activeCompetitionId: competition.id})}>
                                {competition.name}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <Link style={{"display": "inline"}} className="nav-link"
                          to={"competition/"+this.state.activeCompetitionId+"/"+this.state.activeCompetitionName+"/tours/-1/ "}>{' '}

                        <Button size="sm" variant="info" type="button"
                                style={{"display": (localStorage.getItem("role") && localStorage.getItem("role").match("ADMINISTRATOR") && this.state.activeCompetitionId!=-1) ? "inline" : "none"}}
                            //  onClick={this.addNewGame.bind()}
                        >
                            <FontAwesomeIcon icon={faList}/> Створити новий тур
                        </Button>
                    </Link>
                    </div>
                    <Card.Body>
                        <Table striped bordered hover variant={"dark"}>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Назва</th>
                                <th>Дата</th>
                                <th>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {info}
                            {
                                this.state.tours.length === 0 && !isLoadingCompetitions && !isLoadingToursForCompetition ?
                                    <tr align={"center"}>
                                        <td colSpan={"4"}>Тури відсутні</td>
                                    </tr> :
                                    isLoadingCompetitions || isLoadingToursForCompetition ?
                                        <tr align={"center"}>
                                            <td colSpan={"4"}>Завантаження</td>
                                        </tr> :
                                        this.state.tours.map((tour, count) => (
                                            <tr key={tour.id}>
                                                <td>{count + 1}</td>
                                                <td>{tour.name}</td>
                                                <td>{tour.date}</td>
                                                <td>
                                                    <ButtonGroup>
                                                        <Link className="btn btn-sm btn-outline-warning"
                                                              style={{"display": (localStorage.getItem("role") && localStorage.getItem("role").match("ADMINISTRATOR")) ? "block" : "none"}}
                                                              to={"competition/"+this.state.activeCompetitionId+"/"+this.state.activeCompetitionName+"/tours/" + tour.id + "/" + tour.name}>{' '}
                                                            <FontAwesomeIcon icon={faAddressBook}/>
                                                        </Link>{' '}

                                                    </ButtonGroup>


                                                </td>

                                            </tr>
                                        ))
                            }

                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>
            </div>
        );
    }
}