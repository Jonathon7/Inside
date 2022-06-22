import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import Fallback from "../components/fallback"

export default function HelpDesk(props) {
  const { helpDeskPage } = props.data

  return (
    <Layout {...helpDeskPage}>
      {helpDeskPage.blocks.map((block) => {
        const { id, blocktype, ...componentProps } = block
        const Component = sections[blocktype] || Fallback
        return <Component key={id} {...componentProps} />
      })}
    </Layout>
  )
}

export const query = graphql`
  {
    helpDeskPage {
      id
      title
      blocks: content {
        id
        blocktype
        ...ImageLinkContent
      }
    }
  }
`
