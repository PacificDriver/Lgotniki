import React, { useState, useRef, useEffect } from 'react'
import {
  MdOutlinePlayCircleOutline,
  MdOutlinePauseCircleOutline,
  MdDeleteOutline,
} from 'react-icons/md'
import { IoIosSend } from 'react-icons/io'

import AudioPlayer from '../RenderFile/AudioPlayer'

import styles from './AudioRecorder.module.scss'

const AudioRecorder = ({ init = false, onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [timer, setTimer] = useState(0)
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [audioURL])

  useEffect(() => {
    if (init) {
      setIsRecording(init)
      startRecording()
    }
  }, [init])

  const startRecording = async () => {
    setAudioURL('')
    setAudioBlob(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      streamRef.current = stream

      const chunks = []
      recorder.ondataavailable = event => {
        chunks.push(event.data)
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        const newAudioURL = URL.createObjectURL(audioBlob)
        setAudioURL(newAudioURL)
        setAudioBlob(audioBlob)
        setTimer(0)
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1)
      }, 1000)
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const deleteAudio = () => {
    setAudioURL('')
    setAudioBlob(null)
    setTimer(0)
    onCancel?.()

    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleSave = () => {
    onSend?.(audioBlob)
    onCancel?.()
    setAudioBlob(null)
    setAudioURL('')

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  return (
    <div className={styles['audio-recorder']}>
      {!audioURL && (
        <>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={styles['audio-recorder__play-pause']}
          >
            {isRecording ? (
              <MdOutlinePauseCircleOutline
                className={styles['audio-recorder__play-pause--pause']}
              />
            ) : (
              <MdOutlinePlayCircleOutline />
            )}
          </button>
          <div className={styles['audio-recorder__timer']}>
            {isRecording && formatTime(timer)}
          </div>
        </>
      )}

      {audioURL && (
        <>
          <button
            onClick={deleteAudio}
            className={styles['audio-recorder__delete']}
          >
            <MdDeleteOutline />
          </button>

          <div>
            <AudioPlayer file={audioURL} messageType="received" />
          </div>

          <span
            className={styles['audio-recorder__on-send']}
            onClick={handleSave}
          >
            <IoIosSend />
          </span>
        </>
      )}
    </div>
  )
}

export default AudioRecorder
