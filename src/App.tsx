import React from 'react'
import { io } from 'socket.io-client'

import './App.css';

interface Payload {
  name: string
  text: string
}

interface Message {
  id: string
  payload: Payload
}

const socket = io('http://localhost:3334')

class App extends React.Component<object, { messages: Array<Message> }> {
  textInput: React.RefObject<HTMLInputElement>

  componentDidMount(): void {
    socket.on('msgToClient', (payload: Payload) => {
      console.log(payload)
      this.receivedMessage(payload);
    })
  }

  constructor(props: object | Readonly<object>) {
    super(props)

    this.state = { messages: [] }
    this.textInput = React.createRef()
  }

  sendMessage() {
    let text = this.textInput.current!.value ?? '-- No text --';

    if (text.length < 1 || text.length > 50) {
      text = '-- No text --';
    }

    const message: Payload = { name: socket.id, text }

    socket.emit('msgToServer', message)
    this.textInput.current!.value = '';
  }

  receivedMessage(payload: Payload) {
    const newMessage: Message = { id: "id aqui", payload }

    console.log(payload);

    this.setState({ messages: [...this.state.messages, newMessage] })
  }

  getName(id: string) {
    return id === socket.id ? 'My' : id
  }

  showMessages() {
    return (
      this.state.messages.map((m: Message, index: number) => <p key={index} ><b>{this.getName(m.payload.name)}: </b>{m.payload.text}</p>)
    )
  }

  clearMessages() {
    this.setState({ messages: [] })
  }

  render(): React.ReactNode {
    return(<main>
      <div id='content'>
        <div id='content-messages'>
          <div id='content-messages-display'>
            {this.showMessages()}
          </div>
        </div>
        <div id='content-input'>
          <div id='content-input-text'>
            <input ref={this.textInput} maxLength={50} placeholder='Text'/>
          </div>
          <div id='content-input-infos'>
          <button onClick={() => this.sendMessage()}>Send</button>
          <button onClick={() => this.clearMessages()}>Clear</button>
          </div>
        </div>
      </div>
    </main>)
  }
}

export default App
