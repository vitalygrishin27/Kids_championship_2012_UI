import React, {Component} from "react";
import {Navbar, Container, Col} from "react-bootstrap";

export default class Footer extends Component {
    render() {
        let fullYear = new Date().getFullYear();

        return (
            <Navbar fixed={"bottom"} bg="dark" variant="dark">
                <Container>
                    <Col lg={12} className={"text-center text-muted"}>
                        <div>
                            {fullYear}-{fullYear+1}. Developed by Vitaliy Grishin special for DERFF.
                        </div>
                    </Col>
                </Container>
            </Navbar>
        );
    }
}