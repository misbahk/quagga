import React, { Component } from 'react';
import Quagga from 'quagga';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Card } from 'react-bootstrap';
var result;
export default class Scanner extends Component {
state = {
src: null,
crop: '',
field:false,
imagearea:false
}



componentDidMount(){
localStorage. clear();
}

onSelectFile = e => {
if (e.target.files && e.target.files.length > 0) {
const reader = new FileReader();
reader.addEventListener('load', () =>
this.setState({ src: reader.result })
);
reader.readAsDataURL(e.target.files[0]);
}
this.setState({
imagearea:true
})
};
onImageLoaded = image => {
this.imageRef = image;
};

onCropComplete = crop => {
this.makeClientCrop(crop);
};

onCropChange = (crop, percentCrop) => {
// You could also use percentCrop:
// this.setState({ crop: percentCrop });
this.setState({ crop });
};

async makeClientCrop(crop) {
if (this.imageRef && crop.width && crop.height) {
const croppedImageUrl = await this.getCroppedImg(
this.imageRef,
crop,
'newFile.jpeg'
);
this.setState({ croppedImageUrl });
}

}
someFunction = ()=>{
let local = localStorage.getItem("CODE")
result = local
this.setState({
field:true
})
}
getCroppedImg(image, crop, fileName) {
Quagga.decodeSingle({
src: this.state.src,
numOfWorkers: 1,
inputStream: {
size: 800
},
decoder: {
readers: ["code_128_reader", "code_39_reader", "code_39_vin_reader", "ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader", "codabar_reader"]
},
}, function(result) {
if(result.codeResult) {

setTimeout(() => {
localStorage.setItem("CODE",result.codeResult.code)
},3000);
} else {
localStorage.setItem("CODE","NOT DETECTED")
}
});
setTimeout(() => {
this.someFunction()
},5000);
const canvas = document.createElement('canvas');
const scaleX = image.naturalWidth / image.width;
const scaleY = image.naturalHeight / image.height;
canvas.width = crop.width;
canvas.height = crop.height;
const ctx = canvas.getContext('2d');

ctx.drawImage(
image,
crop.x * scaleX,
crop.y * scaleY,
crop.width * scaleX,
crop.height * scaleY,
0,
0,
crop.width,
crop.height
);
return new Promise((resolve, reject) => {
canvas.toBlob(blob => {
if (!blob) {
//reject(new Error('Canvas is empty'));
console.error('Canvas is empty');
return;
}
blob.name = fileName;
window.URL.revokeObjectURL(this.fileUrl);
this.fileUrl = window.URL.createObjectURL(blob);
resolve(this.fileUrl);
}, 'image/jpeg');
});
}








render() {
const { crop, croppedImageUrl, src } = this.state;
return (
<>


<div style={{position:"absolute", top:"50%", left:"50%", transform:"translateY(-50%)"}}>

  <div class="row m-0">
  <Card style={{border:"2px solid grey"}}>
  <Card.Body>

  <div class="col-md-6" >
    <center>
  
    
    <input type="file" accept="image/*" onChange={this.onSelectFile} />


    <br/>
  
    </center>
    {this.state.imagearea?
    <p style={{color:"#d249bb", fontSize:"16px", fontWeight:"bold"}}>Next..
        <br/>
        PLEASE SELECT THE AREA OF BARCODE IMAGE AFTER IMAGE UPLOAD</p>
    :
    null} 
        </div>
  </Card.Body>
</Card>

     

    </div>
<br/>


    <div class="row m-0">           
<Card style={{width:"100%", border:"2px solid grey"}}>
  <Card.Body>

<p style={{fontSize:"18px", color:"black", fontWeight:"600"}}>DETAILS:</p>

{this.state.field?
<>
<form>
<lable style={{color:"darkblue", fontSize:"16px", fontWeight:"600"}}>Detected Barcode {"  "}</lable>
<input style={{color:"darkgrey", fontSize:"16px", fontWeight:"600"}} 
type="text" value={result} disabled />
</form>




</>
:
null
}


 </Card.Body>
</Card>
</div>

    
    </div>
  

{src && (
<ReactCrop
src={src}
crop={crop}
ruleOfThirds
onImageLoaded={this.onImageLoaded}
onComplete={this.onCropComplete}
onChange={this.onCropChange}
/>
)}


<br/>
{croppedImageUrl && (
<img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
)}




</>
)
}
}