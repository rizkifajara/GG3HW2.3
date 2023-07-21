// JSON structure :
/*
[
  {
    id: int,
    name: string, // Name of the Playlist
    songs: [
      id: int,
      title: string,
      artists: [string],
      url: string,
      playcount: int
    ]
  }
]
*/


const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// add playlist
app.post('/playlist/add', (req, res) => {
  let rawdata = fs.readFileSync('data.json')
  let data = JSON.parse(rawdata)

  const playlist = {
    id: data.length,
    name: req.body.name,
    songs: []
  }

  data.push(playlist)

  let newData = JSON.stringify(data);

  fs.writeFile('data.json', newData, (err) => {
      if (err) throw err;
      console.log('Data written to file');
  });

  console.log(data)
  res.status(200).send("Playlist added successfully!")
})

// add song to playlist
app.post('/playlist/:playlistId/addSong', (req, res) => {

  let rawdata = fs.readFileSync('data.json');
  let data = JSON.parse(rawdata);

  const song = { 
    id: data[req.params.playlistId].songs.length,
    title: req.body.title,
    artists: req.body.artists,
    url: req.body.url,
    playcount: 0
  };

  data[req.params.playlistId].songs.push(song)

  let newData = JSON.stringify(data);

  fs.writeFile('data.json', newData, (err) => {
      if (err) throw err;
      console.log('Data written to file');
  });

  console.log(data)
  res.status(200).send("Songs added successfully to playlist!")

})

// play song from playlist
app.get("/playlist/:playlistId/:songId", (req, res) => {
  let rawdata = fs.readFileSync('data.json');
  let data = JSON.parse(rawdata);

  if(typeof data[req.params.playlistId].songs[req.params.songId] != undefined) {
    data[req.params.playlistId].songs[req.params.songId].playcount++
    let newData = JSON.stringify(data);

    fs.writeFile('data.json', newData, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    console.log(data[req.params.playlistId].songs[req.params.songId].title)
    res.status(200).send(`Now playing ${data[req.params.playlistId].songs[req.params.songId].title}. It has been played ${data[req.params.playlistId].songs[req.params.songId].playcount} times.`)
  } else {
    res.send("Song cannot be found")
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

