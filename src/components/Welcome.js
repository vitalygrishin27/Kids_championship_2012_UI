import React, {Component} from "react";
import {Button, Card, Jumbotron} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList} from "@fortawesome/free-solid-svg-icons";

export default class Welcome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "KIDS (2012-2013)",
        };
        this.changeDB = this.changeDB.bind(this);
        this.changeDB = this.changeDB.bind(this);
    }

    componentDidMount() {
        localStorage.setItem("host", "https://kids-championchip-2012-service.herokuapp.com/ui/")
        localStorage.setItem("derff-subTitle", "KIDS (2012-2013)")
        // localStorage.setItem("host", "http://localhost:8092/ui/")
    }

    changeDB(dbName, title) {
       this.setState({
           title: title,
       });
        localStorage.setItem("host", dbName)
        localStorage.setItem("derff-subTitle", title)
    }

    render() {
        const {title} = this.state;
        return (
            <Jumbotron className="bg-dark text-white">
                <h1>KIDS-2021 Відкритий Чемпіонат з футболу серед дітей</h1>
                <h2 style={{"color":"red"}}>{title}</h2>
                <p>
                    Ресурс для адміністрування змагань сезону 2021
                </p>
                <Card className={"text-white"} style={{backgroundColor: 'transparent'}}>
                    <Card.Header>

                        {'  '}<Button size="sm" variant="info" type="button"
                                      style={{"display": "inline"}}
                                      onClick={this.changeDB.bind(this, "https://kids-championchip-2008-service.herokuapp.com/ui/", "ADULT (2008-2009)")}>
                        <FontAwesomeIcon icon={faList}/> ADULT (2008-2009)
                    </Button>
                        {'  '}<Button size="sm" variant="info" type="button"
                                      style={{"display": "inline"}}
                                      onClick={this.changeDB.bind(this, "https://kids-championchip-2010-service.herokuapp.com/ui/", "JUNIOR (2010-2011)")}>
                        <FontAwesomeIcon icon={faList}/> JUNIOR (2010-2011)
                    </Button>
                        {'  '}<Button size="sm" variant="info" type="button"
                                      style={{"display": "inline"}}
                                      onClick={this.changeDB.bind(this, "https://kids-championchip-2012-service.herokuapp.com/ui/", "KIDS (2012-2013)")}>
                        <FontAwesomeIcon icon={faList}/> KIDS (2012-2013)
                    </Button>
                    </Card.Header>
                    <Card.Body>
                    </Card.Body>
                </Card>
            </Jumbotron>
        );
    }
}
