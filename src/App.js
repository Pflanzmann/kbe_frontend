import './App.css';
import useApp from "./useApp.js";

function App() {
  const {
    gif,
    upvoteGif,
    downvoteGif
  } = useApp()

  return (
    <div className="App">
      <img src={gif.url} id="picture" alt="Ups something went wrong!" onClick={(e) => {
        var bounds = document.getElementById("picture").getBoundingClientRect();
        var width = bounds.right - bounds.left;
        var moveMouseX = e.clientX - bounds.left;

        if (100 / width * moveMouseX < 30) {
          downvoteGif()
        }


        if (100 / width * moveMouseX > 70) {
          upvoteGif()
        }
      }} width="1000vh" height="1000vh" />
    </div>
  );
}

export default App;
