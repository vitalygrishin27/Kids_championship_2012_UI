import React, {Component} from "react";
import {Jumbotron} from "react-bootstrap";

export default class Welcome extends Component {

    componentDidMount() {
       localStorage.setItem("host", "https://kids-championchip-2012-service.herokuapp.com/ui/")
     // localStorage.setItem("host", "http://localhost:8092/ui/")
    }

    render() {
        return (
            <Jumbotron className="bg-dark text-white">
                <h1>Дергачівська районна федерація футболу</h1>
                <p>
                    Ресурс для адміністрування змагань сезону 2020
                </p>
            </Jumbotron>
        );
    }
}