import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

import "./Chat.css"
const people = [
    { title: 'Andy', id: 1 },
    { title: 'Rich', id: 2 },
    { title: 'Nick', id: 3 },
  ];
var chatLog = {
    1 : {
        chat: [
            {  
                id : 1,
                content: 'test',
            },
            {
                id: 2,
                content: 'next',
            },
        ]
    },
    2 : {
        chat: [
            {  
                id : 1,
                content: 'done',
            },
        ]
    },
}

const testContext = createContext("hello world");

function ChatList({setCurId}) {
    function handle(id) {
        console.log(id);
    }
    const listItems = people.map(product =>
        <li key={product.id} onClick={()=>setCurId(product.id)}>
          {product.title}
        </li>
      );
      
      return (
        <div className="chat-list">
            <ul>{listItems}</ul>
        </div>
      );
}

function ChatDisplay() {
    const requiredId = useContext(testContext);
    const requiredList = chatLog[requiredId].chat.map(text=>
        <div key={text.id}>{text.content}</div>);
    return (
        <div className="chat--display">
            {requiredList}
        </div>
    );
}

function SendMsg({props}) {
    const curId = useContext(testContext);
    const [showModal, setShowModel] = useState(false);
    return (
        <div className="send--msg">
            <button className="send--msg__button" onClick={()=>{
                setShowModel(true);
            }}>msg</button>
            {showModal && createPortal(
                <MsgModal onClose={()=>setShowModel(false)} props={props}/>,
                document.body
            )}
        </div>
    );
}

function MsgModal({ onClose , props}) {
    const [inputValue, setInputValue] = useState('');
    const curId = useContext(testContext);
    function broadcast() {
        Object.keys(chatLog).forEach(key => {
            chatLog[key].chat.push({id: chatLog[curId].length + 1, content: inputValue});
            setInputValue('');
        })
    }
    function send() {
        chatLog[curId].chat.push({id: chatLog[curId].length + 1, content: inputValue})
        setInputValue('');
    }
    function handleInputChange(event) {
        setInputValue(event.target.value);
    }
    return (
        <div className="msg--modal">
            <input type="text" value={inputValue} onChange={handleInputChange}/>
            <button onClick={send}>send</button>
            <button onClick={broadcast}>broadcast</button>
            <button onClick={()=>onClose()}>x</button>

        </div>
    );
}


function Chat() {
    const [curId, setCurId] = useState(1);
    return (
        <testContext.Provider value={curId}>
            <div className="chat">
                <ChatList setCurId={setCurId}/>
                <ChatDisplay/>
                <SendMsg props={setCurId}/>    
            </div>
            
        </testContext.Provider>
    );
}

export default Chat;