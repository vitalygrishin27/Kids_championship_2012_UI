import React, {Component} from 'react';

export default class ScreenBlocker extends Component {
    render() {
        const screenBlockerCss = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: '1',
            background: '#ccc',
            opacity: 0.5,
        };

        return (
            <div style={this.props.show ? screenBlockerCss : null}/>
        );
    }
}