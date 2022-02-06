import { LinearProgress } from '@material-ui/core';
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
  } = useApp()

  const StyledLinearProgress = withStyles({
    colorPrimary: {
      backgroundColor: "Green",
    },
    barColorPrimary: {
      backgroundColor: "red"
    }
  })(LinearProgress);

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
      </div>
  }

  return (
    <div className="App">
      <div className='downvoteArea' onClick={() => {
        if (!showVotes)
          downvoteGif()
      }}></div>
      {shownArea}
      <div className='upvoteArea' onClick={() => {
        if (!showVotes)
          upvoteGif()
      }}></div>
    </div>
  );
}

export default App;
