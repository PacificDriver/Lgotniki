import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs'
import styles from './AudioPlayer.module.scss'

const AudioPlayer = ({ file, messageType = '' }) => {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const [showDuration, setShowDuration] = useState(true)

  const waveColor = messageType === 'received' ? '#6A768B' : '#a1a1f6'
  const progressColor = messageType === 'received' ? '#162949' : '#f6f6fe'

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      //   waveColor:  '#a1a1f6',
      waveColor: waveColor,
      progressColor: progressColor,
      cursorColor: 'transparent',
      url: file,
      dragToSeek: true,
      hideScrollbar: true,
      normalize: true,
      responsive: true,
      height: 20,
      barWidth: 2,
      barRadius: 2,
    })

    wavesurferRef.current.on('ready', () => {
      setDuration(formatTime(wavesurferRef.current.getDuration()))
    })

    wavesurferRef.current.on('audioprocess', () => {
      setCurrentTime(formatTime(wavesurferRef.current.getCurrentTime()))
    })

    wavesurferRef.current.on('finish', () => {
      setIsPlaying(false)
      setShowDuration(true)
    })

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }
    }
  }, [file])

  const formatTime = time => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause()
      } else {
        wavesurferRef.current.play()
        setShowDuration(false)
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className={styles['audio-player']}>
      <button
        onClick={handlePlayPause}
        className={`${styles['audio-player__control-button']} ${messageType === 'received' ? styles['audio-player__control-button--received'] : ''}`}
      >
        {isPlaying ? (
          <BsFillPauseFill />
        ) : (
          <BsFillPlayFill
            className={styles['audio-player__control-button--play']}
          />
        )}
      </button>

      <div
        ref={waveformRef}
        className={styles['audio-player__wavesurfer']}
      ></div>

      <div
        className={`${styles['audio-player__timer']} ${messageType === 'received' ? styles['audio-player__timer--received'] : ''}`}
      >
        <span className={styles['audio-player__timer--time']}>
          {showDuration ? duration : currentTime}
        </span>
      </div>
    </div>
  )
}

export default AudioPlayer
