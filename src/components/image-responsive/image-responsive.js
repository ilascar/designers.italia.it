import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

const ImageResponsive = (props) => {
  const { src, alt, ...otherProps } = props

  const data = useStaticQuery(graphql`
    query ImageResponsiveQuery {
      allRemoteAsset {
        nodes {
          file {
            childImageSharp {
              gatsbyImageData
            }
            publicURL
          }
          source
        }
      }
      allFile {
        nodes {
          childImageSharp {
            gatsbyImageData
          }
          absolutePath
          publicURL
        }
      }
    }
  `)

  const imageRemoteFound = data ? data.allRemoteAsset.nodes.find((asset) => asset.source === src) : null
  const imageFound = data ? data.allFile.nodes.find((asset) => asset.absolutePath.endsWith(src)) : null

  const gatsbyImageData = imageRemoteFound && imageRemoteFound.file.childImageSharp ? imageRemoteFound.file.childImageSharp.gatsbyImageData : imageFound && imageFound.childImageSharp ? imageFound.childImageSharp.gatsbyImageData : null
  const realSrc = imageRemoteFound ? imageRemoteFound.file.publicURL : imageFound ? imageFound.publicURL : src

  return (
    gatsbyImageData
      ? <GatsbyImage image={gatsbyImageData} alt={ alt || '' } {...otherProps} />
      : <img src={realSrc} alt={alt || ''}  {...otherProps} />
  )
}

export default ImageResponsive
