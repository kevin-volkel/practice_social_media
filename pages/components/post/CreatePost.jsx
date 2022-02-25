import React, { useState, useRef } from 'react'
import {Form, Button, Image, Divider, Message, Icon} from 'semantic-ui-react'
import { submitNewPost } from '../../util/postActions';
import axios from 'axios'

const CreatePost = () => {
  const [newPost, setNewPost] = useState({text: "", location: ""})
  const [loading, setLoading] = useState(false)
  const inputRef = useRef();

  const [error, setError] = useState(null)
  const [highlighted, setHighlighted] = useState(false)

  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)

  //* HANDLERS

  const handleChange = (e) => {
    const {name, files, value} = e.target
    if(name === 'media') {
      setMedia(files[0])
      setMediaPreview(URL.createObjectURL(files[0]))
    }
    setNewPost((prev) => ({...prev, [name]: value}))
  }

  const addStyles = () => ({
    textAlign: 'center',
    height: '150px',
    width: '150px',
    border: 'dotted',
    paddingTop: media === null && '60px',
    cursor: 'pointer',
    borderColor: highlighted ? 'green' : 'black'
  })

  return (
    <div>
      CreatePost
    </div>
  );
}

export default CreatePost;