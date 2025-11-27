import React, { useEffect, useRef, useState } from 'react'

import {
  MdOutlineFullscreen,
  MdOutlineFullscreenExit,
  MdPause,
  MdPlayArrow,
} from 'react-icons/md'

import styles from './VideoPlayer.module.scss'

function usePlayerState(videoPlayer, progressBar, videoContainer) {
  const [playerState, setPlayerState] = useState({
    playing: false,
    percentage: 0,
    currentTime: '00:00',
    fullscreen: false,
  })

  useEffect(() => {
    playerState.playing
      ? videoPlayer?.current?.play()
      : videoPlayer?.current?.pause()
  }, [playerState.playing, videoPlayer])

  useEffect(() => {
    if (videoPlayer?.current?.offsetWidth < 400) {
      setPlayerState({
        ...playerState,
        fullscreen: false,
      })
    }
  }, [videoPlayer, videoPlayer?.current?.offsetWidth])

  function toogleVideoPlay() {
    setPlayerState({
      ...playerState,
      playing: !playerState.playing,
    })
  }

  function handleTimeUpdate() {
    const currentPercentage =
      (videoPlayer.current.currentTime / videoPlayer.current.duration) * 100

    progressBar.current.style.background = `linear-gradient(to right, #0053e4 ${currentPercentage}%, #b1bdbe ${currentPercentage}%)`

    setPlayerState({
      ...playerState,
      percentage: currentPercentage,
      currentTime: calculateTime(parseFloat(videoPlayer.current.currentTime)),
    })
  }

  function handleChangeVideoPercentage(event) {
    const currentPercentageValue = event.target.value

    videoPlayer.current.currentTime =
      (videoPlayer.current.duration / 100) * currentPercentageValue

    setPlayerState({
      ...playerState,
      percentage: currentPercentageValue,
    })
  }

  const toggleFullScreen = () => {
    if (playerState.fullscreen) {
      document.exitFullscreen()

      setPlayerState({
        ...playerState,
        fullscreen: false,
      })

      return
    }

    if (videoContainer.current.mozRequestFullScreen) {
      videoContainer.current.mozRequestFullScreen()
    } else if (videoContainer.current.webkitRequestFullScreen) {
      videoContainer.current.webkitRequestFullScreen()
    }

    setPlayerState({
      ...playerState,
      fullscreen: !playerState.fullscreen,
    })
  }

  const handleEnded = () => {
    setPlayerState({
      playing: false,
      percentage: 0,
      currentTime: calculateTime(0),
    })

    progressBar.current.style.background = '#b1bdbe '
  }

  const calculateTime = secs => {
    const minutes = Math.floor(secs / 60)
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${returnedMinutes}:${returnedSeconds}`
  }

  return {
    playerState,
    toogleVideoPlay,
    handleTimeUpdate,
    handleChangeVideoPercentage,
    toggleFullScreen,
    handleEnded,
  }
}

export default function VideoPlayer({ file }) {
  const [url, setUrl] = useState(null)
  const [showControls, setShowControls] = useState(true)

  const videoPlayer = useRef(null)
  const progressBar = useRef(null)
  const videoContainer = useRef(null)
  const controlsTimeout = useRef(null)

  const {
    playerState,
    toogleVideoPlay,
    handleTimeUpdate,
    handleChangeVideoPercentage,
    toggleFullScreen,
    handleEnded,
  } = usePlayerState(videoPlayer, progressBar, videoContainer)

  useEffect(() => {
    if (!file) return

    if (typeof file === 'string') {
      setUrl(file)
      return
    }

    if (file instanceof File || file instanceof Blob) {
      const objectUrl = URL.createObjectURL(file)
      setUrl(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeout.current)
    resetControlsTimeout()
  }

  const handleMouseLeave = () => {
    resetControlsTimeout()
  }

  const resetControlsTimeout = () => {
    clearTimeout(controlsTimeout.current)
    controlsTimeout.current = setTimeout(() => {
      if (playerState?.playing) setShowControls(false)
    }, 2000)
  }

  useEffect(() => {
    if (showControls) {
      resetControlsTimeout()
    }
  }, [showControls])

  return (
    <>
      {url && (
        <div
          className={styles['video-player-container']}
          onDoubleClick={() => toggleFullScreen()}
          ref={videoContainer}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <video
            className={styles['video-player-container__video']}
            src={url}
            ref={videoPlayer}
            onTimeUpdate={() => handleTimeUpdate()}
            onEnded={() => handleEnded()}
          ></video>

          <div
            className={styles['video-player-container__controls']}
            style={{ opacity: showControls ? 1 : 0 }}
          >
            <div
              className={styles['video-player-container__controls__control']}
            >
              <div
                className={`${styles['video-player-container__controls__control--play']}`}
                onClick={() => toogleVideoPlay()}
              >
                {playerState.playing ? <MdPause /> : <MdPlayArrow />}
              </div>

              <input
                type="range"
                className={
                  styles['video-player-container__controls__control--progress']
                }
                ref={progressBar}
                min="0"
                max="100"
                value={playerState?.percentage}
                onChange={event => handleChangeVideoPercentage(event)}
              />

              <div
                className={
                  styles[
                    'video-player-container__controls__control--current-time'
                  ]
                }
              >
                <span>{playerState.currentTime}</span>
              </div>

              <div
                className={
                  styles[
                    'video-player-container__controls__control--fullscreen'
                  ]
                }
                onClick={() => toggleFullScreen()}
              >
                {playerState.fullscreen ? (
                  <MdOutlineFullscreenExit />
                ) : (
                  <MdOutlineFullscreen />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
