import { useState } from "react"
import axios from "axios"
import './App.css';

function App() {
  const [data, setData] = useState({ file: null })
  const [info, setInfo] = useState({})

  const upload = () => {
    if (!data.file) {
      alert("Upload any file to recognise...")
      return
    }
    const formData = new FormData()
    formData.append("image", data.file)

    axios({
      method: "POST",
      url: "/upload-file",
      headers: {
        'Content-Type': `multipart/form-data; boundary="mern-memory"`
      },
      data: formData
    })
      .then((res) => setInfo(res.data.report))
      .catch(error => console.log(error.response.data))
  }

  return (
    <>
      <div className="container my-3 App">
        <div className="my-4">
          <h1 style={{ "textDecoration": "underline", "fontStyle": "italic" }}>Image Analyser</h1>
        </div>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">Upload any image</label>
          <input className="form-control" type="file" id="formFile" onChange={e => setData({ file: e.target.files[0] })} />
        </div>
        <button className='btn btn-dark' onClick={upload}>Start Analyse</button>

        {Object.keys(info).length
          ? <div className="my-4 result">
            <h4>Results</h4>
            <div className="row mt-5">
              <div className="col-6">
                <img src={info.location} alt={info.originalname} />
              </div>
              <div className="col-6 details">
                <p className="mt-2"><b>Age Range: </b>{info.AgeRange.Low} - {info.AgeRange.High} years old</p>
                <p><b>Gender: </b>{info.Gender.Value} &nbsp;&nbsp; {(Math.round(info.Gender.Confidence * 100) / 100).toFixed(2)}%</p>
                <p><b>Emotion: </b>{info.Emotions[0].Type} &nbsp; &nbsp; {(Math.round(info.Emotions[0].Confidence * 100) / 100).toFixed(2)}% </p>
                <p><b>{info.Smile.Value ? "Smiling" : "Not Smiling"}: </b> {(Math.round(info.Smile.Confidence * 100) / 100).toFixed(2)}% </p>
                {info.Eyeglasses.Value &&
                  <p><b>Kept Eyeglasses: </b>{(Math.round(info.Eyeglasses.Confidence * 100) / 100).toFixed(2)}%</p>
                }
                {info.Sunglasses.Value &&
                  <p><b>Kept Sunglasses: </b>{(Math.round(info.Sunglasses.Confidence * 100) / 100).toFixed(2)}%</p>
                }
              </div>
            </div>
          </div>
          : null
        }
      </div>
    </>
  );
}

export default App;
