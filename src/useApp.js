import { useEffect, useState } from "react";

var localGifs = []
var currentGifIndex = 0;

function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

const useApp = () => {
    const [gif, setGif] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/gifs/all")
            .then(res => res.json())
            .then(result => {
                console.log(result)
                localGifs = shuffle(result)

                setGif(localGifs[currentGifIndex])
            })
    }, [])

    const upvoteGif = () => {
        fetch("http://localhost:8080/gifs/" + localGifs[currentGifIndex].id + "/upvote", { method: "POST" })
            .then(res => res.json())
            .then(result => {
                localGifs[currentGifIndex] = result

                updateGifs();
            })
    }

    const downvoteGif = () => {
        fetch("http://localhost:8080/gifs/" + localGifs[currentGifIndex].id + "/downvote", { method: "POST" })
            .then(res => res.json())
            .then(result => {
                localGifs[currentGifIndex] = result

                updateGifs();
            })
    }

    const updateGifs = () => {
        currentGifIndex = (currentGifIndex + 1) % localGifs.length;
        setGif(localGifs[currentGifIndex]);
    }

    return {
        gif,
        upvoteGif,
        downvoteGif,
    }
};

export default useApp;
