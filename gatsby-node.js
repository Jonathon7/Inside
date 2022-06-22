const { documentToHtmlString } = require("@contentful/rich-text-html-renderer")
const { getGatsbyImageResolver } = require("gatsby-plugin-image/graphql-utils")

exports.createSchemaCustomization = async ({ actions }) => {
  actions.createFieldExtension({
    name: "blocktype",
    extend(options) {
      return {
        resolve(source) {
          return source.internal.type.replace("Contentful", "")
        },
      }
    },
  })

  actions.createFieldExtension({
    name: "imagePassthroughArgs",
    extend(options) {
      const { args } = getGatsbyImageResolver()
      return {
        args,
      }
    },
  })

  actions.createFieldExtension({
    name: "imageUrl",
    extend(options) {
      const schemaRE = /^\/\//
      const addURLSchema = (str) => {
        if (schemaRE.test(str)) return `https:${str}`
        return str
      }
      return {
        resolve(source) {
          return addURLSchema(source.file.url)
        },
      }
    },
  })

  actions.createFieldExtension({
    name: "navItemType",
    args: {
      name: {
        type: "String!",
        defaultValue: "Link",
      },
    },
    extend(options) {
      return {
        resolve() {
          switch (options.name) {
            case "Group":
              return "Group"
            default:
              return "Link"
          }
        },
      }
    },
  })

  actions.createFieldExtension({
    name: "richText",
    extend(options) {
      return {
        resolve(source, args, context, info) {
          const body = source.body
          const doc = JSON.parse(body.raw)
          const html = documentToHtmlString(doc)
          return html
        },
      }
    },
  })

  // abstract interfaces
  actions.createTypes(/* GraphQL */ `
    interface HomepageBlock implements Node {
      id: ID!
      blocktype: String
    }

    interface HomepageLink implements Node {
      id: ID!
      href: String
      text: String
    }

    interface HeaderNavItem implements Node {
      id: ID!
      navItemType: String
    }

    interface NavItem implements Node & HeaderNavItem {
      id: ID!
      navItemType: String
      href: String
      text: String
      icon: HomepageImage
      description: String
    }

    interface NavItemGroup implements Node & HeaderNavItem {
      id: ID!
      navItemType: String
      name: String
      navItems: [NavItem]
    }

    interface HomepageImage implements Node {
      id: ID!
      alt: String
      gatsbyImageData: JSON @imagePassthroughArgs
      url: String
    }

    interface HomepageHero implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String!
      kicker: String
      subhead: String
      image: HomepageImage
      text: String
      links: [HomepageLink]
    }

    interface HomepageLogo implements Node {
      id: ID!
      image: HomepageImage
      alt: String
    }

    interface HomepageLogoList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      text: String
      logos: [HomepageLogo]
    }

    interface HomepageTestimonial implements Node {
      id: ID!
      quote: String
      source: String
      avatar: HomepageImage
    }

    interface HomepageTestimonialList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      kicker: String
      heading: String
      content: [HomepageTestimonial]
    }

    interface HomepageProduct implements Node {
      id: ID!
      heading: String
      text: String
      image: HomepageImage
      links: [HomepageLink]
    }

    interface HomepageProductList implements Node & HomepageBlock {
      id: ID!
      blocktype: String
      heading: String
      kicker: String
      text: String
      content: [HomepageProduct]
    }

    interface Homepage implements Node {
      id: ID!
      title: String
      description: String
      image: HomepageImage
      content: [HomepageBlock]
    }

    interface LayoutHeader implements Node {
      id: ID!
      navItems: [HeaderNavItem]
    }

    enum SocialService {
      TWITTER
      FACEBOOK
      INSTAGRAM
      YOUTUBE
      LINKEDIN
      GITHUB
      DISCORD
      TWITCH
    }

    interface SocialLink implements Node {
      id: ID!
      username: String!
      service: SocialService!
    }

    interface LayoutFooter implements Node {
      id: ID!
      links: [HomepageLink]
      meta: [HomepageLink]
      socialLinks: [SocialLink]
      copyright: String
    }

    interface Layout implements Node {
      id: ID!
      header: LayoutHeader
      footer: LayoutFooter
    }

    interface Page implements Node {
      id: ID!
      slug: String!
      title: String
      description: String
      image: HomepageImage
      html: String!
    }
  `)

  // CMS-specific types for Homepage
  actions.createTypes(/* GraphQL */ `
    type ContentfulHomepageLink implements Node & HomepageLink @dontInfer {
      id: ID!
      href: String
      text: String
    }

    type ContentfulNavItem implements Node & NavItem & HeaderNavItem
      @dontInfer {
      id: ID!
      navItemType: String @navItemType(name: "Link")
      href: String
      text: String
      icon: HomepageImage @link(from: "icon___NODE")
      description: String
    }

    type ContentfulNavItemGroup implements Node & NavItemGroup & HeaderNavItem
      @dontInfer {
      id: ID!
      navItemType: String @navItemType(name: "Group")
      name: String
      navItems: [NavItem] @link(from: "navItems___NODE")
    }

    type ContentfulAsset implements Node & HomepageImage {
      id: ID!
      alt: String @proxy(from: "title")
      gatsbyImageData: JSON
      url: String @imageUrl
      file: JSON
      title: String
    }

    type ContentfulHomepageHero implements Node & HomepageHero & HomepageBlock
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      heading: String!
      kicker: String
      subhead: String
      image: HomepageImage @link(from: "image___NODE")
      text: String
      links: [HomepageLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageLogo implements Node & HomepageLogo @dontInfer {
      id: ID!
      image: HomepageImage @link(from: "image___NODE")
      alt: String
    }

    type ContentfulHomepageLogoList implements Node & HomepageBlock & HomepageLogoList
      @dontInfer {
      blocktype: String @blocktype
      text: String
      logos: [HomepageLogo] @link(from: "logos___NODE")
    }

    type ContentfulHomepageTestimonial implements Node & HomepageTestimonial
      @dontInfer {
      id: ID!
      quote: String
      source: String
      avatar: HomepageImage @link(from: "avatar___NODE")
    }

    type ContentfulHomepageTestimonialList implements Node & HomepageBlock & HomepageTestimonialList
      @dontInfer {
      id: ID!
      blocktype: String @blocktype
      kicker: String
      heading: String
      content: [HomepageTestimonial] @link(from: "content___NODE")
    }

    type ContentfulHomepageProduct implements Node & HomepageProduct
      @dontInfer {
      heading: String
      text: String
      image: HomepageImage @link(from: "image___NODE")
      links: [HomepageLink] @link(from: "links___NODE")
    }

    type ContentfulHomepageProductList implements Node & HomepageProductList & HomepageBlock
      @dontInfer {
      blocktype: String @blocktype
      heading: String
      kicker: String
      text: String
      content: [HomepageProduct] @link(from: "content___NODE")
    }

    type ContentfulHomepage implements Node & Homepage @dontInfer {
      id: ID!
      title: String
      description: String
      image: HomepageImage @link(from: "image___NODE")
      content: [HomepageBlock] @link(from: "content___NODE")
    }
  `)

  actions.createTypes(`
    interface EmployeeResourcesPageBlock implements Node {
      id: ID!
      blocktype: String
    }

    interface EmployeeResourcesLink implements Node & EmployeeResourcesPageBlock {
      id: ID!
      blocktype: String
      name: String
      link: String
    }

    interface EmployeeResourcesPage implements Node {
      id: ID!
      title: String
      content: [EmployeeResourcesPageBlock]
    }

    interface EmployeeResourcesCategory implements Node & EmployeeResourcesPageBlock {
      id: ID!
      blocktype: String
      title: String
      links: [EmployeeResourcesPageBlock]
    }
  `)

  actions.createTypes(`
    interface HelpDeskPageBlock implements Node {
      id: ID!
      blocktype: String
    }

    interface HelpDeskPage implements Node {
      id: ID!
      title: String
      content: [HelpDeskPageBlock]
    }
  `)

  actions.createTypes(`
    interface ImageLink implements Node & HelpDeskPageBlock {
      id: ID!
      blocktype: String
      image: HomepageImage @link(from: "image___NODE")
      link: String
    }
  `)

  actions.createTypes(`
    type ContentfulEmployeeResourcesPage implements Node & EmployeeResourcesPage
      @dontinfer {
        id: ID!
        title: String
        blocks: [EmployeeResourcesPageBlock]
      }

    type ContentfulEmployeeResourcesCategory implements Node & EmployeeResourcesCategory & EmployeeResourcesPageBlock
      @dontinfer {
        id: ID!
        blocktype: String @blocktype
        title: String
        blocks: [EmployeeResourcesPageBlock]
      }

    type ContentfulEmployeeResourcesLink implements Node & EmployeeResourcesLink & EmployeeResourcesPageBlock
      @dontinfer {
        id: ID!
        blocktype: String @blocktype
        name: String
        link: String
      }
  `)

  actions.createTypes(`
    type ContentfulHelpDeskPage implements Node & HelpDeskPage
      @dontinfer {
        id: ID!
        title: String
        blocks: [HelpDeskPageBlock]
      }

    type ContentfulImageLink implements Node & ImageLink & HelpDeskPageBlock
      @dontInfer {
        id: ID!
        blocktype: String @blocktype
        image: HomepageImage @link(from: "image___NODE")
        link: String
      }
  `)

  // Layout types
  actions.createTypes(/* GraphQL */ `
    type ContentfulLayoutHeader implements Node & LayoutHeader @dontInfer {
      id: ID!
      navItems: [HeaderNavItem] @link(from: "navItems___NODE")
    }

    type ContentfulSocialLink implements Node & SocialLink @dontInfer {
      id: ID!
      username: String!
      service: SocialService!
    }

    type ContentfulLayoutFooter implements Node & LayoutFooter @dontInfer {
      id: ID!
      links: [HomepageLink] @link(from: "links___NODE")
      meta: [HomepageLink] @link(from: "meta___NODE")
      socialLinks: [SocialLink] @link(from: "socialLinks___NODE")
      copyright: String
    }

    type ContentfulLayout implements Node & Layout @dontInfer {
      id: ID!
      header: LayoutHeader @link(from: "header___NODE")
      footer: LayoutFooter @link(from: "footer___NODE")
    }
  `)

  // Page types
  actions.createTypes(/* GraphQL */ `
    type ContentfulPage implements Node & Page {
      id: ID!
      slug: String!
      title: String
      description: String
      image: HomepageImage @link(from: "image___NODE")
      html: String! @richText
    }
  `)
}
