import { Button, Card, CircularProgress, LinearProgress, styled, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import './App.css';
import useApp from "./useApp.js";

function App() {
  const {
    gif,
    upvoteGif,
    downvoteGif,
    showVotes,
    ratio,
    gifInformation,
    gifDetails,
    requestDetails,
    nextGif,
    loading,
    postNewGif,
    exportData,
    isExporting,
    isDebug,
  } = useApp()

  const StyledLinearProgress = withStyles({
    colorPrimary: {
      backgroundColor: "Green",
    },
    barColorPrimary: {
      backgroundColor: "red"
    }
  })(LinearProgress);

  const DownvoteButton = styled(Button)({
    backgroundColor: '#c81e1e',
    '&:hover': {
      backgroundColor: '#e10f0f',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
  });

  const UpvoteButton = styled(Button)({
    backgroundColor: '#1ec81e',
    '&:hover': {
      backgroundColor: '#0fe10f',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
  });

  var exportingView;
  if (isExporting) {
    exportingView = <Button variant="contained" onClick={exportData} style={{
      marginTop: "30px"
    }}>Is exporting <CircularProgress style={{ margin: "auto" }} /></Button>
  } else {
    exportingView = <Button variant="contained" onClick={exportData} style={{
      marginTop: "30px"
    }}>Export Data</Button>
  }

  var debugView;
  if (isDebug)
    debugView = <h3>DEBUG</h3>

  var details;
  if (gifDetails != null) {
    details = <Card className='detailsCard' variant="outlined">
      <h1 className='informationText'>Gif Details</h1>
      <b className='informationText'>File size: {gifDetails.fileSize}</b>
      <b className='informationText'>Width: {gifDetails.imageWidth}</b>
      <b className='informationText'>Height: {gifDetails.imageHeight}</b>
      <b className='informationText'>Frame count: {gifDetails.frameCount}</b>
      <b className='informationText'>Duration: {gifDetails.duration}</b>
    </Card>
  } else {
    if (!loading) {
      details = <div className="detailsButtonDiv">
        <Button variant="contained" onClick={requestDetails}>Request Details</Button>
      </div>
    } else {
      details = <div className="detailsButtonDiv"><CircularProgress /> </div >
    }
  }

  var shownArea;
  if (!showVotes) {
    shownArea = <img className='gifImg' src={gif.url} id="picture" alt="Ups something went wrong!" />
  } else {
    shownArea =
      <div className='infoBox'>
        <div className='voteBox'>
          <b className='downvoteCount'>{gif.downvotes}</b>
          <b className='upvoteCount'>{gif.upvotes}</b>
        </div>
        <div className='ratioBox'>
          <b className='downvoteRatio'>{ratio.downvoteRate}</b>
          <b className='upvoteRatio'>{ratio.upvoteRate}</b>
        </div>
        <StyledLinearProgress className='ratioBar' variant='determinate' value={ratio.downvoteRate * 100} />
        <Card className='informationCard' variant="outlined">
          <h1 className='informationText'>Gif informations</h1>
          <b className='informationText'>Title: {gifInformation.title}</b>
          <b className='informationText'>Author: {gifInformation.author}</b>
          <b className='informationText'>Description: {gifInformation.description}</b>
          <b className='informationText'>Topic: {gifInformation.topic}</b>
        </Card>
        {details}
      </div>
  }

  return (
    <div className="App">
      <div className='gifRatingArea'>
        <DownvoteButton className='downvoteArea' variant="outlined" onClick={() => {
          if (!showVotes)
            downvoteGif()
          else
            nextGif()
        }}></DownvoteButton>
        {shownArea}
        <UpvoteButton className='upvoteArea' variant="outlined" onClick={() => {
          if (!showVotes)
            upvoteGif()
          else
            nextGif()
        }}></UpvoteButton>
      </div>
      <div className='newGifArea'>
        {debugView}
        <TextField className='textBox' id="urlText" label="URL" variant="outlined" />
        <TextField className='textBox' id="titleText" label="Title" variant="filled" />
        <TextField className='textBox' id="authorText" label="Author" variant="outlined" />
        <TextField className='textBox' id="descriptionText" label="Description" variant="filled" />
        <TextField className='textBox' id="topicText" label="Topic" variant="outlined" />
        <Button variant="contained" onClick={postNewGif}>Post new gif</Button>
        {exportingView}
      </div>

    </div>
  );
}

export default App;
