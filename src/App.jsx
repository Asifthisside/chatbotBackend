import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import CreateChatbot from './components/CreateChatbot'
import MyChatbots from './components/MyChatbots'
import Appearance from './components/Appearance'
import Preview from './components/Preview'
import Replies from './components/Replies'
import Settings from './components/Settings'
import ErrorToast from './components/ErrorToast'

function App() {
  return (
    <Router>
      <ErrorToast />
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="create" element={<CreateChatbot />} />
          <Route path="chatbots" element={<MyChatbots />} />
          <Route path="appearance" element={<Appearance />} />
          <Route path="preview" element={<Preview />} />
          <Route path="replies" element={<Replies />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

