import React, { Component } from 'react';
import Quagga from 'quagga';
import Brcode from '../brcode.png'

export default class Scanner extends Component {
constructor(props) {
super(props);
this._onDetected = this._onDetected.bind(this);
}

componentDidMount() {
    console.log("working")
    Quagga.decodeSingle({
        src: Brcode,
        numOfWorkers: 0, // Needs to be 0 when used within node
        inputStream: {
        size: 400 // restrict input-size to be 800px in width (long-side)
        },
        decoder: {
        readers: ["ean_reader"] // List of active readers
        },
        }, function(result) {
            console.log("resulttt", result)
        if(result.codeResult) {
        console.log("result", result.codeResult.code);
        } else {
        console.log("not detected");
        }
        });
Quagga.onDetected(this._onDetected);
}

componentWillUnmount() {
Quagga.offDetected(this._onDetected);
}

_onDetected(result) {
this.props.onDetected(result);
}

render() {
return <div id="interactive" className="viewport" />;
}
}