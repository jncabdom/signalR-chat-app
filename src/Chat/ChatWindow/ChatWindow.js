import React from 'react';

import Message from '../../Message';

const ChatWindow = (props) => {
    console.log(props.chat);
    const chat = props.chat
        .map(m => <Message 
            key={Date.now() * Math.random()}
            user={m.user}
            message={m.message}/>);

    return(
        <div>
            {chat}
        </div>
    )
};

export default ChatWindow;
