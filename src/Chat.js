import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

import "./Chat.css"
const people = [
    { name: 'Andy', id: 1 },
    { name: 'Rich', id: 2 },
    { name: 'Nick', id: 3 },
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
    3 : {
        chat: [
            {
                id : 1,
                content: 'what',
            }
        ]
    }
}

const testContext = createContext("hello world");
const sendContext = createContext();

function ChatList({setCurId}) {
    function handle(id) {
        console.log(id);
    }
    const listItems = people.map(product =>
        <li key={product.id} onClick={()=>setCurId(product.id)}>
          {product.name}
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
    const log = useContext(sendContext);
    const requiredList = log[requiredId].chat.map(text=>
        <div key={text.id}>{text.content}</div>);
    return (
        <div className="chat--display">
            {requiredList}
        </div>
    );
}

function SendMsg({setLog}) {
    const curId = useContext(testContext);
    const [showModal, setShowModel] = useState(false);
    const [status, setStatus] = useState(false);
    const [statusValue, setStatusValue] = useState('success');

    return (
        <div className="send--msg">
            <button className="send--msg__button" onClick={()=>{
                setShowModel(true);
                setStatus(false);
            }}>msg</button>
            {showModal && createPortal(
                <MsgModal onClose={()=>setShowModel(false)} setShowModel={setShowModel} setStatus={setStatus} setLog={setLog}/>,
                document.body
            )}
            {status && createPortal(
                <span>{statusValue}</span>, document.body
            )}
        </div>
    );
}

function MsgModal({ onClose, setShowModel, setStatus, setLog}) {
    const [inputValue, setInputValue] = useState('');
    const curId = useContext(testContext);
    function broadcast() {
        setStatus(true);
        setShowModel(false);
        setTimeout(()=>setStatus(false), 3);
        Object.keys(chatLog).forEach(key => {
            chatLog[key].chat.push({id: chatLog[curId].length + 2, content: inputValue});
            setInputValue('');
        })
        setLog(chatLog);
    }
    function send() {
        setTimeout(()=>setStatus(false), 3000);
        
        setStatus(true);
        setShowModel(false);


        chatLog[curId].chat.push({id: chatLog[curId].length + 2, content: inputValue})
        setInputValue('');
        setLog(chatLog);
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
function test() {
    return (
        <div>
            success
        </div>
    )
}

function Chat() {
    const [curId, setCurId] = useState(1);
    const [log, setLog] = useState(chatLog);
    return (
        <sendContext.Provider value={log}>
        <testContext.Provider value={curId}>
            <div className="chat">
                <ChatList setCurId={setCurId}/>
                <ChatDisplay/>
                <SendMsg setLog={setLog}/>    
            </div>
            
        </testContext.Provider>
        </sendContext.Provider>
    );
}

export default Chat;