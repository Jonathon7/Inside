import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import Fallback from "../components/fallback"
import { FlexList } from "../components/ui"

export default function EmployeeResources(props) {
  const { employeeResourcesPage } = props.data

  return (
    <Layout {...employeeResourcesPage}>
      <FlexList variant="start">
        {employeeResourcesPage.blocks.map((block) => {
          const { id, blocktype, ...componentProps } = block
          const Component = sections[blocktype] || Fallback
          return <Component key={id} {...componentProps} />
        })}
      </FlexList>
    </Layout>
  )
}

export const query = graphql`
  {
    employeeResourcesPage {
      id
      title
      blocks: content {
        id
        blocktype
        ...EmployeeResourcesCategoryContent
      }
    }
  }
`
