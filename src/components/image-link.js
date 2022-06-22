import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import * as React from "react"
import { Container, Section, NavLink } from "./ui"

export default function ImageLink(props) {
  return (
    <Section>
      <Container>
        <NavLink to={props.link} target="_blank">
          <GatsbyImage
            alt={props.image.alt}
            image={getImage(props.image.gatsbyImageData)}
          />
        </NavLink>
      </Container>
    </Section>
  )
}

export const query = graphql`
  fragment ImageLinkContent on ImageLink {
    id
    image {
      id
      gatsbyImageData
      alt
    }
    link
  }
`
