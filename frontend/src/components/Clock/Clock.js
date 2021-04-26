import React, { useCallback, useEffect, useState } from 'react'
import { Button, Jumbotron, Progress } from 'reactstrap'
import classes from './Clock.module.css'

const Clock = ({ data , handler }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [progress, setProgress] = useState(0)
  const { clock, title, isTA } = data
  const { startTime, duration, overtime } = clock
  const one_min = 1000*60

  const handleProgress = useCallback(() => {
  	if (!startTime)
  		setProgress(0)
  	else if (duration === 0)
  		setProgress(100)
  	else {  		
  		const finish = Math.round(100*(currentTime.getTime()-startTime)/(one_min*(duration+overtime))) 			
  		setProgress(Math.min(finish, 101))
  	}
  }, [
    startTime,
    duration,
    overtime,
    currentTime,
    one_min
  ])
	
	useEffect(() => {
	  const timer = setInterval(() => {
	    setCurrentTime(new Date())
	    handleProgress()
	  }, 1000)
    return () => clearInterval(timer)
	}, [handleProgress])

	useEffect(() => {
		if (progress > 100)
			window.alert('Time\'s up!!!')
	}, [progress])
	
	const ExtendButton = ({ extendTime }) => {
	  return (
	    <Button
	      outline
	      color='info'
	      className={classes.button}
	      onClick={() => handler.ExtendTime(extendTime)}
	    >
				{`Add ${extendTime} min`}
		  </Button>
	  )
	}

	return (
		<div className={classes.clock}>
			
			<h2 className={classes.eventName}>{title}</h2>
			<div className={classes.eventTitle}>
				<p>{
				  `Total : ${duration} minutes + ${overtime} minutes extension`
				}</p>
				<p>{
				  startTime ?
				  'Start time : ' + new Date(parseInt(startTime)).toLocaleTimeString('en-US') :
				  'The test will start soon'
				}</p>
			</div>
			
			<Jumbotron>			
			  <h1 className={classes.currentTime}>{currentTime.toLocaleTimeString('en-US')}</h1>
			  <div className={classes.remainingAndEndTime}>
			  	<h5>{
			  	  `Remaining time: ${startTime ?
			  	  duration+overtime-Math.round((currentTime.getTime()-startTime)/one_min)
			  	  : duration+overtime} minutes`
			  	}</h5>	  
			  	<h5>{
			  	  `End Time : ${startTime ?
			  	  new Date(parseInt(startTime)+one_min*(duration+overtime)).toLocaleTimeString('en-US')
			  	  : ''}`
			  	}</h5>	 
			  </div>			   
			</Jumbotron>
			<Progress animated striped value={progress}/>	
			{isTA?
				(!startTime ? (
					<Button className={classes.button} onClick={handler.StartEvent}>
						Start
					</Button>
				):(
				<>
					<ExtendButton extendTime={5}/>
					<ExtendButton extendTime={10}/>
					<ExtendButton extendTime={30}/>
				</>
				)): (<></>)			
			}
			
		</div>
	)
}

export { Clock }
