import {useState} from "react";
import axios from "axios";
import './App.css';

export default function App() {
    const [loading, setLoading] = useState(false);
    let [value, setValue] = useState("");
    const [messages, setMessages] = useState([{type:"response",label:"How can i Help you With?"}]);


    function ScrollBottom() {
        let allMatchedElements = document.getElementById('chat');
        allMatchedElements.scrollTop = (allMatchedElements.scrollHeight - allMatchedElements.clientHeight) + 1;
    }

    const getRes = (e) => {
        e.preventDefault()
        ScrollBottom()
        const newMessage = {type: "sender", label: value};
        setMessages((prev) => ([...prev, newMessage]));
        setValue("");
        setLoading(true);
        const data = {
            "messages": [{
                "role": "user", "content": `
                Pretend like you are customer support and you are representing test company and your email is test@gmail.com 
                so assist them
                Mario: Hi, My name is shailesh and i am Developer and my email address is work@gmail.com 
                currently i am working in It Company as a Developer.
                ${value}
        support:
      `
            }],
            "model": "gpt-3.5-turbo"
        }
        axios({
            method: "POST",
            url: "https://api.openai.com/v1/chat/completions",
            data: data,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer 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"
            }
        })
            .then((res) => {
                responseHandler(res);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e.message, e);
            });
    };

    const responseHandler = (res) => {
        if (res.status === 200) {
            const newMessage = {type: "response", label: res.data.choices[0].message.content};
            setMessages((prev) => ([...prev, newMessage]));
            setLoading(false);
        }
    };
    return (
        <div className="App">
            <div className="container">
                <div className="header">
                    <img src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png" alt="" className="avatar"/>
                    <h3>Assistant</h3>
                </div>
                <div id="chat" className="chat">
                    {messages.map((item,index)=>(
                        <div className={`message ${item.type}`} key={index}>
                            {item.label}
                        </div>
                    ))}
                    {loading && (
                        <div className="message response">
                            <i className="fa-solid fa-ellipsis"/>
                        </div>
                    )}
                </div>

                <form style={{display: "contents"}} onSubmit={getRes}>
                    <input
                        disabled={loading}
                        type="text"
                        id="jokeBtn"
                        className="btn"
                        placeholder={loading ? "Please Wait" : "Can you tell me a How can i Help you With?"}
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                    />
                </form>
            </div>
        </div>
    );
}
