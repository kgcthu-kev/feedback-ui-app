import { createContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState([])

  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  // fetch datd
  const fetchFeedback = async () => {
    const res = await fetch(
      `http://localhost:5000/feedback?_sort=id&_order=desc`
    )
    const data = await res.json()
    setFeedback(data)
    setIsLoading(false)
  }

  // add feedback
  const addFeedback = (newFeedback) => {
    newFeedback.id = uuidv4()
    setFeedback([newFeedback, ...feedback])
  }

  // delete feedback
  const deleteFeedback = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      setFeedback(feedback.filter((item) => item.id !== id))
    }
  }

  // set item to editable state
  const editFeedback = (item) => {
    setFeedbackEdit({
      item: item,
      edit: true,
    })
  }

  // update feedback item
  const updateFeedback = (id, updItem) => {
    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...updItem } : item))
    )
  }

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext