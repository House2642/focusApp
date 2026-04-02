import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react'
import styles from '../styles/CuriousScreen.module.css'

export default function CuriousScreen({ messages, isLoading, error, submitAnswer, isDone, proceed }) {
  const csMessages = messages.map((msg, i) => ({
    message: msg.content,
    sender: msg.role === 'assistant' ? 'assistant' : 'user',
    direction: msg.role === 'assistant' ? 'incoming' : 'outgoing',
    position: 'single',
    id: i
  }))

  function handleSend(_, text) {
    if (!text.trim() || isLoading) return
    submitAnswer(text)
  }

  return (
    <div className={styles.screen}>
      <MainContainer className={styles.mainContainer}>
        <ChatContainer>
          <MessageList
            typingIndicator={isLoading ? <TypingIndicator /> : null}
            className={styles.messageList}
          >
            {csMessages.map(msg => (
              <Message key={msg.id} model={msg} className={styles.message} />
            ))}
          </MessageList>

          {isDone ? (
            <div as="MessageInput">
              <button className={styles.ctaBar} onClick={proceed}>
                What else could I be doing with my time?
              </button>
            </div>
          ) : (
            <MessageInput
              placeholder="Just say what's true…"
              onSend={handleSend}
              disabled={isLoading}
              attachButton={false}
              className={styles.messageInput}
              autoFocus
            />
          )}
        </ChatContainer>
      </MainContainer>
    </div>
  )
}
