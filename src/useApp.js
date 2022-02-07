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
    const [gifInformation, setGifInformation] = useState({
        title: "",
        author: "",
        descripton: "",
        topic: "",
    })
    const [gifDetails, setGifDetails] = useState({
        fileSize: 0,
        imageWidth: 0,
        imageHeight: 0,
        frameCount: 0,
        duration: 0,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch("http://localhost:8080/api/gifs")
            .then(res => res.json())
            .then(result => {
                localGifs = shuffle(result)

                setGif(localGifs[currentGifIndex])

                fetch("http://localhost:8080/api/gifs/" + localGifs[currentGifIndex].id + "/information")
                    .then(res => res.json())
                    .then(result => setGifInformation(result))
            })
    }, [])

    const upvoteGif = () => {
        console.log("upvote")
        fetch("http://localhost:8080/api/gifs/" + localGifs[currentGifIndex].id + "/upvote", { method: "POST" })
            .then(res => res.json())
            .then(result => {
                localGifs[currentGifIndex] = result
                startShowingVotes();
                setGif(localGifs[currentGifIndex]);
            })
    }

    const downvoteGif = () => {
        fetch("http://localhost:8080/api/gifs/" + localGifs[currentGifIndex].id + "/downvote", { method: "POST" })
            .then(res => res.json())
            .then(result => {
                localGifs[currentGifIndex] = result
                startShowingVotes();
                setGif(localGifs[currentGifIndex]);
            })
    }

    const startShowingVotes = () => {
        myInterval = setInterval(() => {
            if (seconds > 0) {
                seconds = seconds - 1;
            }
            if (seconds <= 0) {
                nextGif()
            }
        }, 1000)

        seconds = 30;
        setShowVotes(true)
        setInterval(myInterval)

        fetch("http://localhost:8080/api/calculator/calculate",
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({
                    upvotes: localGifs[currentGifIndex].upvotes,
                    downvotes: localGifs[currentGifIndex].downvotes,
                }),
            }
        )
            .then(res => res.json())
            .then(result => setRatio(result))
    }

    const requestDetails = () => {
        setLoading(true)
        fetch("http://localhost:8080/api/gifs/" + localGifs[currentGifIndex].id + "/details")
            .then(res => res.json())
            .then(result => {
                setLoading(false)
                setGifDetails(result)
            })
    }

    const postNewGif = () => {
        fetch("http://localhost:8080/api/gifs",
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({
                    url: document.getElementById("urlText").value,
                    title: document.getElementById("titleText").value,
                    author: document.getElementById("authorText").value,
                    description: document.getElementById("descriptionText").value,
                    topic: document.getElementById("topicText").value,
                }),
            }
        )
            .then(res => res.json())
            .then(result => {
                if (result.id !== undefined) {
                    fetch("http://localhost:8080/api/gifs")
                        .then(res => res.json())
                        .then(result => {
                            localGifs = shuffle(result)

                            setGif(localGifs[currentGifIndex])
                            nextGif()

                            document.getElementById("urlText").value = ""
                            document.getElementById("titleText").value = ""
                            document.getElementById("authorText").value = ""
                            document.getElementById("descriptionText").value = ""
                            document.getElementById("topicText").value = ""

                            fetch("http://localhost:8080/api/gifs/" + localGifs[currentGifIndex].id + "/information")
                                .then(res => res.json())
                                .then(result => setGifInformation(result))
                        })
                }
            })
    }

    const nextGif = () => {
        console.log("nextGif")
        clearInterval(myInterval)
        updateGifs();
    }

    const updateGifs = () => {
        currentGifIndex = (currentGifIndex + 1) % localGifs.length;
        setGif(localGifs[currentGifIndex]);
        setGifDetails(null)
        setShowVotes(false)

        fetch("http://localhost:8080/api/gifs/" + localGifs[currentGifIndex].id + "/information")
            .then(res => res.json())
            .then(result => setGifInformation(result))
    }

    return {
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
    }
};

export default useApp;
