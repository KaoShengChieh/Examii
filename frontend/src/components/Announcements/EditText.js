import React, { useState } from 'react'
import EdiText from 'react-editext'
import { Remarkable } from 'remarkable'
import styled from 'styled-components'
import {
  check_img,
  close_img,
  edit_img
} from '../../materials'
import classes from './EditText.module.css'

const md = new Remarkable()

const EditText = ({ announcement, UpdateAnnouncement, isTA }) => {
  const { id, content } = announcement
  const [mdMode, setMdMode] = useState(false)

  const saveData = (updatedContent) => {

    const variables = {
      announcementID: id,
      updatedContent
    }
    UpdateAnnouncement(variables)
    setMdMode(false)
  }

  const MdToElement = mdstr => {
    const __html = md.render(mdstr)
    return <p dangerouslySetInnerHTML={{ __html }}></p>
  }

  const StyledEdiText = styled(EdiText)`
    button {
      border-radius: 10px;
    }
    input, textarea {
      border-radius: 5px;
      height: 8em;
    }
    div[editext="view-container"], div[editext="edit-container"] {
      border-radius: 5px;
      width: 100%;
      min-height: 3em;
	  }
  `

  return (
    isTA ?
      (<StyledEdiText
        viewContainerClassName={classes.mycustomviewwrapper}
        type='textarea'
        saveButtonContent={<img src={check_img} alt='check' />}
        cancelButtonContent={<img src={close_img} alt='close' />}
        editButtonContent={<img src={edit_img} alt='trash' />}
        value={mdMode ? content : MdToElement(content)}
        onEditingStart={() => setMdMode(true)}
        editing={mdMode}
        onSave={saveData}
        onCancel={() => setMdMode(false)}
        hideIcons={true}
      />) :
      (<>{MdToElement(content)}</>)
  )
}

export default EditText