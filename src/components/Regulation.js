import React, {Component} from "react";
import axios from "axios";
import {Button, Card} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons";

export default class Competition extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Card className={"text-white"} style={{backgroundColor: 'transparent'}}>
                    <Card.Header><FontAwesomeIcon icon={faList}/>
                        {'  '}{'  '}
                        <a href="images/CUP-2021.pdf" download>Положення <b>"Dergachi Cup 2021"</b></a>
                    </Card.Header>
                </Card>
                <div style={{"height": 50}}></div>
            </div>
        );
    }
}
