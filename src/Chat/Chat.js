
import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import ChatWindow from './ChatWindow/ChatWindow';
import ChatInput from './ChatInput/ChatInput';

const Chat = () => {
    const [ connection, setConnection ] = useState(null);
    const [ chat, setChat ] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5220/hub')
            .configureLogging(LogLevel.Trace)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected to C# Chat Backend!');
    
                    connection.on('messageReceived', (user, message) => {
                        const updatedChat = [...latestChat.current];
                        updatedChat.push({ user, message } );
                    
                        setChat(updatedChat);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async (user, message) => {

        if (connection._connectionStarted) {
            try {
            await connection.invoke("NewMessage", user, message);
          } catch (e) {
            console.log(e);
          }
        } else {
          alert("No connection to server yet.");
        }
    }

    return (
        <div>
            <ChatInput sendMessage={sendMessage} />
            <hr />
            <ChatWindow chat={chat}/>
        </div>
    );
};

export default Chat;
