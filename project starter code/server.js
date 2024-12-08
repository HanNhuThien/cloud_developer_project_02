import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';



// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */
app.get("/filteredimage", async (req, res) => {
  let { image_url } = req.query;
  let filteredImg;

  //    1. validate the image_url query
  console.log("image_url:" + image_url)
  if (!image_url) {
    return res.status(400).send(`image_url is required`);
  }

  //    2. call filterImageFromURL(image_url) to filter the image
  try {
    filteredImg = await filterImageFromURL(image_url);
    console.log("file is saved in location: " + filteredImg)
  } catch (err) {
    return res.status(404).send(`Image not found, recheck image_url`)
  }
  //    3. send the resulting file in the response
  return res.status(200).sendFile(filteredImg, (error) => {
    console.log("send file from location: " + filteredImg)
    if(error){
      console.log("send file has error")
      console.log(error)
    }else{
      console.log("send file successfully")
    }

    //    4. deletes any files on the server on finish of the response
    console.log("delete image at location: " + filteredImg)
    deleteLocalFiles(Array.of(filteredImg))
  })

});
//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url=https://placedog.net/500")
});


// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
