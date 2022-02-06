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

var myInterval;
var seconds = 3;

const useApp = () => {
    const [gif, setGif] = useState([]);
    const [showVotes, setShowVotes] = useState(false);
    const [ratio, setRatio] = useState({
        upvoteRatio: 0.0,
        downvoteRatio: 0.0
    });

    useEffect(() => {
        fetch("http://localhost:8080/gifs/all")
            .then(res => res.json())
            .then(result => {
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
                startShowingVotes();
            })
    }

    const downvoteGif = () => {
        fetch("http://localhost:8080/gifs/" + localGifs[currentGifIndex].id + "/downvote", { method: "POST" })
            .then(res => res.json())
            .then(result => {
                localGifs[currentGifIndex] = result

                updateGifs();
                startShowingVotes();
            })
    }

    const updateGifs = () => {
        currentGifIndex = (currentGifIndex + 1) % localGifs.length;
        setGif(localGifs[currentGifIndex]);
    }

    const startShowingVotes = () => {
        myInterval = setInterval(() => {
            if (seconds > 0) {
                seconds = seconds - 1;
            }
            if (seconds <= 0) {
                setShowVotes(false)
                clearInterval(myInterval)
            }
        }, 1000)


        seconds = 3
        setShowVotes(true)
        setInterval(myInterval)

        fetch("http://localhost:8080/calculator/calculate",
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({
                    upvotes: gif.upvotes,
                    downvotes: gif.downvotes,
                }),
            }
        )
            .then(res => res.json())
            .then(result => {
                setRatio(result)
            })
    }


    return {
        gif,
        upvoteGif,
        downvoteGif,
        showVotes,
        ratio
    }
};

export default useApp;
