import { graphql } from "gatsby"
import * as React from "react"
import { Container, Section, FlexList, NavLink, Text, Subhead } from "./ui"

export default function EmployeeResourcesCategory(props) {
  return (
    <Section>
      <Container>
        <Subhead>{props.title}</Subhead>
        <FlexList variant="columnStart">
          {props.blocks.map((elem) => {
            return (
              <NavLink to={props.link} target="_blank" key={elem.id}>
                <Text style={{ display: "inline-block" }}>{elem.name}</Text>
              </NavLink>
            )
          })}
        </FlexList>
      </Container>
    </Section>
  )
}

export const query = graphql`
  fragment EmployeeResourcesCategoryContent on EmployeeResourcesCategory {
    id
    title
    blocks: links {
      id
      blocktype
      ...EmployeeResourcesLinkContent
    }
  }
`

export const query2 = graphql`
  fragment EmployeeResourcesLinkContent on EmployeeResourcesLink {
    id
    name
    link
  }
`
