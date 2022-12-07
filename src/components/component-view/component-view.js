import React from "react"
import { v4 as uuidv4 } from 'uuid'

//import DOMPurify from 'isomorphic-dompurify'
import sanitizeHtml from 'sanitize-html'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Button from "../button/button"
import Icon from "../icon/icon"
import loadable from "@loadable/component"

import "./component-view.scss"

import { Notification } from 'bootstrap-italia'

const SyntaxHighlighter = loadable(() => import('./syntax-highlighter'))

const ComponentView = ({
  content,
  viewer,
  accordionLabel,
  accordionUrl,
  accordionSrLabel,
  accordionSrCopyLabel
}) => {

  const theme = a11yDark;

  const createMarkup = (html) => {
    return { __html: sanitizeHtml(html, {
      allowedTags: false, //all tags allowed
      allowedAttributes: false, //all attribs allowed
    }) };
  }

  const copyToClipboard = (e, code) => {
    e.preventDefault()
    navigator.clipboard.writeText(code)
    // console.log("Codice copiato negli appunti!")
    const notification = new Notification(document.getElementById("copyToast"), {
      timeout: 3000
    })
    notification.show()
  }

  const ICON_EXTERNAL = {
    icon: "sprites.svg#it-external-link",
    size: "sm",
    color: "primary",
    addonClasses: "align-middle me-3",
  }

  const ICON_COPY_CODE = {
    icon: "sprites.svg#it-copy",
    size: "sm",
    color: "primary",
    addonClasses: "align-middle me-3",
  }

  const ICON_SUCCESS = {
    icon: "sprites.svg#it-check-circle",
  }

  const uuid = 'component-view-' + uuidv4()
  const accId = uuid + '-accordion'
  const headId = uuid + '-heading'
  const collId = uuid + '-collapse'
  let responsiveButtonsItems

  content = content.replace(/^\s+|\s+$/g, '')

  if (viewer) {
    responsiveButtonsItems = (viewer.responsiveButtons).map((item,index) => {
      return(
        <Button key={"rb"-+index} {...item}/>
      )
    })
  }

  let componentStyles = "bg-light p-3 p-md-5"
    + `${responsiveButtonsItems ? ' pt-4' : ''}`

  return (
    <>
      <div className={componentStyles}>
        {responsiveButtonsItems &&
          <div className="d-flex align-items-center justify-content-center mb-4">
            {responsiveButtonsItems}
          </div>
        }
        <div dangerouslySetInnerHTML={createMarkup(content)} />
      </div>
      <div className="accordion accordion-left-icon" id={accId}>
        <div className="accordion-item">
          <div className="d-flex justify-content-between align-items-center" id={headId}>
            <h3 id="codeViewer" className ="accordion-header ">
              <button className="accordion-button border-top-0" type="button" data-bs-toggle="collapse" data-bs-target={'#' + collId } aria-expanded="true" aria-controls={collId}>
                {accordionLabel}
              </button>
            </h3>
            <div className="d-flex justify-content-between align-items-center">
              {content &&
                <a href="" onClick={(e) => copyToClipboard(e, content)} aria-label={accordionSrCopyLabel}>
                  <Icon {...ICON_COPY_CODE}/>
                </a>
              }
              {accordionUrl &&
                <a href={accordionUrl} target="_blank" aria-label={accordionSrLabel}>
                  <Icon {...ICON_EXTERNAL}/>
                </a>
              }
            </div>
            </div>

          <div id={collId} className="accordion-collapse collapse hide" data-bs-parent={'#' + accId} role="region" aria-labelledby={headId}>
            <div className="accordion-body p-0">
              <SyntaxHighlighter language="markup" style={theme} showLineNumbers={true}>
                {content}
              </SyntaxHighlighter>
            </div>
          </div>
          <div class="notification with-icon right-fix success dismissable fade" role="alert" aria-labelledby="not1d-title" id="copyToast">
              <h2 id="not1d-title" class="h5 "><Icon {...ICON_SUCCESS}/>Codice copiato negli appunti</h2>
          </div>
        </div>
      </div>
    </>
  )
}

export default ComponentView
