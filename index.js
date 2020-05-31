const express = require('express');
const upload = require('./multer');
const cloudinary = require('./cloudinary');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false} ));
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('hello')
})

//make a pos request
app.post('/upload-images', upload.array('image'), async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  if(req.method === 'POST'){
    const urls = []
    const files = req.files
    for(const file of files){
      const {path} = file
      const newPath = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }
    res.status(200).json({
      message: 'images uploaded successfully',
      data: urls
    })
  } else {
    res.status(405).json({
      err: 'images failed to upload'
    })
  }
})
app.listen(5000, ()=>{
  console.log('server running at port 5000')
})