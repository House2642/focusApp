import useReground from './hooks/useReground.js'
import CaughtScreen from './components/CaughtScreen.jsx'
import CuriousScreen from './components/CuriousScreen.jsx'
import ReentryScreen from './components/ReentryScreen.jsx'

export default function App() {
  const state = useReground()

  if (state.screen === 'caught')  return <CaughtScreen selectTrigger={state.selectTrigger} />
  if (state.screen === 'curious') return <CuriousScreen messages={state.messages} questionIndex={state.questionIndex} isLoading={state.isLoading} error={state.error} submitAnswer={state.submitAnswer} isDone={state.isDone} proceed={state.proceed} />
  if (state.screen === 'reentry') return <ReentryScreen commitment={state.commitment} trigger={state.trigger} restart={state.restart} />
  return null
}
